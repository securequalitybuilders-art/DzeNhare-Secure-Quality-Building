import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { isAdminEmail } from './admin-access';

export function createSupabaseServerClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set() {},
        remove() {},
      },
    }
  );
}

export async function getAdminUser() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const user = data?.user || null;
  const email = user?.email || '';
  const isAdmin = await isAdminEmail(email);
  return { user, email, isAdmin };
}
