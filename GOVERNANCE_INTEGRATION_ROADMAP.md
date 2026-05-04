# Governance Integration Roadmap

## Goal

Merge the `zk-voting-system` Roberts Rules governance engine into `dao-platform` so `dao.fwtx.city` becomes the main governance surface, with:

- **Privy** for auth and wallets
- **dao-platform** for membership, roles, discussion, archives, and UX
- **RobRulesVoting** for canonical onchain proposal state and vote execution
- **ZK privacy** deferred to a later ballot-layer upgrade

---

## Product Principle

Do **not** rebuild governance from scratch.

Do **not** force users through MetaMask-only UX.

Do **not** put drafting and debate fully onchain.

Build the bridge:
- offchain for human workflow
- onchain for auditability and final execution

---

## Current State

### dao-platform already has
- Privy auth
- embedded Ethereum + Solana wallets
- wallet verification via signing
- membership records
- subscription tiers via Stripe
- RBAC roles
- passport identity surface
- forums
- bounties
- documents

### zk-voting-system already has
- Rob's Rules proposal lifecycle
- seconding
- amendments
- division
- reconsideration
- voting + finalization
- live Sepolia contract

### Missing bridge
- no Privy-backed vote flow
- no DAO member sync into governance eligibility
- no quorum enforcement for production
- no governance UI in dao-platform
- no production-safe contract v2

---

## Architecture Target

### Layer 1 — Identity
**Privy**
- email login
- embedded wallet creation
- optional external wallet linking
- wallet verification
- signing session

### Layer 2 — Membership + Governance UX
**dao-platform**
- proposal drafts
- discussion threads
- amendment drafting
- chair recognition workflow
- archives/history
- role checks
- member activity / passport updates

### Layer 3 — Governance Execution
**RobRulesVotingV2**
- recognized proposal ids
- seconding
- vote opening
- cast vote
- quorum + threshold
- pass/fail
- execution-ready events

---

## Phased Roadmap

## Phase 0 — Repo + Planning

### Deliverables
- [x] Fork `FWTX-DAO/dao-platform`
- [x] Create feature branch
- [x] Create roadmap
- [ ] Add governance architecture docs to repo
- [ ] Decide whether to vendor contract code directly or as separate package/submodule

### Recommendation
Keep the smart contract code in a dedicated `/contracts/governance/` area inside this repo for now. Simpler than multi-repo orchestration.

---

## Phase 1 — Governance Module Skeleton in dao-platform

### Goal
Create the app surface before changing contract behavior.

### Deliverables
- [ ] Add `/governance` route group
- [ ] Add proposal list page
- [ ] Add proposal detail page
- [ ] Add proposal creation form
- [ ] Add chair actions panel
- [ ] Add vote action panel
- [ ] Add governance activity feed entries
- [ ] Add governance nav item

### Data model additions
Add new tables:
- `governance_proposals`
- `governance_amendments`
- `governance_actions`
- `governance_votes` (offchain mirror / cache only)
- `governance_sync_events`

### Notes
At this phase, proposal creation can still be app-only drafts before onchain launch.

---

## Phase 2 — Membership-Backed Eligibility Sync

### Goal
Replace manual governance eligibility with platform-backed eligibility.

### Deliverables
- [ ] Define who is eligible to vote
- [ ] Map active DAO members to governance-eligible wallets
- [ ] Create admin sync action: member status -> contract allowlist
- [ ] Create job/script to reconcile platform membership with contract voter set
- [ ] Add governance eligibility status to member profile/passport

### Decision
**Start with allowlist sync** before building a standalone registry contract.

That means:
- use existing `addVoter/removeVoter`
- source of truth = active member + verified or linked governance wallet

### Rules to settle
- Does membership tier affect voting eligibility?
- Is wallet verification required before voting?
- Can external linked wallets override embedded wallets?

### Recommendation
Use this order:
1. verified external wallet if present
2. verified embedded wallet
3. linked external wallet
4. linked embedded wallet

---

## Phase 3 — Privy-Backed Voting Client

### Goal
Remove MetaMask-only dependency from governance UX.

### Deliverables
- [ ] Replace direct browser wallet assumption in governance UI
- [ ] Add Privy-backed vote submission flow
- [ ] Support embedded wallet signing for governance actions
- [ ] Support external linked wallet voting when preferred
- [ ] Add wallet selection UI when multiple wallets are linked

