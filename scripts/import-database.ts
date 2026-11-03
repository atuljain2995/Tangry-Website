/**
 * Import a database backup into the Neon database in DATABASE_URL.
 * Run: npm run import-db [path/to/backup.json]
 *
 * WARNING: Clears existing rows in app tables before importing.
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import {
  connectNeon,
  DELETE_TABLE_ORDER,
  describeUrl,
  EXPORT_TABLE_ORDER,
  deleteAllRows,
  insertRows,
  loadEnv,
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
  loadEnv();
  const backup = loadBackup(backupPath);
  const client = connectNeon();
  const url = describeUrl(process.env.DATABASE_URL!);

  console.log('Importing into', url);
  console.log('Backup from:', backup.sourceUrl, `(${backup.exportedAt})`);
  console.log('File:', backupPath, '\n');

  if (url === backup.sourceUrl) {
    throw new Error('Target database is the backup source; refusing to overwrite it.');
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
    await insertRows(client, table, rows);
    console.log(rows.length, 'rows');
  }

  // Backups taken before migration 028 have raw variant names and no default variant.
  const variants = backup.tables.product_variants ?? [];
  if (variants.length > 0 && !('is_default' in variants[0])) {
    console.log('\nBackup predates migration 028; normalising variants...');
    await client.query('DROP INDEX IF EXISTS uq_product_variants_one_default');
    await client.query(
      readFileSync(resolve(process.cwd(), 'lib/db/migrations/028_product_variant_cleanup.sql'), 'utf8'),
    );
    await client.query('DROP TABLE IF EXISTS product_variants_backup_028');
  }

  await client.end();
  console.log('\nImport complete. Run npm run test-db to verify.');
}

main().catch((err) => {
  console.error('Import failed:', err instanceof Error ? err.message : err);
  process.exit(1);
});
