/* Lazy libSQL/Drizzle client.
   - Local dev: defaults to a file DB (`.data/lectern-dev.db`) so real auth/billing
     work with ZERO setup. Run `npm run db:push` once to create the tables.
   - Production: set DATABASE_URL (e.g. a Turso `libsql://…` URL) + DATABASE_AUTH_TOKEN.
   No connection is made at import/build time — only when getDb() is first called. */
import { drizzle, type LibSQLDatabase } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { mkdirSync } from "node:fs";
import * as schema from "./schema";

type Db = LibSQLDatabase<typeof schema>;
let _db: Db | null = null;

const DEV_DEFAULT = "file:.data/lectern-dev.db";

/** Resolve the DB URL: explicit env, or a local file in development, else null. */
export function dbUrl(): string | null {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  if (process.env.NODE_ENV !== "production") return DEV_DEFAULT;
  return null;
}

export function isDbConfigured(): boolean {
  return dbUrl() !== null;
}

export function getDb(): Db {
  if (_db) return _db;
  const url = dbUrl();
  if (!url) {
    throw new Error("DATABASE_URL is not set. Set it (e.g. a Turso libsql:// URL) to enable cloud features. See .env.example.");
  }
  if (url.startsWith("file:")) {
    try {
      mkdirSync(".data", { recursive: true });
    } catch {
      /* ignore */
    }
  }
  const client = createClient({ url, authToken: process.env.DATABASE_AUTH_TOKEN });
  _db = drizzle(client, { schema });
  return _db;
}

export { schema };
