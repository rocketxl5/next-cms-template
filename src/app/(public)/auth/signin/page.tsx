// Architecture
//
// Page (server)
//  └─ Suspense
//      └─ SigninForm (client, owns logic)
//      └─ SigninSkeleton

'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import SigninForm from '../../../../components/auth/SigninForm';
import { getRedirectPathname } from '@/lib/server/getRedirectPathname';
import { useTheme } from '@/components/providers/ThemeProvider';
import { User } from '@/types/users';
import { ThemeClassName } from '@/lib/theme/mapTheme';

export default function SigninPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUserTheme } = useTheme();

  return (
    <SigninForm
      onSuccess={(user: User) => {
        // 1️⃣ Sync theme for SSR + provider
        setUserTheme(user.theme as ThemeClassName);

        // 2️⃣ Refresh server components so layouts & RootLayout pick up session
        router.refresh(); // Triggers RootLayout → getTheme → ThemeProvider

        // 3️⃣ Determine redirect path based on role or "from" query
        const from = searchParams.get('from');
        const pathname = getRedirectPathname(user.role, from);

        // 4️⃣ Navigate
        router.replace(pathname);
      }}
    />
  );
}
