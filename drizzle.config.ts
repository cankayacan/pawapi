import * as dotenv from 'dotenv';
import type { Config } from 'drizzle-kit';

dotenv.config();

export default {
  schema: './src/db/schema/*',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  schemaFilter: 'public',
} satisfies Config;
