import { createClient } from '@supabase/supabase-js';

// Retrieve values with fallbacks to ensure zero-config out of the box
const rawUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://ftaitlirrlqxsdcbjmuv.supabase.co';
const supabaseUrl = rawUrl.replace('/rest/v1/', '').replace('/rest/v1', '').trim();
const supabaseAnonKey = ((import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'sb_publishable_6Z2D61nQGA9tt1kPRezq4Q_7lFNBlT2').trim();

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Robust database helper functions that support graceful fallback to LocalStorage
 * if the database connection fails, tables aren't created yet, or RLS blocks requests.
 */

// Helper to check if Supabase is actually responsive and tables are queryable
export async function testConnection(): Promise<boolean> {
  try {
    const { error } = await supabase.from('wales_organisations').select('count', { count: 'exact', head: true });
    if (error) {
      console.warn('Supabase test connection warning (table may not exist yet):', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.error('Supabase connection error:', e);
    return false;
  }
}
