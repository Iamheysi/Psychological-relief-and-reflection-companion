import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

declare global {
  // eslint-disable-next-line no-var
  var __pg__: ReturnType<typeof postgres> | undefined;
}

function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL not set");
  if (!globalThis.__pg__) {
    globalThis.__pg__ = postgres(url, { max: 10, prepare: false });
  }
  return globalThis.__pg__;
}

export function getDb() {
  return drizzle(getSql(), { schema });
}

export { schema };
