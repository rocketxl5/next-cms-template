import { redirect } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getRedirectPathname } from '@/lib/server/getRedirectPathname';
import { getSession } from '@/lib/server/getSession';

type RootLayoutProps = {
  children: React.ReactNode;
};

export default async function PublicLayout({ children }: RootLayoutProps) {
  const session = await getSession();

  if (session) redirect(getRedirectPathname(session.user.role));

  return (
    <>
      <Header context="public" />
      <div className="min-h-screen mx-auto max-w-5xl">{children}</div>
      <Footer />
    </>
  );
}
