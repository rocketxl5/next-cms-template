import { Header } from './Header';
import { Footer } from './Footer';

type AccountLayoutProps = {
  context: 'user' | 'admin';
  children: React.ReactNode;
};

// Shared layout wrapper for protected routes
export function AccountLayout({ context, children }: AccountLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header context={context} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
