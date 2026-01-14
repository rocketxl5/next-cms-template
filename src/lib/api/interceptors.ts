/**
 * API RESPONSE INTERCEPTORS
 * -------------------------
 *
 * Role:
 * - This file attaches response interceptors to the shared axios instance.
 * - It does NOT create or export an API client.
 *
 * Relationship to other files:
 * - `axios.ts`      → creates the axios instance (pure, no side effects).
 * - `interceptors.ts` → mutates that instance by registering interceptors.
 * - `index.ts`      → guarantees this file is executed before the API is used.
 *
 * Why this is separate:
 * - Interceptors are side effects and must be opt-in and ordered.
 * - Keeping them out of `axios.ts` avoids hidden behavior and circular logic.
 * - This allows interceptors to evolve independently (auth, refresh, logging).
 *
 * Execution model:
 * - Code in this file runs ONLY when it is imported.
 * - It is intentionally imported for its side effects by `lib/api/index.ts`.
 *
 * Auth-specific responsibility:
 * - Detect expired or invalid user sessions (HTTP 401).
 * - Redirect unauthenticated users to public auth routes.
 * - Preserve the original route for post-login redirection.
 *
 * IMPORTANT:
 * - Do NOT import this file directly anywhere else.
 * - Always import the API client from `lib/api` (entry point).
 */

import api from './axios';

let isRedirecting = false;

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401 && typeof window !== 'undefined' && !isRedirecting) {
      const currentPath = window.location.pathname;

      // Avoid infinite loop
      if (
        !currentPath.startsWith('/auth/signin') &&
        !currentPath.startsWith('/auth/signup')
      ) {
        isRedirecting = true;

        window.location.href = `/auth/signin?from=${encodeURIComponent(
          currentPath
        )}`;
      }
    }

    return Promise.reject(error);
  }
);
