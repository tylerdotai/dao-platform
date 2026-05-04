import type { Metadata } from "next";
import { GovernancePlaceholder } from "../_components/governance-placeholder";

export const metadata: Metadata = {
  title: "Proposal - Fort Worth TX DAO",
};

export default async function GovernanceProposalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <GovernancePlaceholder proposalId={id} />;
}
