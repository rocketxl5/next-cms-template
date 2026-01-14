// app/(protected)/admin/layout.tsx
import { AccountLayout } from '@/components/layout/AccountLayout';
import { requireRole } from '@/lib/server/requireRole';
import { Role } from '@prisma/client';

type RootLayoutProps = {
  children: React.ReactNode;
};

export default async function AdminLayout(props: RootLayoutProps) {
  await requireRole({
    roles: [Role.ADMIN, Role.SUPER_ADMIN],
    forbiddenRedirect: '/user',
  });

  return <AccountLayout context="admin" {...props} />;
}
