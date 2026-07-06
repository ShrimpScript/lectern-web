import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { and, eq } from "drizzle-orm";
import { exchangeCode, fetchProfile, isProviderConfigured, type Provider } from "@/lib/auth/oauth";
import { getDb, isDbConfigured, schema } from "@/lib/db";
import { createSession } from "@/lib/auth/session";

const VALID: Provider[] = ["google", "github"];

export async function GET(req: Request, ctx: { params: Promise<{ provider: string }> }) {
  const { provider } = await ctx.params;
  const url = new URL(req.url);
  const origin = url.origin;
  const fail = (e: string) => NextResponse.redirect(`${origin}/login?error=${e}`);

  if (!VALID.includes(provider as Provider)) return fail("unknown_provider");
  const p = provider as Provider;
  if (!isDbConfigured() || !isProviderConfigured(p)) return fail("oauth_unconfigured");

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const jar = await cookies();
  const expected = jar.get(`oauth_state_${p}`)?.value;
  jar.delete(`oauth_state_${p}`);
  if (!code || !state || !expected || state !== expected) return fail("oauth_state");

  try {
    const accessToken = await exchangeCode(p, code);
    const profile = await fetchProfile(p, accessToken);
    const db = getDb();

    // 1) existing oauth link?
    const linked = await db
      .select({ userId: schema.oauthAccounts.userId })
      .from(schema.oauthAccounts)
      .where(and(eq(schema.oauthAccounts.provider, p), eq(schema.oauthAccounts.providerAccountId, profile.providerAccountId)))
      .limit(1);

    let userId = linked[0]?.userId;

    if (!userId) {
      // 2) existing user by email? link it. else 3) create.
      const byEmail = await db.select({ id: schema.users.id }).from(schema.users).where(eq(schema.users.email, profile.email)).limit(1);
      if (byEmail[0]) {
        userId = byEmail[0].id;
      } else {
        const created = await db
          .insert(schema.users)
          .values({ email: profile.email, name: profile.name, image: profile.image, emailVerified: new Date(), authProviders: [p] })
          .returning({ id: schema.users.id });
        userId = created[0].id;
      }
      await db.insert(schema.oauthAccounts).values({ provider: p, providerAccountId: profile.providerAccountId, userId }).onConflictDoNothing();
    }

    await createSession(userId);
    return NextResponse.redirect(`${origin}/dashboard`);
  } catch {
    return fail("oauth_failed");
  }
}
