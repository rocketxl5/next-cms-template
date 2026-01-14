/**
 * assertRequired
 *
 * Runtime + TypeScript type guard function to ensure that specific fields
 * exist on an object. This is particularly useful when working with
 * partially known objects (like parsed JSON) that need validation
 * before use in type-safe code.
 *
 * Key features:
 * 1️⃣ Checks that each specified key exists and is not `null` or `undefined`
 * 2️⃣ Throws a runtime error if any required field is missing
 * 3️⃣ Uses TypeScript `asserts` to narrow the type from `Partial<T>` → `T`
 *    so downstream code knows the required fields definitely exist
 *
 * Usage example:
 *
 * interface SignupPayload {
 *   email: string;
 *   name: string;
 *   password: string;
 * }
 *
 * const payload: Partial<SignupPayload> = {
 *   email: "max@example.com",
 *   name: "Max",
 * };
 *
 * // Ensure required fields are present at runtime
 * assertRequired(payload, ["email", "name"]);
 *
 * // After assertion, TypeScript now knows payload.email and payload.name exist:
 * const email: string = payload.email;
 * const name: string = payload.name;
 *
 * If a required key is missing, an Error is thrown:
 * Missing required field: <key>
 *
 * Benefits:
 * - Safe type narrowing for TypeScript
 * - Prevents runtime errors from undefined values
 * - Works well with normalized objects from APIs or forms
 *
 * @template T - The full expected object type
 * @param value - Partial object to check
 * @param keys - Array of keys required to exist in `value`
 * @throws {Error} - If any of the required keys are missing or null/undefined
 */

export function assertRequired<T extends Record<string, unknown>>(
  value: Partial<T>,        // Object that may have missing fields
  keys: (keyof T)[]         // Keys that must exist on the object
): asserts value is T {      // TypeScript assertion: after this, value is guaranteed T
  // Iterate through each required key
  for (const key of keys) {
    // If the key is missing or null/undefined, throw an error
    if (value[key] == null) {
      throw new Error(`Missing required field: ${String(key)}`);
    }
  }
}
