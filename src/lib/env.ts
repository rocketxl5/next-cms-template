import type { StringValue } from 'ms';

/**
 * Throws if env variable is missing.
 * Use for secrets and critical config.
 */
export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

/**
 * Returns env variable or fallback.
 * Use for non-critical config.
 */
export function getEnv(name: string, fallback: string): string {
  return process.env[name] ?? fallback;
}

/**
 * Same as getEnv but typed for ms-compatible dureations.
 * Returns a typed ms-compatible time value for JWT expiration.
 * Example: "15m", "7d", "1h"
 */
export function getExpires(name: string, fallback: StringValue): StringValue {
  const value = process.env[name] as StringValue | undefined;
  return value ?? fallback;
}
