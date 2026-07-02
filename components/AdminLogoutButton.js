'use client';

import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '../lib/supabase-browser';

export default function AdminLogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    if (supabaseBrowser) {
      await supabaseBrowser.auth.signOut();
    }
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <button type="button" className="btn btn-secondary" onClick={handleLogout}>
      Sign out
    </button>
  );
}
