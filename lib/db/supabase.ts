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

// Type-safe query builders
export const db = {
  products: supabaseAdmin.from('products'),
  users: supabaseAdmin.from('users'),
  orders: supabaseAdmin.from('orders'),
  addresses: supabaseAdmin.from('addresses'),
  reviews: supabaseAdmin.from('reviews'),
  coupons: supabaseAdmin.from('coupons'),
  email_subscribers: supabaseAdmin.from('email_subscribers'),
};

