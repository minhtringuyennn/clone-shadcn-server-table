import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

const client = postgres(process.env.DATABASE_URL || "postgres://local:pwd@localhost:5432/table");
export const db = drizzle(client, { schema });
