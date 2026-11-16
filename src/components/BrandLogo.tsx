import Image from "next/image";
export default function BrandLogo({ light = false }: { light?: boolean }) {
  // Stable dimensions reserve space before the vector asset loads.
  return (
    <Image
      className="brand-logo"
      src={`/brand/wordmark${light ? "-light" : ""}.svg`}
      width="280"
      height="72"
      alt=""
      aria-hidden="true"
    />
  );
}