### Governance actions needing signatures
- create proposal
- second proposal
- approve/open vote (chair)
- cast vote
- request reconsideration
- call for division

### Notes
This is where governance becomes usable by non-crypto-native members.

---

## Phase 4 — Contract V2

### Goal
Upgrade from hackathon-safe contract to production-safe governance contract.

### Required changes
- [ ] quorum enforcement
- [ ] approval threshold enforcement
- [ ] remove chair-anytime-finalize in production mode
- [ ] proposal type metadata
- [ ] discussion URI / IPFS hash support
- [ ] execution-ready events
- [ ] compatibility with synced member eligibility

### Proposal types
- general resolution
- treasury allocation
- governance change
- membership action
- appointment/removal
- constitutional amendment

### Rules to encode
- quorum = 33% of active eligible members
- approval threshold = 51% of quorum
- abstain counts toward participation, not approval

### Nice-to-have
- [ ] execution queue state
- [ ] optional multisig payload hash
- [ ] proposal deadlines by type

---

## Phase 5 — Onchain / Offchain Sync Layer

### Goal
Make dao-platform the readable source while chain remains the canonical execution layer.

### Deliverables
- [ ] index contract events into platform DB
- [ ] sync proposal status on reads or background jobs
- [ ] show onchain tx links in proposal UI
- [ ] persist mirrored vote stats for fast UI
- [ ] add verification pages inside dao-platform

### Event ingestion targets
- proposal created
- proposal seconded
- amendment approved
- voting opened
- vote cast
- division called
- reconsideration requested
- proposal finalized

---

## Phase 6 — Treasury / Operational Execution Hooks

### Goal
Let passed proposals produce actionable next steps.

### Deliverables
- [ ] define execution classes
- [ ] add execution metadata to proposals
- [ ] emit execution-ready event from contract
- [ ] queue multisig / ops actions after passage
- [ ] display execution status in UI

### Important
Do **not** auto-send treasury funds in first version.
Queue for review first.

---

## Phase 7 — ZK Ballot Layer (Later)

### Goal
Reintroduce privacy only where it matters, the ballot.

### Scope
- [ ] private eligibility proof
- [ ] nullifier-based anti-double-vote
- [ ] anonymous vote casting
- [ ] verifier contract integration into governance flow

### Non-goal
Do not make the entire parliamentary lifecycle ZK-first.
Only the ballot layer should become private.

---

## Suggested File / Module Layout

```text
src/app/(platform)/governance/
  page.tsx
  [id]/page.tsx
  new/page.tsx
  _components/

src/app/_actions/governance.ts
src/app/_services/governance/
src/core/database/schema-governance.ts

contracts/governance/
  RobRulesVotingV2.sol
  interfaces/
  test/

scripts/
  sync-governance-voters.ts
  deploy-governance-v2.ts
```

---

## First Build Order

If we start immediately, build in this order:

1. governance route skeleton in dao-platform
2. proposal draft + chair workflow UI
3. member eligibility sync to current contract
4. Privy-backed vote action flow
5. contract v2 with quorum + safer finalization
6. event sync/indexing
7. treasury hooks
8. ZK ballot layer later

---

## Risks

### 1. Overbuilding the contract too early
If too much parliamentary nuance goes onchain first, iteration speed dies.

### 2. Identity confusion
Need one clear governance wallet selection rule.

### 3. Membership ambiguity
Need explicit definition of who can vote and when.

### 4. ZK distraction
Do not let private ballot work derail the core governance merge.

---

## Success Criteria

This integration is successful when:
- a member can log into `dao.fwtx.city` with Privy
- the platform knows whether they are eligible to vote
- the member can read and discuss proposals in-platform
- the chair can launch a proposal onchain from the same app
- members can cast votes without MetaMask-only friction
- results are visible both onchain and in-platform
- quorum and constitutional rules are actually enforced

---

## Recommendation

Ship the merge in two big waves:

### Wave 1
- governance UI
- eligibility sync
- Privy vote client
- current contract bridge

### Wave 2
- contract v2
- event indexing
- execution hooks
- ZK ballot R&D

That gets real governance live faster without waiting on the hardest cryptography work.
