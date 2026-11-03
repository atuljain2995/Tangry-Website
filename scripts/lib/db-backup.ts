import { config } from 'dotenv';
import { resolve } from 'path';
import { Pool as NeonPool, neonConfig } from '@neondatabase/serverless';
import { Pool as PgPool } from 'pg';
import ws from 'ws';

/** Import order (parents before children). */
export const EXPORT_TABLE_ORDER = [
  'product_categories',
  'users',
  'products',
  'product_variants',
  'product_images',
  'addresses',
  'sessions',
  'coupons',
  'reviews',
  'orders',
  'contact_inquiries',
  'email_subscribers',
  'wishlists',
  'b2b_quotes',
  'cwv_readings',
  'admin_rebuild_requests',
  'checkout_email_otps',
  'checkout_verified_emails',
  'recipe_ratings',
  'recipe_rating_totals',
] as const;

/** Delete order (children before parents). */
export const DELETE_TABLE_ORDER = [...EXPORT_TABLE_ORDER].reverse();

export type BackupTableName = (typeof EXPORT_TABLE_ORDER)[number];

export type DatabaseBackup = {
  version: 1;
  exportedAt: string;
  sourceUrl: string;
  tables: Partial<Record<BackupTableName, Record<string, unknown>[]>>;
  counts: Partial<Record<BackupTableName, number>>;
};

export type Queryable = {
  query: (text: string, params?: unknown[]) => Promise<{ rows: Record<string, unknown>[] }>;
  end: () => Promise<void>;
};

export function loadEnv(): void {
  config({ path: resolve(process.cwd(), '.env.local'), quiet: true });
}

/** Host only, so backups never store credentials. */
export function describeUrl(url: string): string {
  return new URL(url).host;
}

/** Neon target (WebSocket over 443, works behind restrictive networks). */
export function connectNeon(url = process.env.DATABASE_URL): Queryable {
  if (!url) throw new Error('DATABASE_URL is not set in .env.local');
  neonConfig.webSocketConstructor = ws;
  return new NeonPool({ connectionString: url }) as unknown as Queryable;
}

/** Any Postgres (e.g. the old Supabase database) over a direct TCP connection. */
export function connectPostgres(url: string): Queryable {
  return new PgPool({ connectionString: url }) as unknown as Queryable;
}

function isMissingTable(error: unknown): boolean {
  return (error as { code?: string })?.code === '42P01';
}

export async function fetchAllRows(
  client: Queryable,
  table: string,
): Promise<Record<string, unknown>[]> {
  try {
    const { rows } = await client.query(`SELECT * FROM public."${table}"`);
    return rows;
  } catch (error) {
    if (isMissingTable(error)) return [];
    throw error;
  }
}

export async function deleteAllRows(client: Queryable, table: string): Promise<void> {
  await client.query(`DELETE FROM public."${table}"`);
}

/**
 * Insert rows, writing only columns present in the backup so columns added by later
 * migrations keep their database defaults instead of becoming NULL.
 */
export async function insertRows(
  client: Queryable,
  table: string,
  rows: Record<string, unknown>[],
): Promise<void> {
  if (rows.length === 0) return;

  const { rows: colRows } = await client.query(
    `SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = $1`,
    [table],
  );
  const tableCols = new Set(colRows.map((r) => String(r.column_name)));
  const present = new Set(rows.flatMap((r) => Object.keys(r)));
  const cols = [...present].filter((c) => tableCols.has(c));
  const skipped = [...present].filter((c) => !tableCols.has(c));
  if (skipped.length) console.warn(`\n    ${table}: ignoring unknown columns ${skipped.join(', ')}`);

  const colList = cols.map((c) => `"${c}"`).join(', ');
  const chunkSize = 200;
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    await client.query(
      `INSERT INTO public."${table}" (${colList})
       SELECT ${colList} FROM json_populate_recordset(NULL::public."${table}", $1::json)
       ON CONFLICT DO NOTHING`,
      [JSON.stringify(chunk)],
    );
  }
}
