import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

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

const PAGE_SIZE = 1000;

export function loadEnv(): { url: string; serviceKey: string } {
  config({ path: resolve(process.cwd(), '.env.local') });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey || serviceKey === 'placeholder-service-key') {
    throw new Error(
      'Missing Supabase env. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local',
    );
  }
  return { url, serviceKey };
}

export function createServiceClient(): SupabaseClient {
  const { url, serviceKey } = loadEnv();
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function fetchAllRows(
  client: SupabaseClient,
  table: string,
): Promise<Record<string, unknown>[]> {
  const rows: Record<string, unknown>[] = [];
  let from = 0;

  while (true) {
    const { data, error } = await client
      .from(table)
      .select('*')
      .range(from, from + PAGE_SIZE - 1);

    if (error) {
      const msg = error.message.toLowerCase();
      if (
        error.code === '42P01' ||
        msg.includes('does not exist') ||
        msg.includes('schema cache')
      ) {
        return [];
      }
      throw new Error(`${table}: ${error.message}`);
    }

    const batch = (data ?? []) as Record<string, unknown>[];
    rows.push(...batch);
    if (batch.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }

  return rows;
}

export async function deleteAllRows(client: SupabaseClient, table: string): Promise<void> {
  const { error } = await client.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (error) {
    const msg = error.message.toLowerCase();
    if (
      error.code === '42P01' ||
      msg.includes('does not exist') ||
      msg.includes('schema cache')
    ) {
      return;
    }
    throw new Error(`Failed to clear ${table}: ${error.message}`);
  }
}

export async function upsertRows(
  client: SupabaseClient,
  table: string,
  rows: Record<string, unknown>[],
): Promise<void> {
  if (rows.length === 0) return;

  const chunkSize = 100;
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    const { error } = await client.from(table).upsert(chunk, { onConflict: 'id' });
    if (error) {
      throw new Error(`Failed to import ${table}: ${error.message}`);
    }
  }
}
