import { notFound } from "next/navigation";
// Unmatched URLs render the magazine's own 404 inside the site layout.
export default function Missing() {
  notFound();
}
