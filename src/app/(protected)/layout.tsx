import { getSession } from '@/lib/server/getSession';
import { redirect } from 'next/navigation';

type RootLayoutProps = {
  children: React.ReactNode;
};

export default async function ProtectedLayout({ children }: RootLayoutProps) {
  const session = await getSession();

  if (!session) redirect('/auth/signin');

   // Layout-specific UI is handled in nested layouts
  return <>{children}</>;
}
