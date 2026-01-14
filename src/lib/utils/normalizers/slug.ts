import { normalizeLowerCase } from "./string";

export function normalizeSlug(value: unknown): string {
  return normalizeLowerCase(value).replace(/\s+/g, '-');
}
