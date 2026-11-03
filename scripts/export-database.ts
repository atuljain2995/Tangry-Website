/**
 * Export all app data to backups/.
 * Run: npm run export-db [-- --from-supabase]
 * Source: Supabase REST API (--from-supabase, uses NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY),
 * else SOURCE_DATABASE_URL (any Postgres), else DATABASE_URL (Neon).
 */

import { mkdirSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import {
  connectNeon,
  connectPostgres,
  describeUrl,
  EXPORT_TABLE_ORDER,
  fetchAllRows,
  fetchAllRowsSupabaseRest,
  loadEnv,
  type DatabaseBackup,
} from './lib/db-backup';

function timestamp(): string {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

async function main() {
  loadEnv();
  const fromSupabase = process.argv.includes('--from-supabase');
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (fromSupabase && (!supabaseUrl || !serviceKey)) {
    throw new Error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local');
  }
  const sourceUrl = process.env.SOURCE_DATABASE_URL;
  const client = fromSupabase ? null : sourceUrl ? connectPostgres(sourceUrl) : connectNeon();
  const url = describeUrl(
    fromSupabase ? supabaseUrl! : (sourceUrl ?? process.env.DATABASE_URL!),
  );
  const backup: DatabaseBackup = {
    version: 1,
    exportedAt: new Date().toISOString(),
    sourceUrl: url,
    tables: {},
    counts: {},
  };

  console.log('Exporting database from', url, '\n');

  for (const table of EXPORT_TABLE_ORDER) {
    process.stdout.write(`  ${table}... `);
    const rows = client
      ? await fetchAllRows(client, table)
      : await fetchAllRowsSupabaseRest(supabaseUrl!, serviceKey!, table);
    backup.tables[table] = rows;
    backup.counts[table] = rows.length;
    console.log(rows.length, 'rows');
  }
  await client?.end();

  const dir = resolve(process.cwd(), 'backups');
  mkdirSync(dir, { recursive: true });

  const datedPath = resolve(dir, `db-export-${timestamp()}.json`);
  const latestPath = resolve(dir, 'db-export-latest.json');
  const payload = JSON.stringify(backup, null, 2);

  writeFileSync(datedPath, payload, 'utf8');
  writeFileSync(latestPath, payload, 'utf8');

  console.log('\nExport complete:');
  console.log('  ', datedPath);
  console.log('  ', latestPath);
  console.log('\nTotals:');
  for (const table of EXPORT_TABLE_ORDER) {
    const count = backup.counts[table] ?? 0;
    if (count > 0) console.log(`  ${table}: ${count}`);
  }
}

main().catch((err) => {
  console.error('Export failed:', err instanceof Error ? err.message : err);
  process.exit(1);
});
