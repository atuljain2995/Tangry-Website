/**
 * Create or promote an admin user (in-house auth).
 * Run from project root: npx tsx scripts/create-admin.ts [email] [password]
 *
 * If email/password are omitted, you'll be prompted. If the user exists, their
 * role is set to 'admin'. If not, a new user is created with role 'admin'.
 */

import bcrypt from 'bcrypt';
import * as readline from 'readline';
import { connectNeon, loadEnv } from './lib/db-backup';

loadEnv();

const SALT_ROUNDS = 10;
const db = connectNeon();

function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve((answer || '').trim());
    });
  });
}

async function main() {
  let email = process.argv[2];
  let password = process.argv[3];

  if (!email) email = await prompt('Admin email: ');
  if (!password) password = await prompt('Admin password (min 6 chars): ');

  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail || !password) {
    console.error('❌ Email and password are required.');
    process.exit(1);
  }
  if (password.length < 6) {
    console.error('❌ Password must be at least 6 characters.');
    process.exit(1);
  }

  const { rows: existing } = await db.query('SELECT id FROM users WHERE email = $1', [
    normalizedEmail,
  ]);

  if (existing.length > 0) {
    await db.query(`UPDATE users SET role = 'admin' WHERE id = $1`, [existing[0].id]);
    console.log('✅ User promoted to admin:', normalizedEmail);
    return;
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  await db.query(
    `INSERT INTO users (email, name, role, password_hash) VALUES ($1, 'Admin', 'admin', $2)`,
    [normalizedEmail, passwordHash],
  );
  console.log('✅ Admin account created:', normalizedEmail);
}

main()
  .catch((err) => {
    console.error('❌', err instanceof Error ? err.message : err);
    process.exitCode = 1;
  })
  .finally(() => db.end());
