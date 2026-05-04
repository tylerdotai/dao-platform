"use client";

import Link from "next/link";
import { Scale, PlusCircle, Shield, Vote, GitBranch } from "lucide-react";

const phases = [
  {
    title: "Governance UI",
    description:
      "Proposal list, proposal detail, chair actions, and member vote flows inside dao.fwtx.city.",
    icon: Scale,
  },
  {
    title: "Eligibility Sync",
    description:
      "Bridge DAO membership records and verified wallets into onchain governance eligibility.",
    icon: Shield,
  },
  {
    title: "Privy Vote Client",
    description:
      "Replace MetaMask-only assumptions with Privy-backed wallet session voting.",
    icon: Vote,
  },
  {
    title: "Contract V2",
    description:
      "Add quorum, threshold enforcement, and production-safe proposal finalization.",
    icon: GitBranch,
  },
];

export function GovernancePlaceholder({
  proposalId,
}: {
  proposalId?: string;
}) {
  return (
    <div className="max-w-6xl mx-auto py-4 space-y-8">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-dao-gold/20 bg-dao-gold/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-dao-gold">
          <Scale className="h-3.5 w-3.5" />
          Governance Scaffold
        </div>
        <h1 className="font-display text-3xl text-white">
          {proposalId ? `Proposal ${proposalId}` : "Governance"}
        </h1>
        <p className="max-w-3xl text-sm leading-6 text-dao-cool">
          This route group is the starting scaffold for merging the Roberts Rules
          governance engine from the zk-voting-system into dao.fwtx.city with
          Privy-backed wallet identity and DAO-platform membership rules.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {phases.map((phase) => {
          const Icon = phase.icon;
          return (
            <div
              key={phase.title}
              className="rounded-2xl border border-white/8 bg-white/5 p-5 shadow-sm"
            >
              <div className="mb-4 inline-flex rounded-xl bg-dao-gold/10 p-2 text-dao-gold">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="mb-2 text-base font-semibold text-white">
                {phase.title}
              </h2>
              <p className="text-sm leading-6 text-dao-cool">
                {phase.description}
              </p>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-white/8 bg-dao-surface/60 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white">Next build targets</h2>
        <ul className="space-y-2 text-sm text-dao-cool list-disc pl-5">
          <li>Proposal list page backed by governance tables and chain sync.</li>
          <li>Proposal detail view with motion state, amendments, and event history.</li>
          <li>Chair controls for recognize, open voting, and finalize proposal.</li>
          <li>Member vote flow using Privy-linked or embedded wallets.</li>
          <li>Eligibility sync between active members and governance allowlist.</li>
        </ul>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/governance/new"
            className="inline-flex items-center gap-2 rounded-lg bg-dao-gold px-4 py-2 text-sm font-semibold text-dao-charcoal transition hover:opacity-90"
          >
            <PlusCircle className="h-4 w-4" />
            New Proposal Scaffold
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/5"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
