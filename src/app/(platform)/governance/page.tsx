import type { Metadata } from "next";
import Link from "next/link";
import { PlusCircle, Scale } from "lucide-react";
import { listGovernanceProposals } from "@/app/_actions/governance";
import { GovernanceList } from "./_components/governance-list";

export const metadata: Metadata = {
  title: "Governance - Fort Worth TX DAO",
};

export default async function GovernancePage() {
  const proposals = await listGovernanceProposals();

  return (
    <div className="max-w-6xl mx-auto py-4 space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-dao-gold/20 bg-dao-gold/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-dao-gold">
            <Scale className="h-3.5 w-3.5" />
            Governance
          </div>
          <div>
            <h1 className="font-display text-3xl text-white">Governance</h1>
            <p className="max-w-3xl text-sm leading-6 text-dao-cool">
              Roberts Rules proposal management scaffold for the dao.fwtx.city governance module.
            </p>
          </div>
        </div>

        <Link
          href="/governance/new"
          className="inline-flex items-center gap-2 rounded-lg bg-dao-gold px-4 py-2 text-sm font-semibold text-dao-charcoal transition hover:opacity-90"
        >
          <PlusCircle className="h-4 w-4" />
          New Proposal
        </Link>
      </div>

      <div className="flex justify-end">
        <Link
          href="/governance/eligibility"
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/5"
        >
          Eligibility preview
        </Link>
      </div>

      <GovernanceList proposals={proposals} />
    </div>
  );
}
