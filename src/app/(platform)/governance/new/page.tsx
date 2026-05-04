import type { Metadata } from "next";
import { Scale } from "lucide-react";
import { createGovernanceProposal } from "@/app/_actions/governance";

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
            Draft a governance proposal inside dao.fwtx.city. This is the first step before chair recognition and onchain launch.
          </p>
        </div>
      </div>

      <form action={createGovernanceProposal} className="rounded-2xl border border-white/8 bg-white/5 p-6 space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-white">Proposal title</label>
          <input name="title" required className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" placeholder="Ratify governance integration roadmap" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-white">Proposal type</label>
          <select name="proposalType" className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white">
            <option value="general">General</option>
            <option value="governance_change">Governance change</option>
            <option value="operational">Operational</option>
            <option value="treasury">Treasury</option>
            <option value="constitutional">Constitutional</option>
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-white">Summary</label>
          <textarea name="summary" required rows={4} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" placeholder="Short motion summary for proposal list and review." />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-white">Body</label>
          <textarea name="body" rows={8} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" placeholder="Full proposal text, rationale, and implementation notes." />
        </div>
        <button type="submit" className="inline-flex items-center rounded-lg bg-dao-gold px-4 py-2 text-sm font-semibold text-dao-charcoal transition hover:opacity-90">
          Save draft
        </button>
      </form>
    </div>
  );
}
