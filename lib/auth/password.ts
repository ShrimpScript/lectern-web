import { randomBytes, scrypt as _scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

/* Password hashing with node:crypto scrypt — no external dependency.
   Stored format: scrypt$<saltBase64>$<hashBase64>  (see users.passwordHash). */
const scrypt = promisify(_scrypt);
const KEYLEN = 64;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const derived = (await scrypt(password.normalize("NFKC"), salt, KEYLEN)) as Buffer;
  return `scrypt$${salt.toString("base64")}$${derived.toString("base64")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split("$");
  if (parts.length !== 3 || parts[0] !== "scrypt") return false;
  const salt = Buffer.from(parts[1], "base64");
  const expected = Buffer.from(parts[2], "base64");
  const derived = (await scrypt(password.normalize("NFKC"), salt, expected.length || KEYLEN)) as Buffer;
  return expected.length === derived.length && timingSafeEqual(expected, derived);
}
