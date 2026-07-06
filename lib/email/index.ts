/* Transactional email via the Resend REST API — no SDK dependency, gated by env.
   Used for verification, password reset, receipts, and team invites. */

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

const FROM = process.env.EMAIL_FROM ?? "Lectern <noreply@lectern.ai>";

export async function sendEmail(opts: { to: string; subject: string; html: string; text?: string }): Promise<{ ok: boolean; skipped?: boolean }> {
  if (!isEmailConfigured()) {
    // Dev/demo: no-op so flows don't crash without an email provider.
    if (process.env.NODE_ENV !== "production") console.info(`[email skipped] → ${opts.to}: ${opts.subject}`);
    return { ok: true, skipped: true };
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${process.env.RESEND_API_KEY}`, "content-type": "application/json" },
    body: JSON.stringify({ from: FROM, to: opts.to, subject: opts.subject, html: opts.html, text: opts.text }),
  });
  return { ok: res.ok };
}

// Minimal, on-brand HTML templates (monochrome).
export function verifyEmailHtml(link: string): string {
  return shell("Verify your email", `Confirm your email to finish setting up Lectern.`, link, "Verify email");
}
export function resetPasswordHtml(link: string): string {
  return shell("Reset your password", `Click below to choose a new password. This link expires in 1 hour.`, link, "Reset password");
}
export function inviteHtml(org: string, link: string): string {
  return shell(`Join ${org} on Lectern`, `You've been invited to the ${org} workspace.`, link, "Accept invite");
}

function shell(title: string, body: string, link: string, cta: string): string {
  return `<!doctype html><html><body style="margin:0;background:#09090a;color:#f4f4f2;font-family:Archivo,Helvetica,Arial,sans-serif">
  <div style="max-width:480px;margin:0 auto;padding:40px 28px">
    <div style="font-weight:800;font-size:18px;letter-spacing:-.02em;margin-bottom:24px">Lectern</div>
    <div style="font-size:20px;font-weight:700;margin-bottom:10px">${title}</div>
    <div style="font-size:14px;line-height:1.55;color:#a0a09b;margin-bottom:24px">${body}</div>
    <a href="${link}" style="display:inline-block;background:#f4f4f2;color:#0a0a0a;border-radius:8px;padding:12px 20px;font-weight:600;font-size:14px;text-decoration:none">${cta}</a>
    <div style="font-size:12px;color:#55554f;margin-top:28px">If you didn't request this, you can ignore this email.</div>
  </div></body></html>`;
}
