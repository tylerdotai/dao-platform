import { and, eq, desc } from "drizzle-orm";
import { db, members, users } from "@/core/database";
import type { GovernanceEligibilityRecord } from "@/shared/types/governance-eligibility";

export async function listGovernanceEligibility(): Promise<GovernanceEligibilityRecord[]> {
  const rows = await db
    .select({
      memberId: members.id,
      userId: users.id,
      username: users.username,
      walletAddress: users.walletAddress,
      walletVerifiedAt: users.walletVerifiedAt,
      membershipStatus: members.status,
      onboardingStatus: members.onboardingStatus,
      firstName: members.firstName,
      lastName: members.lastName,
    })
    .from(members)
    .innerJoin(users, eq(members.userId, users.id))
    .orderBy(desc(members.createdAt));

  return rows.map((row) => {
    const displayName =
      row.username ||
      [row.firstName, row.lastName].filter(Boolean).join(" ") ||
      row.userId;
    const hasWallet = Boolean(row.walletAddress);
    const verifiedWallet = Boolean(row.walletVerifiedAt);
    const activeMember = row.membershipStatus === "active";
    const onboarded = row.onboardingStatus !== "not_started";
    const isEligible = activeMember && onboarded && hasWallet;

    let reason = "Eligible for governance sync";
    if (!activeMember) reason = "Inactive membership";
    else if (!onboarded) reason = "Onboarding incomplete";
    else if (!hasWallet) reason = "No linked wallet";
    else if (!verifiedWallet) reason = "Wallet linked but not verified";

    return {
      memberId: row.memberId,
      userId: row.userId,
      displayName,
      membershipStatus: row.membershipStatus,
      onboardingStatus: row.onboardingStatus,
      walletAddress: row.walletAddress,
      walletVerifiedAt: row.walletVerifiedAt?.toISOString?.() ?? null,
      isEligible,
      reason,
    };
  });
}

export async function previewGovernanceEligibilitySync() {
  const records = await listGovernanceEligibility();
  const eligible = records.filter((record) => record.isEligible);
  const ineligible = records.filter((record) => !record.isEligible);

  return {
    totals: {
      totalMembers: records.length,
      eligibleMembers: eligible.length,
      ineligibleMembers: ineligible.length,
    },
    eligible,
    ineligible,
  };
}
