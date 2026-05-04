import { previewGovernanceEligibilitySync } from "./eligibility";

export async function buildGovernanceSyncPlan() {
  const preview = await previewGovernanceEligibilitySync();

  return {
    mode: "dry-run" as const,
    generatedAt: new Date().toISOString(),
    contractAddress: process.env.NEXT_PUBLIC_GOVERNANCE_CONTRACT_ADDRESS || null,
    addVoters: preview.eligible
      .filter((record) => record.walletAddress)
      .map((record) => ({
        memberId: record.memberId,
        userId: record.userId,
        displayName: record.displayName,
        walletAddress: record.walletAddress,
      })),
    blocked: preview.ineligible.map((record) => ({
      memberId: record.memberId,
      userId: record.userId,
      displayName: record.displayName,
      reason: record.reason,
    })),
  };
}
