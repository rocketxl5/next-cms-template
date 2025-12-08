import { requireRole } from '@/lib/auth/role';

export default async function AdminPage() {
  // Will throw automatically if unauthorized
  const user = await requireRole('admin');

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user.name}</p>
    </div>
  );
}
