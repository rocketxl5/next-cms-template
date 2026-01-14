import Providers from './providers';
import { getTheme } from '@/lib/theme/getTheme';
import './globals.css';

type RootLayoutProps = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: RootLayoutProps) {
  const theme = await getTheme();

  return (
    <html lang="en" className={theme} suppressHydrationWarning>
      <body>
        <Providers initialTheme={theme}>{children}</Providers>
      </body>
    </html>
  );
}
