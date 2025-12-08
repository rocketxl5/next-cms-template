import { requireRole } from '@/lib/auth/role';

export default async function AdminDashboard() {
  // Only admin or super_admin can access
  const user = await requireRole(['ADMIN', 'SUPER_ADMIN']);

  return (
    <div>
      <h1>Admin Users Page</h1>
      <p>Welcome, {user.email}</p>
      <p>Role: {user.role}</p>
      <p>Here you can manage users.</p>
      <p>Placeholder page for CMS + E-commerce template.</p>
    </div>
  );
}
