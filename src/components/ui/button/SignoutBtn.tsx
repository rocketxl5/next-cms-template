/**
 * SIGN OUT BUTTON
 * -------------------------------------------------------
 * Purpose:
 *   Provides a reusable button for logging out the current user.
 *
 * Responsibilities:
 *   - Calls the `signOut` helper to trigger server-side logout
 *   - Redirects the user to the signin page
 *   - Refreshes server components to clear auth-dependent UI
 *   - Displays a loading state while the request is in progress
 *
 * Usage:
 *   import { SignOutButton } from '@/components/SignOutButton';
 *   <SignOutButton />
 *
 * Notes:
 *   - Designed for App Router (Next.js 13+) with server components
 *   - Logout is idempotent: safe to call multiple times
 *   - Does not directly manipulate cookies or JWTs
 *
 * Optional enhancements:
 *   - Add styling to match global theme
 *   - Place in layout, header, or dropdown menus
 * -------------------------------------------------------
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from '@/lib/server/signOut';
import { useTheme } from '@/components/providers/ThemeProvider';

export function SignoutBtn() {
  const [loading, setLoading] = useState(false);
  const { setDefaultTheme } = useTheme();
  const router = useRouter();

  async function handleSignOut() {
    setLoading(true);

    try {
      await signOut();
      setDefaultTheme();
      router.refresh(); // re-evaluate layouts
      router.push('/auth/signin');
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className="rounded border px-4 py-2"
    >
      {loading ? 'Signing out...' : 'Sign Out'}
    </button>
  );
}
