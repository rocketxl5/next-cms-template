/**
 * API RESPONSE INTERCEPTORS
 * -------------------------
 *
 * Role:
 * - Attach response interceptors to the shared axios instance.
 * - This file does NOT create or export an API client; it only mutates it.
 *
 * Relationship to other files:
 * - `axios.ts`      → creates the base axios instance (pure, no side effects).
 * - `interceptors.ts` → registers response interceptors (side effects).
 * - `index.ts`      → ensures this file is executed before the API is used.
 *
 * Why this is separate:
 * - Interceptors are side effects; keeping them separate avoids hidden behavior and circular logic.
 * - Makes auth, logging, or other interceptors modular and maintainable.
 *
 * Execution model:
 * - Runs only when imported.
 * - Imported for its side effects by `lib/api/index.ts`.
 *
 * Auth-specific responsibility:
 * - Detect expired/invalid user sessions (HTTP 401).
 * - Redirect unauthenticated users to `/auth/signin`.
 * - Preserve original route for post-login redirection.
 *
 * IMPORTANT:
 * - Do NOT import this file directly elsewhere.
 * - Always import the API client from `lib/api`.
 */

import api from './axios';

// Flag to prevent infinite redirect loops
let isRedirecting = false;

/**
 * Axios response interceptor.
 *
 * - Passes successful responses through unchanged.
 * - On 401 responses in the browser:
 *    - If not already redirecting and not on a public auth page:
 *       - Redirect to `/auth/signin?from=currentPath`.
 *    - Sets `isRedirecting` to avoid loops.
 */
api.interceptors.response.use(
  (response) => response, // success passthrough
  (error) => {
    const status = error.response?.status;

    if (status === 401 && typeof window !== 'undefined' && !isRedirecting) {
      const currentPath = window.location.pathname;

      // Skip redirect if already on signin/signup
      if (
        !currentPath.startsWith('/auth/signin') &&
        !currentPath.startsWith('/auth/signup')
      ) {
        isRedirecting = true;

        // Redirect to signin, preserving original route
        window.location.href = `/auth/signin?from=${encodeURIComponent(
          currentPath
        )}`;
      }
    }

    // Propagate the error to the original caller
    return Promise.reject(error);
  }
);
