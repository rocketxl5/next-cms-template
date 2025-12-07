import type { StringValue } from 'ms';

/**
 * Returns a typed ms-compatible time value for JWT expiration.
 * Example: "15m", "7d", "1h"
 */
export function getExpires(name: string, fallback: StringValue): StringValue {
  const value = process.env[name] as StringValue | undefined;
  return value ?? fallback;
}
