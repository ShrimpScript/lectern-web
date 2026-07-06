import { NextResponse } from "next/server";

/* Tiny shared request-body validator — uniform, dependency-free (audit finding:
   POST bodies were hand-parsed with ad-hoc checks). Rejects malformed JSON and
   oversized payloads the same way on every route, and returns typed string
   fields with trimming and per-field rules.

   Usage:
     const v = await parseBody(req, {
       email: { required: true, email: true, max: 320 },
       message: { required: true, min: 5, max: 5000 },
     });
     if (!v.ok) return v.res;
     const { email, message } = v.data;
*/

export type FieldRule = {
  required?: boolean;
  /** Minimum length AFTER trimming (only enforced when present or required). */
  min?: number;
  /** Maximum length — oversized fields are a hard 400, never silently truncated. */
  max?: number;
  /** Cheap structural email check (contains @ with something on both sides). */
  email?: boolean;
  /** Allowed values (enum) — only enforced on non-empty values, so optional
      fields can stay "" and let the route apply its default. */
  oneOf?: readonly string[];
};

const MAX_BODY_BYTES = 64 * 1024;

type Parsed<T> = { ok: true; data: Record<keyof T, string> } | { ok: false; res: NextResponse };

export async function parseBody<T extends Record<string, FieldRule>>(
  req: Request,
  shape: T,
): Promise<Parsed<T>> {
  const bad = (error: string, status = 400): Parsed<T> => ({
    ok: false,
    res: NextResponse.json({ error }, { status }),
  });
  let raw: string;
  try {
    raw = await req.text();
  } catch {
    return bad("invalid_request");
  }
  if (raw.length > MAX_BODY_BYTES) return bad("payload_too_large", 413);
  let json: unknown;
  try {
    json = JSON.parse(raw || "{}");
  } catch {
    return bad("invalid_request");
  }
  if (typeof json !== "object" || json === null || Array.isArray(json)) return bad("invalid_request");
  const body = json as Record<string, unknown>;

  const data = {} as Record<keyof T, string>;
  for (const key of Object.keys(shape) as (keyof T)[]) {
    const rule = shape[key];
    const v = body[key as string];
    if (v === undefined || v === null) {
      if (rule.required) return bad(`${String(key)}_required`);
      data[key] = "";
      continue;
    }
    if (typeof v !== "string") return bad(`${String(key)}_invalid`);
    const s = v.trim();
    if (rule.required && s.length === 0) return bad(`${String(key)}_required`);
    if (rule.max !== undefined && s.length > rule.max) return bad(`${String(key)}_too_long`);
    if (rule.min !== undefined && s.length > 0 && s.length < rule.min) return bad(`${String(key)}_too_short`);
    if (rule.email && s.length > 0) {
      const at = s.indexOf("@");
      if (at < 1 || at === s.length - 1) return bad(`${String(key)}_invalid`);
    }
    if (rule.oneOf && s.length > 0 && !rule.oneOf.includes(s)) return bad(`${String(key)}_invalid`);
    data[key] = s;
  }
  return { ok: true, data };
}
