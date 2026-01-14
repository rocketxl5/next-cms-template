/**
 * normalizeObject.ts
 *
 * Utility to normalize arbitrary objects (e.g., form payloads) based on a map of normalizer functions.
 * Each key in the object can have a corresponding normalizer function that transforms its value.
 * The function returns a Partial<T> since only keys with normalizers are guaranteed to exist.
 *
 * Example usage:
 *
 * import { normalizeObject } from './object';
 * import { normalizeEmail, normalizeDisplayName, normalizeSlug } from './index';
 *
 * interface FormData {
 *   email: string;
 *   name: string;
 *   slug: string;
 *   age?: number; // optional field, no normalizer
 * }
 *
 * const rawData = {
 *   email: '  Max@Example.COM  ',
 *   name: '  Max   ',
 *   slug: 'My New Post',
 *   age: 25
 * };
 *
 * const normalized = normalizeObject<FormData>(rawData, {
 *   email: normalizeEmail,
 *   name: normalizeDisplayName,
 *   slug: normalizeSlug
 * });
 *
 * // Result:
 * // normalized = {
 * //   email: 'max@example.com',
 * //   name: 'Max',
 * //   slug: 'my-new-post'
 * // }
 * // Note: age is not included since no normalizer was provided
 *
 * This utility is useful for:
 * - Normalizing form submissions before validation or persistence
 * - Ensuring consistent casing, trimming, or formatting across all inputs
 * - Preventing duplicate entries caused by whitespace or casing inconsistencies
 *
 * Usage pattern:
 * 1. Define primitive normalizers (string, lowercase, uppercase, etc.)
 * 2. Define domain-specific normalizers (email, slug, display name)
 * 3. Map object keys to the appropriate normalizer
 * 4. Call normalizeObject to get a Partial<T> with normalized values
 */

export type Normalizer<T> = (value: unknown) => T;

export type NormalizerMap<T extends object> = {
  [K in keyof T]?: Normalizer<T[K]>;
};

export function normalizeObject<T extends object>(
  input: Record<string, unknown>,
  normalizers: NormalizerMap<T>
): Partial<T> {
  const result: Partial<T> = {};

  for (const key in normalizers) {
    const normalizer = normalizers[key];
    if (!normalizer) continue;

    const value = input[key as string];
    result[key] = normalizer(value);
  }

  return result;
}
