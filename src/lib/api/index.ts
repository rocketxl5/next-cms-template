/**
 * API ENTRY POINT
 * ----------------
 *
 * This file exists to CONTROL INITIALIZATION ORDER.
 *
 * Why:
 * - `axios.ts` only CREATES the axios instance.
 * - `interceptors.ts` MUTATES that instance (side effects).
 * - Side-effect files are executed ONLY when they are imported.
 *
 * Problem this solves:
 * - Importing `axios.ts` directly does NOT execute `interceptors.ts`.
 * - That would result in requests being made without auth/session handling.
 * - Import order bugs are subtle and hard to trace.
 *
 * Solution:
 * - This file force-imports `interceptors.ts` for its side effects.
 * - Then re-exports the axios instance as the ONLY public API.
 *
 * Result:
 * - Interceptors are guaranteed to be registered before any request.
 * - Consumers cannot accidentally bypass auth logic.
 * - Initialization is deterministic and runs exactly once.
 *
 * IMPORTANT:
 * - Always import `api` from `lib/api`, never from `lib/api/axios` directly.
 */

import './interceptors';

export { default as api } from './axios';