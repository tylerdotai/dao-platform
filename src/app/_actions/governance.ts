"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/app/_lib/auth";
import { actionError, actionSuccess } from "@/app/_lib/action-utils";
import {
  createGovernanceProposalQuery,
  getGovernanceProposalQuery,
  listGovernanceProposalsQuery,
} from "@/core/database/queries/governance";

export async function listGovernanceProposals() {
  return listGovernanceProposalsQuery();
}

export async function getGovernanceProposal(id: string) {
  return getGovernanceProposalQuery(id);
}

export async function createGovernanceProposal(formData: FormData) {
  try {
    const { user } = await requireAuth();
    const title = String(formData.get("title") || "").trim();
    const summary = String(formData.get("summary") || "").trim();
    const body = String(formData.get("body") || "").trim();
    const proposalType = String(formData.get("proposalType") || "general").trim();

    if (!title || !summary) {
      return actionError(new Error("Title and summary are required"));
    }

    const proposalId = await createGovernanceProposalQuery({
      title,
      summary,
      body,
      proposalType,
      proposerId: user.id,
    });

    revalidatePath("/governance");
    revalidatePath(`/governance/${proposalId}`);
    return actionSuccess({ proposalId });
  } catch (error) {
    return actionError(error);
  }
}
