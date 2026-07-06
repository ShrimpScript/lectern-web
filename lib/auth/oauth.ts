/* Manual OAuth2 (authorization-code) for Google + GitHub — no external dependency.
   Gated by env; if a provider's client id/secret is absent it's treated as
   unconfigured and the UI shows a friendly message. ADR-017. */

export type Provider = "google" | "github";

export type OAuthProfile = {
  providerAccountId: string;
  email: string;
  name: string | null;
  image: string | null;
};

type ProviderCfg = {
  authorizeUrl: string;
  tokenUrl: string;
  scope: string;
  clientId?: string;
  clientSecret?: string;
};

export function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export function redirectUri(provider: Provider): string {
  return `${siteUrl()}/api/auth/${provider}/callback`;
}

export function providerConfig(provider: Provider): ProviderCfg {
  if (provider === "google") {
    return {
      authorizeUrl: "https://accounts.google.com/o/oauth2/v2/auth",
      tokenUrl: "https://oauth2.googleapis.com/token",
      scope: "openid email profile",
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    };
  }
  return {
    authorizeUrl: "https://github.com/login/oauth/authorize",
    tokenUrl: "https://github.com/login/oauth/access_token",
    scope: "read:user user:email",
    clientId: process.env.AUTH_GITHUB_ID,
    clientSecret: process.env.AUTH_GITHUB_SECRET,
  };
}

export function isProviderConfigured(provider: Provider): boolean {
  const c = providerConfig(provider);
  return Boolean(c.clientId && c.clientSecret);
}

export function buildAuthorizeUrl(provider: Provider, state: string): string {
  const c = providerConfig(provider);
  const params = new URLSearchParams({
    client_id: c.clientId ?? "",
    redirect_uri: redirectUri(provider),
    response_type: "code",
    scope: c.scope,
    state,
  });
  if (provider === "google") params.set("access_type", "offline");
  return `${c.authorizeUrl}?${params.toString()}`;
}

export async function exchangeCode(provider: Provider, code: string): Promise<string> {
  const c = providerConfig(provider);
  const res = await fetch(c.tokenUrl, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded", accept: "application/json" },
    body: new URLSearchParams({
      client_id: c.clientId ?? "",
      client_secret: c.clientSecret ?? "",
      code,
      redirect_uri: redirectUri(provider),
      grant_type: "authorization_code",
    }),
  });
  if (!res.ok) throw new Error(`token exchange failed (${res.status})`);
  const data = (await res.json()) as { access_token?: string };
  if (!data.access_token) throw new Error("no access_token");
  return data.access_token;
}

export async function fetchProfile(provider: Provider, accessToken: string): Promise<OAuthProfile> {
  if (provider === "google") {
    const res = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
      headers: { authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) throw new Error(`userinfo failed (${res.status})`);
    const u = (await res.json()) as { sub: string; email: string; name?: string; picture?: string };
    return { providerAccountId: u.sub, email: u.email.toLowerCase(), name: u.name ?? null, image: u.picture ?? null };
  }
  // github
  const headers = { authorization: `Bearer ${accessToken}`, accept: "application/vnd.github+json", "user-agent": "lectern" };
  const userRes = await fetch("https://api.github.com/user", { headers });
  if (!userRes.ok) throw new Error(`github user failed (${userRes.status})`);
  const u = (await userRes.json()) as { id: number; name?: string; login: string; avatar_url?: string; email?: string };
  let email = u.email;
  if (!email) {
    const emailsRes = await fetch("https://api.github.com/user/emails", { headers });
    if (emailsRes.ok) {
      const emails = (await emailsRes.json()) as { email: string; primary: boolean; verified: boolean }[];
      email = emails.find((e) => e.primary && e.verified)?.email ?? emails.find((e) => e.verified)?.email;
    }
  }
  if (!email) throw new Error("no verified email on GitHub account");
  return { providerAccountId: String(u.id), email: email.toLowerCase(), name: u.name ?? u.login, image: u.avatar_url ?? null };
}
