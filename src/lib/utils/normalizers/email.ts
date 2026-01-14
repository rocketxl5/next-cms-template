import { normalizeLowerCase } from "./string";

export function normalizeEmail(email: unknown): string {
    return normalizeLowerCase(email);
}