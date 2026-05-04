import { ShieldCheck, ShieldAlert } from "lucide-react";
import type { GovernanceEligibilityRecord } from "@/shared/types/governance-eligibility";

function EligibilityTable({
  title,
  icon: Icon,
  records,
}: {
  title: string;
  icon: typeof ShieldCheck;
  records: GovernanceEligibilityRecord[];
}) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/5 p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-dao-gold" />
        <h2 className="text-lg font-semibold text-white">{title}</h2>
      </div>
      <div className="space-y-3">
        {records.length === 0 ? (
          <p className="text-sm text-dao-cool">No records.</p>
        ) : (
          records.map((record) => (
            <div key={record.memberId} className="rounded-xl border border-white/8 p-4 text-sm text-dao-cool">
              <div className="font-medium text-white">{record.displayName}</div>
              <div className="mt-1">{record.reason}</div>
              <div className="mt-2 text-xs uppercase tracking-[0.14em] text-dao-cool/80">
                {record.walletAddress || "No wallet linked"}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export function EligibilityPreview({
  eligible,
  ineligible,
  totals,
}: {
  eligible: GovernanceEligibilityRecord[];
  ineligible: GovernanceEligibilityRecord[];
  totals: { totalMembers: number; eligibleMembers: number; ineligibleMembers: number };
}) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/8 bg-white/5 p-5"><div className="text-sm text-dao-cool">Total members</div><div className="mt-2 text-3xl font-semibold text-white">{totals.totalMembers}</div></div>
        <div className="rounded-2xl border border-white/8 bg-white/5 p-5"><div className="text-sm text-dao-cool">Eligible now</div><div className="mt-2 text-3xl font-semibold text-white">{totals.eligibleMembers}</div></div>
        <div className="rounded-2xl border border-white/8 bg-white/5 p-5"><div className="text-sm text-dao-cool">Need cleanup</div><div className="mt-2 text-3xl font-semibold text-white">{totals.ineligibleMembers}</div></div>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <EligibilityTable title="Eligible for sync" icon={ShieldCheck} records={eligible} />
        <EligibilityTable title="Blocked from sync" icon={ShieldAlert} records={ineligible} />
      </div>
    </div>
  );
}
