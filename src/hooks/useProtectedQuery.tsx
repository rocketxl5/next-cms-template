import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useProtectedQuery<T>(key: string[], url: string) {
  return useQuery<T>({
    queryKey: key,
    queryFn: async () => {
      const res = await api.get<T>(url);
      return res.data;
    },
  });
}
