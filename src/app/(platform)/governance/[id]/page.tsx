import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Scale, Vote, Clock3 } from "lucide-react";
import { getGovernanceProposal } from "@/app/_actions/governance";

export const metadata: Metadata = {
  title: "Proposal - Fort Worth TX DAO",
};

export default async function GovernanceProposalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const proposal = await getGovernanceProposal(id);

  if (!proposal) notFound();

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-8">
      <Link href="/governance" className="inline-flex items-center gap-2 text-sm font-medium text-dao-gold hover:opacity-80">
        <ArrowLeft className="h-4 w-4" />
        Back to governance
      </Link>

      <div className="rounded-2xl border border-white/8 bg-white/5 p-6 space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-dao-gold/20 bg-dao-gold/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-dao-gold">
          <Scale className="h-3.5 w-3.5" />
          {proposal.id}
        </div>
        <div>
          <h1 className="font-display text-3xl text-white">{proposal.title}</h1>
          <p className="mt-3 text-sm leading-6 text-dao-cool">{proposal.summary}</p>
        </div>
        <div className="grid gap-3 md:grid-cols-3 text-sm text-dao-cool">
          <div className="rounded-xl border border-white/8 p-4">Type: <span className="text-white">{proposal.proposalType}</span></div>
          <div className="rounded-xl border border-white/8 p-4">State: <span className="text-white">{proposal.state}</span></div>
          <div className="rounded-xl border border-white/8 p-4">Proposer: <span className="text-white">{proposal.proposerName}</span></div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/8 bg-white/5 p-6 space-y-3">
          <h2 className="text-lg font-semibold text-white">Voting snapshot</h2>
          <div className="flex items-center gap-2 text-dao-cool"><Vote className="h-4 w-4 text-dao-gold" /> {proposal.yesVotes} yes / {proposal.noVotes} no / {proposal.abstainVotes} abstain</div>
          <div className="flex items-center gap-2 text-dao-cool"><Clock3 className="h-4 w-4 text-dao-gold" /> Quorum target: {proposal.quorumPercent}%</div>
        </div>
        <div className="rounded-2xl border border-white/8 bg-white/5 p-6 space-y-3">
          <h2 className="text-lg font-semibold text-white">Next implementation step</h2>
          <p className="text-sm leading-6 text-dao-cool">
            Replace this scaffold with chain-backed proposal history, amendment timeline, chair controls, and Privy-backed voting actions.
          </p>
        </div>
      </div>
    </div>
  );
}
