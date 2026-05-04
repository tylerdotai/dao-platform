"use client";

import { useState } from "react";
import { AlertTriangle, Loader2, RefreshCcw, Zap } from "lucide-react";
import {
  previewGovernanceSyncPlan,
  runGovernanceSync,
} from "@/app/_actions/governance-sync";

export function SyncStubCard() {
  const [loading, setLoading] = useState(false);
  const [running, setRunning] = useState(false);
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

  async function handleExecute() {
    const confirmed = window.confirm(
      "Execute onchain governance sync? This will attempt to write eligible wallets into the contract allowlist if write env vars are enabled.",
    );
    if (!confirmed) return;

    setRunning(true);
    setResult(null);
    const response = await runGovernanceSync();
    if (response?.success) {
      if (response.data.executed) {
        setResult(
          `Onchain sync executed: ${response.data.syncedWalletCount} wallets submitted, ${response.data.skippedWalletCount} skipped. Tx: ${response.data.transactionHash}`,
        );
      } else {
        setResult(response.data.reason || "No sync executed.");
      }
    } else {
      setResult(response?.error?.message || "Governance sync failed.");
    }
    setRunning(false);
  }

  return (
    <div className="rounded-2xl border border-white/8 bg-white/5 p-6 space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-white">Onchain sync bridge</h2>
        <p className="mt-2 text-sm leading-6 text-dao-cool">
          Preview the allowlist sync plan, then execute a real contract sync only if the feature-branch environment has explicit write-enable variables configured.
        </p>
      </div>
      <div className="rounded-xl border border-amber-400/20 bg-amber-500/10 p-4 text-sm text-amber-200">
        <div className="flex items-start gap-2">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            Safety guardrails: invalid addresses are filtered, existing eligible wallets are skipped, chain id can be enforced, and writes are blocked unless <code>GOVERNANCE_ENABLE_SYNC_WRITES=true</code> is set.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handlePreview}
          disabled={loading || running}
          className="inline-flex items-center gap-2 rounded-lg bg-dao-gold px-4 py-2 text-sm font-semibold text-dao-charcoal transition hover:opacity-90 disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
          Build dry-run sync plan
        </button>
        <button
          type="button"
          onClick={handleExecute}
          disabled={loading || running}
          className="inline-flex items-center gap-2 rounded-lg border border-dao-gold/30 px-4 py-2 text-sm font-semibold text-dao-gold transition hover:bg-dao-gold/10 disabled:opacity-60"
        >
          {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
          Execute onchain sync
        </button>
      </div>
      {result ? <p className="text-sm text-dao-cool break-all">{result}</p> : null}
    </div>
  );
}
