import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { getGovernanceEligibilityPreview } from "@/app/_actions/governance-eligibility";
import { EligibilityPreview } from "./_components/eligibility-preview";
import { SyncStubCard } from "./_components/sync-stub-card";

export const metadata: Metadata = {
  title: "Governance Eligibility - Fort Worth TX DAO",
};

export default async function GovernanceEligibilityPage() {
  const preview = await getGovernanceEligibilityPreview();

  return (
    <div className="max-w-6xl mx-auto py-4 space-y-8">
      <Link href="/governance" className="inline-flex items-center gap-2 text-sm font-medium text-dao-gold hover:opacity-80">
        <ArrowLeft className="h-4 w-4" />
        Back to governance
      </Link>

      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-dao-gold/20 bg-dao-gold/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-dao-gold">
          <ShieldCheck className="h-3.5 w-3.5" />
          Eligibility Sync Preview
        </div>
        <div>
          <h1 className="font-display text-3xl text-white">Governance eligibility</h1>
          <p className="max-w-3xl text-sm leading-6 text-dao-cool">
            Admin preview of which DAO members are ready to sync into onchain governance eligibility based on membership status, onboarding state, and wallet presence.
          </p>
        </div>
      </div>

      <EligibilityPreview {...preview} />
      <SyncStubCard />
    </div>
  );
}
