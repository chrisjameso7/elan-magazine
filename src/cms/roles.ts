// Client-safe role check; server authorization applies the collection access rules.
export function isEditor(user: unknown): boolean {
  if (!user || typeof user !== "object" || !("role" in user)) return false;
  return user.role === "administrator" || user.role === "editor";
}
