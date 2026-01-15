/**

* Generic React Query hook for fetching data from protected API endpoints.
*
* Behavior:
* 1. Uses the shared Axios instance (`api`) with request/response interceptors.
* 2. Automatically handles authenticated requests using cookies or tokens.
* 3. Returns the data fetched from the specified URL, or React Query error/loading state.
*
* Parameters:
* key: Unique query key for caching and invalidation.
* url: The API endpoint to fetch data from.
*
* Usage:
* const { data, isLoading, error } = useProtectedQuery<User>(['user'], '/user/me');
*
* This hook simplifies protected data fetching and ensures consistent API usage
* across the application.
* Part of next-cms-template v1.0.0.
  */

// Import useQuery from React Query
import { useQuery } from '@tanstack/react-query';

// Import the shared Axios instance with interceptors
import { api } from '@/lib/api';

/**

* Executes a GET request to a protected API endpoint and returns a React Query result.
* @param key - Unique query key for caching
* @param url - API endpoint to fetch data from
  */
export function useProtectedQuery<T>(key: string[], url: string) {
  return useQuery<T>({
    queryKey: key, // React Query cache key
    queryFn: async () => {
      const res = await api.get<T>(url); // Fetch data using Axios
      return res.data; // Return only the response data
    },
  });
}
