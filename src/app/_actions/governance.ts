"use server";

import { governanceProposalSeed } from "@/app/_services/governance/mock-data";

export async function listGovernanceProposals() {
  return governanceProposalSeed;
}

export async function getGovernanceProposal(id: string) {
  return governanceProposalSeed.find((proposal) => proposal.id === id) ?? null;
}
