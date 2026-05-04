import type { Metadata } from "next";
import { Scale } from "lucide-react";

export const metadata: Metadata = {
  title: "New Proposal - Fort Worth TX DAO",
};

export default function NewGovernanceProposalPage() {
  return (
    <div className="max-w-4xl mx-auto py-4 space-y-8">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-dao-gold/20 bg-dao-gold/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-dao-gold">
          <Scale className="h-3.5 w-3.5" />
          New Proposal
        </div>
        <div>
          <h1 className="font-display text-3xl text-white">New Proposal</h1>
          <p className="max-w-3xl text-sm leading-6 text-dao-cool">
            Scaffold placeholder for DAO-platform proposal drafting. The real version will route recognized motions into the Roberts Rules onchain flow after chair review.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/8 bg-white/5 p-6 space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-white">Proposal title</label>
          <input disabled value="Scaffold only, form wiring next" className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-dao-cool" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-white">Motion summary</label>
          <textarea disabled rows={6} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-dao-cool" value="Next step is building a real draft flow backed by governance tables and role checks." />
        </div>
      </div>
    </div>
  );
}
