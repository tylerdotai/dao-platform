"use server";

import { requireAdmin } from "@/app/_lib/auth";
import { actionError, actionSuccess } from "@/app/_lib/action-utils";
import { buildGovernanceSyncPlan } from "@/app/_services/governance/sync";
import { executeGovernanceAllowlistSync } from "@/app/_services/governance/contract-bridge";

export async function previewGovernanceSyncPlan() {
  try {
    await requireAdmin();
    const plan = await buildGovernanceSyncPlan();
    return actionSuccess(plan);
  } catch (error) {
    return actionError(error);
  }
}

export async function runGovernanceSync() {
  try {
    await requireAdmin();
    const result = await executeGovernanceAllowlistSync();
    return actionSuccess(result);
  } catch (error) {
    return actionError(error);
  }
}
