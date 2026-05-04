import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as baseSchema from "./schema";
import * as governanceSchema from "./schema-governance";

const schema = { ...baseSchema, ...governanceSchema };

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Create the drizzle instance
export const db = drizzle(pool, { schema });

// Export schema for use in queries
export * from "./schema";
export * from "./schema-governance";

// Export types
export type Database = typeof db;
