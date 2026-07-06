import { SignJWT, importPKCS8, importSPKI, jwtVerify, exportSPKI } from "jose";

/* EdDSA signing for entitlement tokens (closes the long-standing TODO).
   Key comes from LECTERN_SIGNING_KEY (PKCS8 PEM, Ed25519). Without it the
   route stays honest: tokens return with signed:false exactly as before —
   no key material is ever generated or stored server-side implicitly.
   Generate a keypair with: npm run gen-signing-key */
const ALG = "EdDSA";

export function signingConfigured(): boolean {
  return Boolean(process.env.LECTERN_SIGNING_KEY);
}

export async function signToken(payload: Record<string, unknown>): Promise<string> {
  const pem = process.env.LECTERN_SIGNING_KEY;
  if (!pem) throw new Error("LECTERN_SIGNING_KEY not set");
  const key = await importPKCS8(pem.replace(/\\n/g, "\n"), ALG);
  return new SignJWT(payload)
    .setProtectedHeader({ alg: ALG, typ: "JWT" })
    .setIssuer("lectern-cloud")
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(key);
}

/** Public-key verify — used by tests and (later) the engine. */
export async function verifyToken(jwt: string, publicPem: string) {
  const key = await importSPKI(publicPem.replace(/\\n/g, "\n"), ALG);
  return jwtVerify(jwt, key, { issuer: "lectern-cloud" });
}

export { exportSPKI };
