import { desc, eq } from "drizzle-orm";
import { db, governanceProposals, users } from "..";
import { governanceProposalSeed } from "@/app/_services/governance/mock-data";

export async function listGovernanceProposalsQuery() {
  try {
    const rows = await db
      .select({
        id: governanceProposals.id,
        title: governanceProposals.title,
        summary: governanceProposals.summary,
        state: governanceProposals.state,
        proposalType: governanceProposals.proposalType,
        createdAt: governanceProposals.createdAt,
        votingEndsAt: governanceProposals.votingEndsAt,
        quorumPercent: governanceProposals.quorumPercent,
        proposerName: users.username,
      })
      .from(governanceProposals)
      .leftJoin(users, eq(governanceProposals.proposerId, users.id))
      .orderBy(desc(governanceProposals.createdAt));

    return rows.map((row) => ({
      ...row,
      proposerName: row.proposerName || "Unknown proposer",
      createdAt: row.createdAt?.toISOString?.() ?? new Date().toISOString(),
      votingEndsAt: row.votingEndsAt?.toISOString?.() ?? null,
      yesVotes: 0,
      noVotes: 0,
      abstainVotes: 0,
    }));
  } catch {
    return governanceProposalSeed;
  }
}

export async function getGovernanceProposalQuery(id: string) {
  try {
    const rows = await db
      .select({
        id: governanceProposals.id,
        title: governanceProposals.title,
        summary: governanceProposals.summary,
        state: governanceProposals.state,
        proposalType: governanceProposals.proposalType,
        createdAt: governanceProposals.createdAt,
        votingEndsAt: governanceProposals.votingEndsAt,
        quorumPercent: governanceProposals.quorumPercent,
        proposerName: users.username,
      })
      .from(governanceProposals)
      .leftJoin(users, eq(governanceProposals.proposerId, users.id))
      .where(eq(governanceProposals.id, id))
      .limit(1);

    const row = rows[0];
    if (!row) return null;
    return {
      ...row,
      proposerName: row.proposerName || "Unknown proposer",
      createdAt: row.createdAt?.toISOString?.() ?? new Date().toISOString(),
      votingEndsAt: row.votingEndsAt?.toISOString?.() ?? null,
      yesVotes: 0,
      noVotes: 0,
      abstainVotes: 0,
    };
  } catch {
    return governanceProposalSeed.find((proposal) => proposal.id === id) ?? null;
  }
}
