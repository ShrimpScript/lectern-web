// Test helper: approve any pending device codes for the first user (simulates the
// /activate UI click), so `lectern login` completes in an automated test.
const { createClient } = require("@libsql/client");
(async () => {
  const db = createClient({ url: "file:.data/lectern-dev.db" });
  const u = await db.execute("SELECT id FROM users LIMIT 1");
  if (!u.rows.length) throw new Error("no users — run test-seed.cjs first");
  const uid = u.rows[0].id;
  const r = await db.execute({
    sql: "UPDATE device_codes SET status='approved', user_id=? WHERE status='pending'",
    args: [uid],
  });
  console.log("approved", r.rowsAffected, "device code(s) for user", uid);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
