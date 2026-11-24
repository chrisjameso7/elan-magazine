import { readFileSync } from "node:fs";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import type sharp from "sharp";

type ImageInfo = { width: number; height: number; format: string };
type Pipeline = {
  transform(options: Record<string, unknown>): Pipeline;
  output(options: {
    format: string;
    quality?: number;
    anim: boolean;
  }): Promise<{ response(): Response }>;
};
type Images = {
  info(input: ReadableStream<Uint8Array>): Promise<ImageInfo>;
  input(input: ReadableStream<Uint8Array>): Pipeline;
};
type Operation =
  | {
      kind: "resize";
      width?: number;
      height?: number;
      fit?: string;
      withoutEnlargement?: boolean;
    }
  | {
      kind: "extract";
      left: number;
      top: number;
      width: number;
      height: number;
    }
  | { kind: "rotate"; angle: number };
const mime = (format: string) => {
  const value = format.replace(/^image\//, "").replace("jpg", "jpeg");
  if (!["jpeg", "png", "webp", "avif"].includes(value))
    throw Error("Unsupported image output format.");
  return `image/${value}`;
};
const stream = (data: Uint8Array) => new Response(data as BodyInit).body!;

/** Payload's upload pipeline needs Sharp's chain shape. Image work runs in the Images service, not native binaries. */
export class ImageProcessor {
  private operations: Operation[] = [];
  private outputFormat?: string;
  private quality?: number;
  private infoPromise?: Promise<ImageInfo>;
  constructor(
    private data: Uint8Array,
    private images: Images,
    private animated: boolean,
  ) {}
  async metadata() {
    this.infoPromise ??= this.images.info(stream(this.data));
    return this.infoPromise;
  }
  rotate(angle?: number) {
    if (angle !== undefined) this.operations.push({ kind: "rotate", angle });
    return this;
  }
  resize(options: {
    width?: number;
    height?: number;
    fit?: string;
    withoutEnlargement?: boolean;
  }) {
    this.operations.push({ kind: "resize", ...options });
    return this;
  }
  extract(options: {
    left: number;
    top: number;
    width: number;
    height: number;
  }) {
    this.operations.push({ kind: "extract", ...options });
    return this;
  }
  toFormat(format: string, options?: { quality?: number }) {
    mime(format);
    this.outputFormat = format;
    this.quality = options?.quality;
    return this;
  }
  clone() {
    const copy = new ImageProcessor(this.data, this.images, this.animated);
    copy.operations = [...this.operations];
    copy.outputFormat = this.outputFormat;
    copy.quality = this.quality;
    copy.infoPromise = this.infoPromise;
    return copy;
  }
  async toBuffer(options?: { resolveWithObject?: boolean }) {
    const original = await this.metadata();
    let width = original.width,
      height = original.height;
    let pipeline = this.images.input(stream(this.data));
    for (const operation of this.operations) {
      if (operation.kind === "rotate") {
        pipeline = pipeline.transform({ rotate: operation.angle });
        if (Math.abs(operation.angle) % 180 === 90)
          [width, height] = [height, width];
      }
      if (operation.kind === "resize") {
        const fit = operation.fit || "cover";
        const fits: Record<string, string> = {
          cover: "cover",
          contain: "contain",
          fill: "squash",
          inside: "contain",
          outside: "cover",
        };
        if (!fits[fit]) throw Error("Unsupported image resize fit.");
        const w = operation.width,
          h = operation.height;
        if (!w && !h) continue;
        let scale =
          w && h
            ? fit === "cover" || fit === "outside"
              ? Math.max(w / width, h / height)
              : Math.min(w / width, h / height)
            : w
              ? w / width
              : h! / height;
        if (operation.withoutEnlargement) scale = Math.min(1, scale);
        const targetWidth = Math.max(1, Math.round(width * scale)),
          targetHeight = Math.max(1, Math.round(height * scale));
        // Inside/outside only scale; cover/contain with both dimensions use the requested canvas.
        const constrainCanvas =
          !!w && !!h && !["inside", "outside"].includes(fit);
        const selectedFit = operation.withoutEnlargement
          ? "scale-down"
          : constrainCanvas
            ? fits[fit]
            : "contain";
        const dimensions =
          w && !h
            ? { width: w }
            : h && !w
              ? { height: h }
              : {
                  width: constrainCanvas ? w : targetWidth,
                  height: constrainCanvas ? h : targetHeight,
                };
        pipeline = pipeline.transform({ ...dimensions, fit: selectedFit });
        width = constrainCanvas ? w! : targetWidth;
        height = constrainCanvas ? h! : targetHeight;
      }
      if (operation.kind === "extract") {
        const right = width - operation.left - operation.width,
          bottom = height - operation.top - operation.height;
        if (Math.min(operation.left, operation.top, right, bottom) < 0)
          throw Error("Image crop is outside the image bounds.");
        pipeline = pipeline.transform({
          trim: { left: operation.left, top: operation.top, right, bottom },
        });
        width = operation.width;
        height = operation.height;
      }
    }
    const format = mime(this.outputFormat || original.format);
    const result = await pipeline.output({
      format,
      quality: this.quality,
      anim: this.animated,
    });
    const data = Buffer.from(await result.response().arrayBuffer());
    const actual = await this.images.info(stream(data));
    const info = {
      width: actual.width,
      height: actual.height,
      format: actual.format.replace(/^image\//, ""),
      size: data.byteLength,
    };
    return options?.resolveWithObject ? { data, info } : data;
  }
}

export const cloudflareImages = ((
  input: Uint8Array | string,
  options?: { animated?: boolean },
) => {
  const { env } = getCloudflareContext();
  const images = (env as unknown as { IMAGES?: Images }).IMAGES;
  if (!images)
    throw Error(
      "The Cloudflare IMAGES binding is required for newsroom uploads.",
    );
  const bytes = typeof input === "string" ? readFileSync(input) : input;
  return new ImageProcessor(bytes, images, options?.animated || false);
}) as unknown as typeof sharp;
