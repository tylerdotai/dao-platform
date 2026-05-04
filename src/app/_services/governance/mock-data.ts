import type { GovernanceProposalSummary } from "@/shared/types/governance";

export const governanceProposalSeed: GovernanceProposalSummary[] = [
  {
    id: "prop-001",
    title: "Ratify governance module integration roadmap",
    summary:
      "Formally adopt the staged plan to merge Roberts Rules governance into dao.fwtx.city using Privy-backed identity and wallet flows.",
    state: "recognized",
    proposalType: "governance_change",
    proposerName: "Tyler Delano",
    createdAt: new Date().toISOString(),
    votingEndsAt: null,
    yesVotes: 0,
    noVotes: 0,
    abstainVotes: 0,
    quorumPercent: 33,
  },
  {
    id: "prop-002",
    title: "Create active member sync into governance eligibility",
    summary:
      "Define the first production bridge between active DAO members and the onchain governance allowlist.",
    state: "seconded",
    proposalType: "operational",
    proposerName: "Dexter",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    votingEndsAt: null,
    yesVotes: 0,
    noVotes: 0,
    abstainVotes: 0,
    quorumPercent: 33,
  },
  {
    id: "prop-003",
    title: "Adopt quorum enforcement in RobRulesVotingV2",
    summary:
      "Add constitutional quorum and threshold enforcement before production governance is enabled.",
    state: "voting",
    proposalType: "constitutional",
    proposerName: "Governance Working Group",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    votingEndsAt: new Date(Date.now() + 1000 * 60 * 60 * 23).toISOString(),
    yesVotes: 9,
    noVotes: 2,
    abstainVotes: 1,
    quorumPercent: 33,
  },
];
