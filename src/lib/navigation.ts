export const editorialNavigation = [
  { label: "Discover", href: "/sections/discover", slug: "discover" },
  { label: "Critique", href: "/sections/critique", slug: "critique" },
  { label: "Personal", href: "/sections/personal", slug: "personal" },
  { label: "The Index", href: "/the-index", slug: "the-index" },
  { label: "Called It", href: "/called-it", slug: "called-it" },
] as const;
export const verdicts = {
  obsessed: { label: "Obsessed", tone: "highlight" },
  "on-repeat": { label: "On repeat", tone: "outline" },
  fine: { label: "It’s fine", tone: "dashed" },
  skip: { label: "Skip", tone: "ink" },
} as const;
export type VerdictKey = keyof typeof verdicts;
