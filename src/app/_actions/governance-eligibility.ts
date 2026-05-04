"use server";

import { previewGovernanceEligibilitySync } from "@/app/_services/governance/eligibility";
import { requireAdmin } from "@/app/_lib/auth";

export async function getGovernanceEligibilityPreview() {
  await requireAdmin();
  return previewGovernanceEligibilitySync();
}
