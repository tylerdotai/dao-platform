import Link from "next/link";
import { ArrowRight, Clock3, Vote, ShieldCheck } from "lucide-react";
import type { GovernanceProposalSummary } from "@/shared/types/governance";

const stateClasses: Record<string, string> = {
  draft: "bg-slate-500/10 text-slate-300 border-slate-400/20",
  recognized: "bg-sky-500/10 text-sky-300 border-sky-400/20",
  seconded: "bg-amber-500/10 text-amber-300 border-amber-400/20",
  voting: "bg-emerald-500/10 text-emerald-300 border-emerald-400/20",
  passed: "bg-teal-500/10 text-teal-300 border-teal-400/20",
  failed: "bg-rose-500/10 text-rose-300 border-rose-400/20",
};

export function GovernanceList({ proposals }: { proposals: GovernanceProposalSummary[] }) {
  return (
    <div className="space-y-4">
      {proposals.map((proposal) => (
        <Link
          key={proposal.id}
          href={`/governance/${proposal.id}`}
          className="block rounded-2xl border border-white/8 bg-white/5 p-5 transition hover:border-dao-gold/30 hover:bg-white/[0.07]"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${stateClasses[proposal.state]}`}>
                  {proposal.state}
                </span>
                <span className="text-xs font-medium uppercase tracking-[0.16em] text-dao-cool">
                  {proposal.proposalType.replaceAll("_", " ")}
                </span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">{proposal.title}</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-dao-cool">{proposal.summary}</p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 text-dao-gold" />
          </div>

          <div className="mt-4 grid gap-3 border-t border-white/8 pt-4 text-sm text-dao-cool md:grid-cols-4">
            <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-dao-gold" />By {proposal.proposerName}</div>
            <div className="flex items-center gap-2"><Vote className="h-4 w-4 text-dao-gold" />{proposal.yesVotes} yes / {proposal.noVotes} no / {proposal.abstainVotes} abstain</div>
            <div className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-dao-gold" />Quorum {proposal.quorumPercent}%</div>
            <div className="text-right text-xs uppercase tracking-[0.14em] text-dao-cool/80">{proposal.id}</div>
          </div>
        </Link>
      ))}
    </div>
  );
}
