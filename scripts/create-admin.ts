/**
 * Create or promote an admin user (in-house auth).
 * Run from project root: npx tsx scripts/create-admin.ts [email] [password]
 *
 * If email/password are omitted, you'll be prompted. If the user exists, their
 * role is set to 'admin'. If not, a new user is created with role 'admin'.
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';
import * as readline from 'readline';

config({ path: resolve(process.cwd(), '.env.local') });

const SALT_ROUNDS = 10;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('❌ Missing env. In .env.local set: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

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

  const { data: existing } = await supabase
    .from('users')
    .select('id, email, role')
    .eq('email', normalizedEmail)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from('users')
      .update({ role: 'admin' })
      .eq('id', (existing as { id: string }).id);

    if (error) {
      console.error('❌ Failed to promote user:', error.message);
      process.exit(1);
    }
    console.log('✅ User promoted to admin:', normalizedEmail);
    return;
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const { error } = await supabase
    .from('users')
    .insert({
      email: normalizedEmail,
      name: 'Admin',
      role: 'admin',
      password_hash: passwordHash,
    })
    .select('id')
    .single();

  if (error) {
    console.error('❌ Failed to create admin:', error.message);
    process.exit(1);
  }
  console.log('✅ Admin account created:', normalizedEmail);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
