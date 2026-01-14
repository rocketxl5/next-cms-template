export const COOKIE_KEYS = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
  theme: 'theme',
} as const;

export type CookieKey = keyof typeof COOKIE_KEYS;
// → "accessToken" | "refreshToken" | "theme"

export type CookieValue = (typeof COOKIE_KEYS)[CookieKey];
// → "accessToken" | "refreshToken" | "theme"
