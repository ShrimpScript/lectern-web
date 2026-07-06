// Generates an Ed25519 keypair for entitlement signing. Prints both PEMs —
// put the PRIVATE one in the deployment env as LECTERN_SIGNING_KEY and ship
// the PUBLIC one with the engine. Never writes files itself.
import { generateKeyPair, exportPKCS8, exportSPKI } from "jose";
const { privateKey, publicKey } = await generateKeyPair("EdDSA", { extractable: true });
console.log("── LECTERN_SIGNING_KEY (private, env var) ──");
console.log((await exportPKCS8(privateKey)).trim());
console.log("── public key (engine-side verification) ──");
console.log((await exportSPKI(publicKey)).trim());
