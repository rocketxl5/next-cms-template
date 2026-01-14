import { useProtectedQuery } from './useProtectedQuery';
import type { DashboardUser } from '@/types/dashboard';

export function useDashBoard() {
  return useProtectedQuery<DashboardUser>(['dashboard'], '/dashboard');
}
