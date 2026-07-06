import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { rateLimit, clientIp, sweep } from "@/lib/ratelimit";
import { parseBody } from "@/lib/validate";

/* POST /api/contact — sales/support contact. Emails the team (gated by RESEND_API_KEY;
   no-ops gracefully in dev). */
export async function POST(req: Request) {
  sweep();
  const rl = rateLimit(`contact:${clientIp(req)}`, 5, 60 * 60_000);
  if (!rl.ok) return NextResponse.json({ error: "Too many messages. Please try again later." }, { status: 429 });
  const v = await parseBody(req, {
    name: { max: 200 },
    email: { required: true, email: true, max: 320 },
    message: { required: true, min: 5, max: 5000 },
  });
  if (!v.ok) return v.res;
  const { name, email, message } = v.data;
  await sendEmail({
    to: process.env.CONTACT_TO ?? "hello@lectern.ai",
    subject: `Contact from ${name || email}`,
    html: `<p><b>${name || "(no name)"}</b> &lt;${email}&gt;</p><p>${message.replace(/</g, "&lt;")}</p>`,
    text: `${name} <${email}>\n\n${message}`,
  });
  return NextResponse.json({ ok: true });
}
