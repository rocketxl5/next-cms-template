# 🌗 Tailwind CSS v4 – Dark Mode & Theme Variants

This document explains **how dark mode works in Tailwind CSS v4**, why it behaves differently from v3, and the **recommended, future-proof way** to implement theme variants (dark/light, roles, brands, etc.) in a Next.js App Router project.

---

## 1. Key Change in Tailwind v4 (Very Important)

Tailwind CSS v4 **removed the built-in `darkMode` configuration behavior**.

In v3, Tailwind decided how dark mode worked:

* `darkMode: 'media'` → `@media (prefers-color-scheme: dark)`
* `darkMode: 'class'` → `.dark .dark:*`

In **v4**, Tailwind no longer owns this decision.

> **You define what “dark” means. Tailwind only provides the variant system.**

This is intentional and enables:

* SSR-safe theming
* Edge runtime compatibility
* Role-based and multi-theme variants

---

## 2. Why `darkMode` No Longer Works

If you set:

```ts
darkMode: 'class'
```

Tailwind v4 will **ignore it**.

If you do nothing, Tailwind may still generate:

```css
@media (prefers-color-scheme: dark) { ... }
```

Which causes:

* Dark styles applied even when `.dark` is NOT present
* Confusing behavior in DevTools
* Inconsistent SSR vs client rendering

This is exactly the issue you encountered.

---

## 3. Correct Way to Define Dark Mode in Tailwind v4

### ✅ Use `@custom-variant`

Define the `dark` variant **explicitly** in your global CSS:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

📍 **Where this goes**

* `src/app/globals.css` (or equivalent global CSS entry)
* Must be loaded before Tailwind utilities

---

## 4. What This Definition Means

```css
@custom-variant dark (&:where(.dark, .dark *));
```

This tells Tailwind:

* Apply `dark:*` utilities when:

  * The element is inside `.dark`, OR
  * The element itself has `.dark`

Equivalent mental model:

```css
.dark .dark\:bg-black { ... }
```

But safer, faster, and composable.

---

## 5. Tailwind Config (Minimal & Correct)

### ✅ `tailwind.config.ts`

```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
```

❌ Do NOT include:

* `darkMode`
* Media-based assumptions

---

## 6. Using Dark Mode in Components

Now this works exactly as expected:

```tsx
<main className="bg-white dark:bg-black">
  {children}
</main>
```

And only activates when:

```html
<html class="dark">
```

---

## 7. Why This Is Better Than Tailwind v3

### ✔ SSR-safe

* No `prefers-color-scheme` mismatch
* No hydration warnings

### ✔ Edge compatible

* No reliance on browser media queries

### ✔ Deterministic

* Dark mode only changes when **you** change it

### ✔ Extensible

You can define **any variant**, not just dark mode.

---

## 8. Beyond Dark Mode (Power Feature)

You can define **custom variants** the same way:

```css
@custom-variant admin (&:where(.admin, .admin *));
@custom-variant editor (&:where(.editor, .editor *));
```

Usage:

```tsx
<div className="bg-white admin:bg-red-500 editor:bg-blue-500" />
```

This pairs perfectly with:

* Role-based middleware
* Layout-level `<html className="admin">`

---

## 9. Recommended Next.js Integration Strategy

**Now (simple):**

* Toggle `.dark` on `<html>` manually

**Later (best practice):**

1. Store theme in cookie (`theme=dark|light`)
2. Read cookie in `middleware.ts`
3. Set `<html class="dark">` in `layout.tsx`
4. Zero client-side flicker

---

## 10. Summary

* Tailwind v4 does NOT manage dark mode
* `darkMode` config is obsolete
* Use `@custom-variant dark`
* `.dark` becomes your single source of truth
* This is intentional, modern, and more powerful

---

📌 **Takeaway:**

> Tailwind v4 gives you primitives — not opinions.
> Dark mode is now *your* responsibility — and that’s a good thing.
