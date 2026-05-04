import type { Metadata } from "next";
import { GovernancePlaceholder } from "../_components/governance-placeholder";

export const metadata: Metadata = {
  title: "New Proposal - Fort Worth TX DAO",
};

export default function NewGovernanceProposalPage() {
  return <GovernancePlaceholder proposalId="new" />;
}
