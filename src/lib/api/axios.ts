/**
 * AXIOS API CLIENT
 * ----------------
 *
 * Role:
 * - Creates and exports a single shared axios instance.
 * - This file is intentionally PURE (no side effects).
 *
 * What this file does NOT do:
 * - Does NOT register interceptors.
 * - Does NOT contain auth, redirect, or session logic.
 *
 * Why this separation exists:
 * - Creating the client and mutating its behavior are separate concerns.
 * - Keeping this file pure ensures predictable imports and easy testing.
 * - Side-effect logic (interceptors) must be explicitly initialized elsewhere.
 *
 * Relationship to other files:
 * - `axios.ts`        → defines the axios instance.
 * - `interceptors.ts` → augments the instance with behavior (side effects).
 * - `index.ts`        → enforces initialization order and exposes the public API.
 *
 * Usage:
 * - This file should NOT be imported directly by application code.
 * - Always import the API client from `lib/api` (entry point).
 *
 * Benefits:
 * - Prevents hidden behavior at import time.
 * - Avoids circular dependencies.
 * - Makes interceptor logic explicit and composable.
 */

import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // sends cookies automatically
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
