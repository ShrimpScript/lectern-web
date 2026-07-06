import { eq } from "drizzle-orm";
import { getDb, isDbConfigured, schema } from "@/lib/db";

/* Real team/org membership for the signed-in user. A personal account (no org)
   returns an empty member list — the team page then shows the Team-plan pitch. */
export type TeamMember = { name: string; email: string; role: string };
export type Team = { orgName: string | null; plan: string; members: TeamMember[] };

export async function getTeamForUser(userId: string | null): Promise<Team> {
  const empty: Team = { orgName: null, plan: "free", members: [] };
  if (!userId || !isDbConfigured()) return empty;
  const db = getDb();

  const mine = await db
    .select({ orgId: schema.memberships.orgId })
    .from(schema.memberships)
    .where(eq(schema.memberships.userId, userId))
    .limit(1);
  if (!mine[0]) return empty;

  const orgId = mine[0].orgId;
  const [org] = await db
    .select({ name: schema.orgs.name, plan: schema.orgs.plan })
    .from(schema.orgs)
    .where(eq(schema.orgs.id, orgId))
    .limit(1);
  const rows = await db
    .select({ role: schema.memberships.role, name: schema.users.name, email: schema.users.email })
    .from(schema.memberships)
    .innerJoin(schema.users, eq(schema.memberships.userId, schema.users.id))
    .where(eq(schema.memberships.orgId, orgId));

  return {
    orgName: org?.name ?? null,
    plan: org?.plan ?? "free",
    members: rows.map((r) => ({ name: r.name ?? r.email.split("@")[0], email: r.email, role: r.role })),
  };
}
