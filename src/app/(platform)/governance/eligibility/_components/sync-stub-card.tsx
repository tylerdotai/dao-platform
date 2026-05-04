"use client";

import { useState } from "react";
import { Loader2, RefreshCcw } from "lucide-react";
import { previewGovernanceSyncPlan } from "@/app/_actions/governance-sync";

export function SyncStubCard() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function handlePreview() {
    setLoading(true);
    setResult(null);
    const response = await previewGovernanceSyncPlan();
    if (response?.success) {
      setResult(
        `Dry-run plan ready: ${response.data.addVoters.length} wallets ready to add, ${response.data.blocked.length} members blocked.`,
      );
    } else {
      setResult(response?.error?.message || "Failed to build sync plan.");
    }
    setLoading(false);
  }

  return (
    <div className="rounded-2xl border border-white/8 bg-white/5 p-6 space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-white">Onchain sync stub</h2>
        <p className="mt-2 text-sm leading-6 text-dao-cool">
          This is a roadmap-aligned dry-run stub. It does not write to the governance contract yet. It only builds the voter allowlist sync plan from eligible DAO members.
        </p>
      </div>
      <button
        type="button"
        onClick={handlePreview}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-lg bg-dao-gold px-4 py-2 text-sm font-semibold text-dao-charcoal transition hover:opacity-90 disabled:opacity-60"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
        Build dry-run sync plan
      </button>
      {result ? <p className="text-sm text-dao-cool">{result}</p> : null}
    </div>
  );
}
