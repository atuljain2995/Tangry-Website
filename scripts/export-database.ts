/**
 * Export all app data from the current Supabase project to backups/.
 * Run: npm run export-db
 */

import { mkdirSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import {
  createServiceClient,
  EXPORT_TABLE_ORDER,
  fetchAllRows,
  loadEnv,
  type DatabaseBackup,
} from './lib/db-backup';

function timestamp(): string {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

async function main() {
  const { url } = loadEnv();
  const client = createServiceClient();
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
    const rows = await fetchAllRows(client, table);
    backup.tables[table] = rows;
    backup.counts[table] = rows.length;
    console.log(rows.length, 'rows');
  }

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
