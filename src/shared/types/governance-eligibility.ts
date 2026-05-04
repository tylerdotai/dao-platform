export interface GovernanceEligibilityRecord {
  memberId: string;
  userId: string;
  displayName: string;
  membershipStatus: string;
  onboardingStatus: string;
  walletAddress: string | null;
  walletVerifiedAt: string | null;
  isEligible: boolean;
  reason: string;
}
