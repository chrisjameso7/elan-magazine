import {
  RichText,
  type JSXConvertersFunction,
} from "@payloadcms/richtext-lexical/react";
import type { Article, Media } from "@/cms/payload-types";
import StoryImage from "./StoryImage";
import { safeURL } from "@/lib/safe-url";
const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  link: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children });
    const internal =
      node.fields.linkType === "internal" &&
      typeof node.fields.doc?.value === "object" &&
      node.fields.doc.value &&
      "slug" in node.fields.doc.value
        ? `/news/${node.fields.doc.value.slug}`
        : undefined;
    const href = internal || safeURL(node.fields.url);
    return href ? (
      <a
        href={href}
        target={node.fields.newTab ? "_blank" : undefined}
        rel={node.fields.newTab ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    ) : (
      <span>{children}</span>
    );
  },
  autolink: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children });
    const href = safeURL(node.fields.url);
    return href ? <a href={href}>{children}</a> : <span>{children}</span>;
  },
  upload: ({ node }) => {
    const media = node.value as Media | null;
    if (!media || typeof media !== "object" || !safeURL(media.url))
      return (
        <span className="media-unavailable">Image currently unavailable.</span>
      );
    return (
      <figure>
        <StoryImage media={media} sizes="(min-width:800px) 680px, 100vw" />
        <figcaption>
          {media.caption}
          {media.credit && <span>Photo: {media.credit}</span>}
        </figcaption>
      </figure>
    );
  },
});
export default function ArticleBody({ body }: { body: Article["body"] }) {
  return (
    <div className="article-prose">
      <RichText data={body} converters={converters} />
    </div>
  );
}
