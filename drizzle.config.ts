import type { Config } from "drizzle-kit";

/* libSQL/SQLite. Local dev pushes to a file; production targets Turso.
   `npm run db:push` to create/sync tables. */
export default {
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "turso",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "file:.data/lectern-dev.db",
    authToken: process.env.DATABASE_AUTH_TOKEN,
  },
} satisfies Config;
