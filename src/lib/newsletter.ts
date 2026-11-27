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
): Promise<{ created: boolean }> {
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
  if (created.ok) return { created: true };
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
  return { created: false };
}

const welcomeText = `You're on the list.

Every Thursday you'll get one email from The Index: the new Index 50, the reviews worth reading, and the people we think are next.

Know someone we should be writing about? Tell us: https://lumiereindex.com/put-us-on

Every newsletter has an unsubscribe link at the bottom.

The Index
Magazine by Lumière
https://lumiereindex.com`;

export function welcomeEmailHTML() {
  const p = (text: string) =>
    `<p style="margin:0 0 16px;font:16px/1.55 Arial,Helvetica,sans-serif;color:#121212">${text}</p>`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>You’re on the list</title></head><body style="margin:0;padding:0;background:#F4F1EA">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#F4F1EA"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:2px solid #121212">
<tr><td style="padding:28px 28px 8px;border-bottom:3px solid #FF5A1F">
<p style="margin:0;font:28px/1 Georgia,'Times New Roman',serif;color:#121212">the <i>index</i></p>
<p style="margin:6px 0 16px;font:bold 10px/1 Arial,Helvetica,sans-serif;letter-spacing:2px;color:#4A463F">MAGAZINE BY LUMIÈRE</p></td></tr>
<tr><td style="padding:28px">
<p style="margin:0 0 18px;font:34px/1.05 Georgia,'Times New Roman',serif;color:#121212">You’re on the <i>list.</i></p>
${p("Every Thursday you’ll get one email from us: the new Index 50, the reviews worth reading, and the people we think are next.")}
${p('Know someone we should be writing about? <a href="https://lumiereindex.com/put-us-on" style="color:#C2410C">Tell us</a>.')}
<p style="margin:24px 0 0"><a href="https://lumiereindex.com" style="display:inline-block;background:#FF5A1F;color:#121212;border:2px solid #121212;border-radius:999px;padding:12px 20px;font:bold 15px Arial,Helvetica,sans-serif;text-decoration:none">Read The Index</a></p>
</td></tr>
<tr><td style="padding:18px 28px;background:#121212"><p style="margin:0;font:12px/1.6 Arial,Helvetica,sans-serif;color:#B8B2A7">Every newsletter has an unsubscribe link at the bottom. Questions? Reply to this email.</p></td></tr>
</table></td></tr></table></body></html>`;
}

/** One welcome email for a new subscriber. Never throws: sign-up already succeeded. */
export async function sendWelcome(email: string, apiKey: string, fetchImpl: Fetch = fetch) {
  try {
    const response = await fetchImpl(`${API}/emails`, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "The Index <newsletter@lumiereindex.com>",
        to: [email],
        reply_to: "contact@lumiereindex.com",
        subject: "You’re on the list",
        html: welcomeEmailHTML(),
        text: welcomeText,
      }),
    });
    if (!response.ok) console.error("Welcome email failed", response.status);
  } catch (error) {
    console.error("Welcome email failed", error instanceof Error ? error.message : error);
  }
}
