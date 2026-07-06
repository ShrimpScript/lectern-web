// Test helper: ensure a user + mint an engine token (lk_…) for engine↔web tests.
// Usage: node scripts/test-seed.cjs   (prints USER_ID and TOKEN)
const { createClient } = require("@libsql/client");
const { randomUUID, randomBytes, createHash } = require("node:crypto");

(async () => {
  const db = createClient({ url: "file:.data/lectern-dev.db" });
  let res = await db.execute("SELECT id FROM users LIMIT 1");
  let userId;
  if (res.rows.length) {
    userId = res.rows[0].id;
  } else {
    userId = randomUUID();
    await db.execute({
      sql: "INSERT INTO users (id, email, name, created_at) VALUES (?,?,?,?)",
      args: [userId, "demo@lectern.local", "Demo", Date.now()],
    });
  }
  const plaintext = "lk_" + randomBytes(30).toString("base64url");
  const hash = createHash("sha256").update(plaintext).digest("hex");
  await db.execute({
    sql: "INSERT INTO api_tokens (id, user_id, name, prefix, hash, scopes) VALUES (?,?,?,?,?,?)",
    args: [randomUUID(), userId, "Test CLI", plaintext.slice(0, 7), hash, JSON.stringify(["engine", "sync", "usage"])],
  });
  // Give the user a Pro subscription so sync/skills entitlements are on for the test.
  await db.execute({
    sql: "INSERT INTO subscriptions (id, subject_id, subject_type, plan, seats, period, status) VALUES (?,?,?,?,?,?,?)",
    args: [randomUUID(), userId, "user", "pro", 1, "monthly", "active"],
  });
  console.log("USER_ID=" + userId);
  console.log("TOKEN=" + plaintext);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
