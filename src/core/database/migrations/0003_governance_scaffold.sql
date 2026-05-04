CREATE TABLE IF NOT EXISTS "governance_proposals" (
  "id" text PRIMARY KEY NOT NULL,
  "title" text NOT NULL,
  "summary" text NOT NULL,
  "body" text,
  "proposal_type" text DEFAULT 'general' NOT NULL,
  "state" text DEFAULT 'draft' NOT NULL,
  "proposer_id" text,
  "chair_id" text,
  "onchain_proposal_id" text,
  "contract_address" text,
  "transaction_hash" text,
  "discussion_url" text,
  "metadata" jsonb,
  "quorum_percent" integer DEFAULT 33 NOT NULL,
  "approval_threshold_percent" integer DEFAULT 51 NOT NULL,
  "voting_starts_at" timestamp with time zone,
  "voting_ends_at" timestamp with time zone,
  "finalized_at" timestamp with time zone,
  "is_archived" boolean DEFAULT false NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "governance_actions" (
  "id" text PRIMARY KEY NOT NULL,
  "proposal_id" text NOT NULL,
  "actor_id" text,
  "action_type" text NOT NULL,
  "notes" text,
  "metadata" jsonb,
  "transaction_hash" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "governance_amendments" (
  "id" text PRIMARY KEY NOT NULL,
  "proposal_id" text NOT NULL,
  "proposer_id" text,
  "title" text NOT NULL,
  "summary" text NOT NULL,
  "body" text,
  "state" text DEFAULT 'proposed' NOT NULL,
  "metadata" jsonb,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

DO $$ BEGIN
 ALTER TABLE "governance_proposals" ADD CONSTRAINT "governance_proposals_proposer_id_users_id_fk" FOREIGN KEY ("proposer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
 ALTER TABLE "governance_proposals" ADD CONSTRAINT "governance_proposals_chair_id_users_id_fk" FOREIGN KEY ("chair_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
 ALTER TABLE "governance_actions" ADD CONSTRAINT "governance_actions_proposal_id_governance_proposals_id_fk" FOREIGN KEY ("proposal_id") REFERENCES "public"."governance_proposals"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
 ALTER TABLE "governance_actions" ADD CONSTRAINT "governance_actions_actor_id_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
 ALTER TABLE "governance_amendments" ADD CONSTRAINT "governance_amendments_proposal_id_governance_proposals_id_fk" FOREIGN KEY ("proposal_id") REFERENCES "public"."governance_proposals"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
 ALTER TABLE "governance_amendments" ADD CONSTRAINT "governance_amendments_proposer_id_users_id_fk" FOREIGN KEY ("proposer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE INDEX IF NOT EXISTS "idx_governance_proposals_state" ON "governance_proposals" USING btree ("state");
CREATE INDEX IF NOT EXISTS "idx_governance_proposals_type" ON "governance_proposals" USING btree ("proposal_type");
CREATE INDEX IF NOT EXISTS "idx_governance_proposals_proposer" ON "governance_proposals" USING btree ("proposer_id");
CREATE INDEX IF NOT EXISTS "idx_governance_proposals_created" ON "governance_proposals" USING btree ("created_at");
CREATE INDEX IF NOT EXISTS "idx_governance_actions_proposal" ON "governance_actions" USING btree ("proposal_id");
CREATE INDEX IF NOT EXISTS "idx_governance_actions_actor" ON "governance_actions" USING btree ("actor_id");
CREATE INDEX IF NOT EXISTS "idx_governance_actions_type" ON "governance_actions" USING btree ("action_type");
CREATE INDEX IF NOT EXISTS "idx_governance_amendments_proposal" ON "governance_amendments" USING btree ("proposal_id");
CREATE INDEX IF NOT EXISTS "idx_governance_amendments_proposer" ON "governance_amendments" USING btree ("proposer_id");
