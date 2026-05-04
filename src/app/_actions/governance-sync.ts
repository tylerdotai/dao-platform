"use server";

import { requireAdmin } from "@/app/_lib/auth";
import { actionError, actionSuccess } from "@/app/_lib/action-utils";
import { buildGovernanceSyncPlan } from "@/app/_services/governance/sync";

export async function previewGovernanceSyncPlan() {
  try {
    await requireAdmin();
    const plan = await buildGovernanceSyncPlan();
    return actionSuccess(plan);
  } catch (error) {
    return actionError(error);
  }
}
