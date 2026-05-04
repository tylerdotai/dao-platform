import { pgTable, text, timestamp, integer, jsonb, boolean, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./schema";

export const governanceProposals = pgTable(
  "governance_proposals",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    summary: text("summary").notNull(),
    body: text("body"),
    proposalType: text("proposal_type").notNull().default("general"),
    state: text("state").notNull().default("draft"),
    proposerId: text("proposer_id").references(() => users.id),
    chairId: text("chair_id").references(() => users.id),
    onchainProposalId: text("onchain_proposal_id"),
    contractAddress: text("contract_address"),
    transactionHash: text("transaction_hash"),
    discussionUrl: text("discussion_url"),
    metadata: jsonb("metadata"),
    quorumPercent: integer("quorum_percent").notNull().default(33),
    approvalThresholdPercent: integer("approval_threshold_percent")
      .notNull()
      .default(51),
    votingStartsAt: timestamp("voting_starts_at", { withTimezone: true }),
    votingEndsAt: timestamp("voting_ends_at", { withTimezone: true }),
    finalizedAt: timestamp("finalized_at", { withTimezone: true }),
    isArchived: boolean("is_archived").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_governance_proposals_state").on(table.state),
    index("idx_governance_proposals_type").on(table.proposalType),
    index("idx_governance_proposals_proposer").on(table.proposerId),
    index("idx_governance_proposals_created").on(table.createdAt),
  ],
);

export const governanceActions = pgTable(
  "governance_actions",
  {
    id: text("id").primaryKey(),
    proposalId: text("proposal_id").notNull().references(() => governanceProposals.id),
    actorId: text("actor_id").references(() => users.id),
    actionType: text("action_type").notNull(),
    notes: text("notes"),
    metadata: jsonb("metadata"),
    transactionHash: text("transaction_hash"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_governance_actions_proposal").on(table.proposalId),
    index("idx_governance_actions_actor").on(table.actorId),
    index("idx_governance_actions_type").on(table.actionType),
  ],
);

export const governanceAmendments = pgTable(
  "governance_amendments",
  {
    id: text("id").primaryKey(),
    proposalId: text("proposal_id").notNull().references(() => governanceProposals.id),
    proposerId: text("proposer_id").references(() => users.id),
    title: text("title").notNull(),
    summary: text("summary").notNull(),
    body: text("body"),
    state: text("state").notNull().default("proposed"),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_governance_amendments_proposal").on(table.proposalId),
    index("idx_governance_amendments_proposer").on(table.proposerId),
  ],
);

export const governanceProposalRelations = relations(governanceProposals, ({ one, many }) => ({
  proposer: one(users, { fields: [governanceProposals.proposerId], references: [users.id] }),
  chair: one(users, { fields: [governanceProposals.chairId], references: [users.id] }),
  actions: many(governanceActions),
  amendments: many(governanceAmendments),
}));

export const governanceActionRelations = relations(governanceActions, ({ one }) => ({
  proposal: one(governanceProposals, { fields: [governanceActions.proposalId], references: [governanceProposals.id] }),
  actor: one(users, { fields: [governanceActions.actorId], references: [users.id] }),
}));

export const governanceAmendmentRelations = relations(governanceAmendments, ({ one }) => ({
  proposal: one(governanceProposals, { fields: [governanceAmendments.proposalId], references: [governanceProposals.id] }),
  proposer: one(users, { fields: [governanceAmendments.proposerId], references: [users.id] }),
}));
