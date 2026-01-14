# 🎨 Theme System (Dark / Light)

This document describes the **final, correct, Tailwind v4–compatible theme architecture** used in this project.

It explains **what exists**, **why it exists**, and **how the pieces work together**, so future changes do not require rediscovering these concepts.

---

## 🧠 High-level goals

* Support **light / dark mode**
* Work with **Next.js App Router**
* Be **SSR-safe** and **Edge-safe**
* Avoid duplicating styles across layouts
* Use **CSS variables** as the source of truth
* Let Tailwind consume variables, not define theme logic

---

## 🧩 Mental model (important)

> **CSS variables define values**
> **Base styles consume values**
> **Tailwind utilities decorate components**

If variables are not consumed somewhere (usually in `@layer base`), **nothing will visually change**, even if the variables update correctly.

---

## 📁 File locations

```
src/
  app/
    layout.tsx          # Root layout (server)
    providers.tsx       # Client-side providers
    globals.css         # Tailwind + theme variables

components/
  providers/
    ThemeProvider.tsx   # Theme context + toggle logic
    theme.ts            # Theme type

docs/
  theme.md              # This file
```

---

## 🎯 Theme source of truth (CSS variables)

**globals.css**

```css
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));

/* Light theme (default) */
:root {
  --color-bg: #FAFAFA;
  --color-fg: #0A0A0A;
  --color-border: #D4D4D4;
}

/* Dark theme */
.dark {
  --color-bg: #0A0A0A;
  --color-fg: #FAFAFA;
  --color-border: #262626;
}
```

### Why this matters

* Variables live at the **document level**
* `.dark` switches values instantly
* No Tailwind rebuild required
* Works with SSR + hydration

---

## ✅ The missing piece: consuming variables

Variables alone do nothing.

They **must be applied to real CSS properties**.

```css
@layer base {
  body {
    background-color: var(--color-bg);
    color: var(--color-fg);
  }
}
```

### This is why it finally worked

* `body` always exists
* All layouts inherit from it
* Theme changes propagate automatically

---

## 🧪 Why `bg-bg` / `text-fg` failed

Even though Tailwind was configured like this:

```ts
extend: {
  colors: {
    bg: 'var(--color-bg)',
    fg: 'var(--color-fg)',
  }
}
```

Tailwind v4 **does not reliably emit variable-based utilities**.

So:

* `dark:bg-black` ✅ works (hard-coded color)
* `bg-bg` ❌ unreliable

**Conclusion:**

> Use variables in `@layer base` for core theming
> Use Tailwind utilities for component-level decoration

---

## 🌗 ThemeProvider (client-side)

**ThemeProvider.tsx**

```tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { Theme } from './theme';

const ThemeContext = createContext<{
  theme: Theme;
  toggleTheme: () => void;
} | null>(null);

export function ThemeProvider({
  initialTheme,
  children,
}: {
  initialTheme: Theme;
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<Theme>(initialTheme);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);

    document.cookie = `theme=${theme}; path=/; max-age=31536000`;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
```

---

## 🧬 Root layout wiring (server → client bridge)

**app/layout.tsx**

```tsx
import { cookies } from 'next/headers';
import { ThemeProvider } from '@/components/providers/ThemeProvider';

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const theme = cookieStore.get('theme')?.value === 'dark' ? 'dark' : 'light';

  return (
    <html lang="en">
      <body>
        <ThemeProvider initialTheme={theme}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### Why this works

* Cookies read **on the server**
* Theme class applied **before hydration**
* No flash of incorrect theme

---

## 🧱 Layout inheritance

* Root layout applies theme once
* Public / auth / admin layouts **do not re-define theme**
* All child components inherit automatically

This keeps layouts clean and predictable.

---

## 🏁 Final rules (memorize these)

1. **CSS variables define themes**
2. **`@layer base` applies them**
3. **ThemeProvider toggles `.dark`**
4. **Layouts never manage colors directly**
5. **Tailwind utilities decorate, not theme**

---

## ✅ Status

✔ Theme system is sealed
✔ SSR-safe
✔ Edge-safe
✔ Tailwind v4–correct
✔ Ready for admin + CMS UI

This file should not need major changes unless Tailwind or Next.js changes fundamentally.
