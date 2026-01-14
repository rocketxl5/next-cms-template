/**
 * withSuspense
 * -------------------------------------------------------
 * Wraps a client component in a React Suspense boundary.
 *
 * Purpose:
 *   - Centralize Suspense logic
 *   - Avoid repeating <Suspense> blocks in pages
 *   - Preserve full prop typing via generics
 *
 * Design:
 *   - Accepts any function component
 *   - Forwards props transparently
 *   - Optional fallback component
 *
 * Usage:
 *   export default withSuspense(SigninForm, Spinner)
 * -------------------------------------------------------
 */

'use client';

import { ComponentType, Suspense } from 'react';

export function withSuspense<P extends object>(
  Component: ComponentType<P>,
  Fallback: ComponentType<object>
) {
  const WithSuspense = (props: P) => (
    <Suspense fallback={<Fallback />}>
      <Component {...props} />
    </Suspense>
  );

  return WithSuspense;
}
