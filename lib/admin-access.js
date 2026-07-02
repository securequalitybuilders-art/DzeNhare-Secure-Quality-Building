import { createClient } from '@supabase/supabase-js';
import { ADMIN_EMAILS } from './admin-config';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ADMIN_USERS_TABLE = 'admin_users';

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function getServiceClient() {
  if (!url || !serviceRoleKey || serviceRoleKey === 'replace-with-service-role-key') {
    return null;
  }

  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function isAdminEmail(email) {
  const normalized = normalizeEmail(email);
  if (!normalized) return false;

  const supabase = getServiceClient();

  if (supabase) {
    const { data, error } = await supabase
      .from(ADMIN_USERS_TABLE)
      .select('email, active')
      .eq('email', normalized)
      .eq('active', true)
      .maybeSingle();

    if (!error) {
      return Boolean(data?.email);
    }
  }

  // Safe fallback for local development or before the admin_users migration is applied.
  return ADMIN_EMAILS.map(normalizeEmail).includes(normalized);
}

export function normalizeAdminEmail(email) {
  return normalizeEmail(email);
}
