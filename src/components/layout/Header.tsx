// import { ThemeBtn } from '../ui/button/ThemeBtn';
// import { getSession } from '@/lib/server/getSession';
// import { Role } from '@prisma/client';

// const ROLE_TILE: Partial<Record<Role, string>> = {
//   ADMIN: 'Admin',
//   SUPER_ADMIN: 'Admin',
//   USER: 'Dashboard',
// };

// export default async function Header({
//   showThemeToggle = true,
// }: {
//   showThemeToggle?: boolean;
// }) {
//   const session = await getSession();
//   const role = session?.user.role;

//   const title = role ? ROLE_TILE[role] ?? 'CMS' : 'ACME LOGO';

//   return (
//     <header className="flex items-center justify-between border-b p-4">
//       <div className="font-semibold">{title}</div>
//       <div className="flex items-center gap-4">
//         {showThemeToggle && <ThemeBtn />}
//       </div>
//     </header>
//   );
// }

import { ToggleThemeBtn } from '../ui/button/ToggleThemeBtn';
import { SignoutBtn } from '../ui/button/SignoutBtn';
import type { AppContext } from '@/types/contexts';

const HEADER_TITLES: Record<AppContext, string> = {
  public: 'ACME LOGO',
  user: 'AUTH USER',
  admin: 'ADMIN',
};

type HeaderProps = {
  context: AppContext;
};

export function Header({ context = 'public' }: HeaderProps) {
  const isAuthenticated = context !== 'public';

  return (
    <header className="flex items-center justify-between border-b p-4">
      <div className="font-semibold">{HEADER_TITLES[context]}</div>
      <div className="flex items-center gap-4">
        <ToggleThemeBtn />
        {isAuthenticated && <SignoutBtn />}
      </div>
    </header>
  );
}
