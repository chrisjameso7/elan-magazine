type Fetch = typeof fetch;
const API = "https://api.resend.com";

export function parseSubscriber(body: unknown): { email: string } | { error: string } {
  if (!body || typeof body !== "object") return { error: "Send the form again." };
  const data = body as Record<string, unknown>;
  if (typeof data.website === "string" && data.website.trim())
    return { error: "Send the form again." };
  const email =
    typeof data.email === "string" ? data.email.trim().toLowerCase().slice(0, 320) : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return { error: "That email doesn’t look right." };
  return { email };
}

/**
 * Adds a reader to The Index newsletter in Resend: the Lumière segment plus an
 * explicit opt-in to "The Index, weekly". Works for new contacts and for
 * contacts that already exist in the shared Resend account.
 */
export async function subscribe(
  email: string,
  config: { apiKey: string; segmentId: string; topicId: string },
  fetchImpl: Fetch = fetch,
) {
  const headers = {
    Authorization: `Bearer ${config.apiKey}`,
    "Content-Type": "application/json",
  };
  const topics = [{ id: config.topicId, subscription: "opt_in" }];
  const created = await fetchImpl(`${API}/contacts`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      email,
      unsubscribed: false,
      segments: [{ id: config.segmentId }],
      topics,
    }),
  });
  if (created.ok) return;
  if (created.status >= 500 || created.status === 401 || created.status === 403)
    throw new Error(`Resend contact create failed: ${created.status}`);
  // The contact already exists (for example from another newsletter on this
  // account): add it to the segment and opt it in to this topic only.
  const contact = encodeURIComponent(email);
  const segment = await fetchImpl(
    `${API}/contacts/${contact}/segments/${config.segmentId}`,
    { method: "POST", headers },
  );
  if (!segment.ok && segment.status !== 409 && segment.status !== 422)
    throw new Error(`Resend segment add failed: ${segment.status}`);
  let topic = await fetchImpl(`${API}/contacts/${contact}/topics`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(topics),
  });
  if (!topic.ok && topic.status < 500)
    topic = await fetchImpl(`${API}/contacts/${contact}/topics`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ topics }),
    });
  if (!topic.ok) throw new Error(`Resend topic update failed: ${topic.status}`);
}
