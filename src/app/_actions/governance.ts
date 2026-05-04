"use server";

import { getGovernanceProposalQuery, listGovernanceProposalsQuery } from "@/core/database/queries/governance";

export async function listGovernanceProposals() {
  return listGovernanceProposalsQuery();
}

export async function getGovernanceProposal(id: string) {
  return getGovernanceProposalQuery(id);
}
