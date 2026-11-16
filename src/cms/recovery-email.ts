import { cmsServerURL } from "./hosting";

function escapeHTML(value: string) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        character
      ]!,
  );
}

export function recoveryEmail({
  token,
  name,
  origin = cmsServerURL(),
}: {
  token: string;
  name?: string;
  origin?: string;
}) {
  const base = cmsServerURL({ CMS_SERVER_URL: origin });
  const link = `${base}/admin/reset/${encodeURIComponent(token)}`;
  const safeLink = escapeHTML(link);
  const greeting = name ? `Hello ${escapeHTML(name)},` : "Hello,";
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Your Lumière newsroom account</title></head><body style="margin:0;padding:0;background:#f0f1ee;color:#191c1c;font-family:Arial,Helvetica,sans-serif"><div style="display:none;max-height:0;overflow:hidden;opacity:0">Your secure link to reset your Lumière Index newsroom password.</div><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr><td align="center" style="padding:36px 16px"><table role="presentation" width="560" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:560px;background:#fff;border-top:5px solid #ff4f32"><tr><td style="padding:32px 32px 24px;border-bottom:1px solid #e2e6df"><img src="${base}/brand/lumiere-index-logo.png" alt="Lumière Index" width="196" height="50" style="display:block;width:196px;max-width:100%;height:auto;border:0"><p style="margin:18px 0 0;font-size:10px;font-weight:bold;letter-spacing:2px;color:#606663">NEWS THAT MATTERS.</p></td></tr><tr><td style="padding:32px"><p style="margin:0 0 18px;font-size:11px;letter-spacing:1.8px;color:#b92c16;font-weight:bold">NEWSROOM / ACCOUNT SECURITY</p><h1 style="font-size:30px;line-height:1.15;letter-spacing:-1px;margin:0 0 28px;font-weight:bold">Back to the newsroom.</h1><p style="font-size:15px;line-height:1.7;margin:0 0 16px">${greeting}</p><p style="font-size:15px;line-height:1.7;margin:0 0 24px">We received a request to set a new password for your Lumière Index newsroom account. Use the secure link below to choose your password.</p><table role="presentation" cellspacing="0" cellpadding="0" border="0"><tr><td bgcolor="#191c1c" style="border-bottom:3px solid #ff4f32"><a href="${safeLink}" style="display:inline-block;padding:16px 25px;color:#fff;text-decoration:none;font-size:13px;font-weight:bold">Set your newsroom password &nbsp; →</a></td></tr></table><p style="font-size:12px;line-height:1.7;margin:24px 0 0;color:#606663">This is a one-use link and it expires. If you didn’t request this email, you can ignore it. Your password will stay unchanged.</p><div style="border-top:1px solid #e2e6df;margin-top:28px;padding-top:20px"><p style="font-size:11px;line-height:1.7;color:#606663;margin:0 0 8px">Button not working? Copy this full link into your browser:</p><a href="${safeLink}" style="font-size:11px;line-height:1.7;color:#b92c16;word-break:break-all">${safeLink}</a></div></td></tr><tr><td style="background:#f7f8f5;padding:24px 32px;border-top:1px solid #e2e6df"><p style="font-size:10px;line-height:1.8;color:#606663;margin:0">Lumière Index · Lumiere Media and Entertainment Technologies<br>Entertainment. Culture. Everything in between.</p></td></tr></table><p style="max-width:480px;margin:20px auto 0;font-size:10px;line-height:1.7;color:#606663">Keep this email private. Lumière Index will never ask you to send your password by email.</p></td></tr></table></body></html>`;
}
