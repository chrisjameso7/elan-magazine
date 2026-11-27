import localFont from "next/font/local";
export const serif = localFont({
  src: [
    { path: "../fonts/instrument-serif-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/instrument-serif-latin-400-italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-serif",
  display: "swap",
});
export const sans = localFont({
  src: [
    { path: "../fonts/inter-tight-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/inter-tight-latin-400-italic.woff2", weight: "400", style: "italic" },
    { path: "../fonts/inter-tight-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../fonts/inter-tight-latin-700-normal.woff2", weight: "700", style: "normal" },
    { path: "../fonts/inter-tight-latin-800-normal.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-sans",
  display: "swap",
});
export const mono = localFont({
  src: [
    { path: "../fonts/jetbrains-mono-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/jetbrains-mono-latin-600-normal.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-mono",
  display: "swap",
});
