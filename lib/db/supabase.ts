// Supabase client for PostgreSQL database
import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// Get environment variables with fallbacks for development
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key';

// Check if Supabase is properly configured
export const isSupabaseConfigured = 
  supabaseUrl !== 'https://placeholder.supabase.co' && 
  supabaseAnonKey !== 'placeholder-anon-key';

// Client-side Supabase client (public operations)
export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

// Server-side Supabase client (admin operations)
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

// Track if we've already logged a connectivity warning (avoid console spam)
let hasLoggedConnectivityWarning = false;

/**
 * Check if error is due to Supabase being unreachable (network/DNS).
 * Logs a single user-friendly message and returns true if so.
 */
export function isSupabaseUnreachable(error: unknown): boolean {
  const msg = String((error as { message?: string })?.message ?? '');
  const details = String((error as { details?: string })?.details ?? '');
  const isNetworkError =
    msg.includes('fetch failed') ||
    details.includes('ENOTFOUND') ||
    details.includes('getaddrinfo');
  if (isNetworkError && !hasLoggedConnectivityWarning) {
    hasLoggedConnectivityWarning = true;
    if (!isSupabaseConfigured) {
      console.warn(
        '[Supabase] Not configured. Add to .env.local:\n' +
          '  NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co\n' +
          '  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key\n' +
          'Get these from Supabase Dashboard → Project Settings → API.'
      );
    } else {
      console.warn(
        '[Supabase] Cannot reach Supabase (network/DNS). Check:\n' +
          '  • Internet connection and VPN\n' +
          '  • NEXT_PUBLIC_SUPABASE_URL is correct (https://YOUR_REF.supabase.co)\n' +
          '  • Project not paused: dashboard.supabase.com → your project\n' +
          '  • Run "npm run test-db" from this repo to verify connection'
      );
    }
  }
  return isNetworkError;
}

// Helper function to handle Supabase errors
export function handleSupabaseError(error: { code?: string; message?: string }) {
  console.error('Supabase error:', error);

  if (error.code === 'PGRST116') {
    return { error: 'Resource not found', status: 404 };
  }

  if (error.code === '23505') {
    return { error: 'Resource already exists', status: 409 };
  }

  if (error.code === '23503') {
    return { error: 'Invalid reference', status: 400 };
  }

  return { error: 'Internal server error', status: 500 };
}

// Type-safe query builders (use supabaseAdmin for server-side writes to bypass RLS)
export const db = {
  products: supabaseAdmin.from('products'),
  users: supabaseAdmin.from('users'),
  orders: supabaseAdmin.from('orders'),
  addresses: supabaseAdmin.from('addresses'),
  reviews: supabaseAdmin.from('reviews'),
  coupons: supabaseAdmin.from('coupons'),
  email_subscribers: supabaseAdmin.from('email_subscribers'),
};

