/**
 * withSuspense
 * -------------------------------------------------------
 * Wraps a client component in a React Suspense boundary.
 *
 * Purpose:
 *   - Centralize Suspense logic
 *   - Avoid repeating <Suspense> blocks across pages or components
 *   - Preserve full prop typing via TypeScript generics
 *
 * Design:
 *   - Accepts any function component
 *   - Forwards props transparently to the wrapped component
 *   - Requires a fallback component for loading states
 *
 * Usage:
 *   export default withSuspense(SigninForm, Spinner)
 *
 * Notes:
 *   - Ideal for lazy-loaded components or React 18 suspense data fetching
 *   - Keeps fallback behavior consistent across the app
 * -------------------------------------------------------
 */

'use client';

import { ComponentType, Suspense } from 'react';

/**
 * Higher-order component to wrap a React component in Suspense.
 *
 * @param Component - The component to render inside Suspense
 * @param Fallback - Component to render while loading
 * @returns A new component wrapped in a Suspense boundary
 */
export function withSuspense<P extends object>(
  Component: ComponentType<P>,
  Fallback: ComponentType<object>
) {
  // Inner component handles prop forwarding and Suspense
  const WithSuspense = (props: P) => (
    <Suspense fallback={<Fallback />}>
      <Component {...props} />
    </Suspense>
  );

  return WithSuspense;
}
