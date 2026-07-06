import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { buildAuthorizeUrl, isProviderConfigured, type Provider } from "@/lib/auth/oauth";
import { isDbConfigured } from "@/lib/db";

const VALID: Provider[] = ["google", "github"];

export async function GET(req: Request, ctx: { params: Promise<{ provider: string }> }) {
  const { provider } = await ctx.params;
  const origin = new URL(req.url).origin;

  if (!VALID.includes(provider as Provider)) {
    return NextResponse.redirect(`${origin}/login?error=unknown_provider`);
  }
  const p = provider as Provider;
  if (!isDbConfigured() || !isProviderConfigured(p)) {
    return NextResponse.redirect(`${origin}/login?error=oauth_unconfigured`);
  }

  const state = randomBytes(16).toString("base64url");
  const jar = await cookies();
  jar.set(`oauth_state_${p}`, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
  return NextResponse.redirect(buildAuthorizeUrl(p, state));
}
