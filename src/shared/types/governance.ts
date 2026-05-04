export type GovernanceProposalState =
  | "draft"
  | "recognized"
  | "seconded"
  | "voting"
  | "passed"
  | "failed";

export interface GovernanceProposalSummary {
  id: string;
  title: string;
  summary: string;
  state: GovernanceProposalState;
  proposalType: string;
  proposerName: string;
  createdAt: string;
  votingEndsAt?: string | null;
  yesVotes: number;
  noVotes: number;
  abstainVotes: number;
  quorumPercent: number;
}
