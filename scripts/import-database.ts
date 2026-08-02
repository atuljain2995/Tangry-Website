/**
 * Import a database backup into the Supabase project configured in .env.local.
 * Run: npm run import-db [path/to/backup.json]
 *
 * WARNING: Clears existing rows in app tables before importing.
 * Point .env.local at your NEW Supabase project before running.
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import {
  createServiceClient,
  DELETE_TABLE_ORDER,
  EXPORT_TABLE_ORDER,
  deleteAllRows,
  loadEnv,
  upsertRows,
  type DatabaseBackup,
} from './lib/db-backup';

function loadBackup(filePath: string): DatabaseBackup {
  const raw = readFileSync(filePath, 'utf8');
  const backup = JSON.parse(raw) as DatabaseBackup;
  if (backup.version !== 1 || !backup.tables) {
    throw new Error('Invalid backup file format');
  }
  return backup;
}

async function main() {
  const backupPath = resolve(process.cwd(), process.argv[2] ?? 'backups/db-export-latest.json');
  const { url } = loadEnv();
  const backup = loadBackup(backupPath);
  const client = createServiceClient();

  console.log('Importing into', url);
  console.log('Backup from:', backup.sourceUrl, `(${backup.exportedAt})`);
  console.log('File:', backupPath, '\n');

  if (url === backup.sourceUrl) {
    console.warn('WARNING: Target URL matches backup source. Use a NEW project URL in .env.local.\n');
  }

  console.log('Clearing existing data...');
  for (const table of DELETE_TABLE_ORDER) {
    process.stdout.write(`  ${table}... `);
    await deleteAllRows(client, table);
    console.log('cleared');
  }

  console.log('\nImporting rows...');
  for (const table of EXPORT_TABLE_ORDER) {
    const rows = backup.tables[table] ?? [];
    process.stdout.write(`  ${table}... `);
    await upsertRows(client, table, rows);
    console.log(rows.length, 'rows');
  }

  console.log('\nImport complete. Run npm run test-db to verify.');
}

main().catch((err) => {
  console.error('Import failed:', err instanceof Error ? err.message : err);
  process.exit(1);
});
