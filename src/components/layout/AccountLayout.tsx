/**

* AccountLayout Component
* ---
*
* Shared layout wrapper for protected routes (user and admin contexts).
*
* Features:
* * Renders Header with appropriate context ('user' | 'admin')
* * Wraps main content area
* * Includes Footer
*
* Props:
* context: Determines which header to display
* children: ReactNode content to render within the layout
*
* Part of next-cms-template v1.0.0.
  */

// Import shared layout components
import { Header } from './Header';
import { Footer } from './Footer';

// Props type for AccountLayout component
type AccountLayoutProps = {
  context: 'user' | 'admin';
  children: React.ReactNode;
};

/**

* Layout for protected routes.
* @param context - 'user' or 'admin' to determine header behavior
* @param children - Page content to render inside the layout
  */
export function AccountLayout({ context, children }: AccountLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header with context-specific title and buttons */}
      <Header context={context} />
      {/* Main content area */}
      <main className="flex-1">{children}</main>
      {/* Footer */}
      <Footer />
    </div>
  );
}
