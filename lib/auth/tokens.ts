import { randomBytes, createHash } from "node:crypto";

/* Personal/CI/engine API tokens. Format: lk_<40 base64url chars>.
   Only the SHA-256 hash + a short prefix are stored (tokens.hash / tokens.prefix);
   the plaintext is shown to the user exactly once. */

export function generateApiToken(): { plaintext: string; prefix: string; hash: string } {
  const secret = randomBytes(30).toString("base64url");
  const plaintext = `lk_${secret}`;
  return {
    plaintext,
    prefix: plaintext.slice(0, 7), // e.g. lk_a1b2
    hash: createHash("sha256").update(plaintext).digest("hex"),
  };
}

export function hashApiToken(plaintext: string): string {
  return createHash("sha256").update(plaintext).digest("hex");
}

/** Short, human-typeable user code for the device flow, e.g. WDJB-MJHT. */
export function generateUserCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no ambiguous chars
  const pick = () =>
    Array.from(randomBytes(4))
      .map((b) => alphabet[b % alphabet.length])
      .join("");
  return `${pick()}-${pick()}`;
}

export function generateDeviceCode(): string {
  return randomBytes(32).toString("base64url");
}
