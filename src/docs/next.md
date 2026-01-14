# Next.js App Router – Runtime & Fetch Mental Model

This document captures the **core mental shift** required when coming from React (Vite / CRA) to **Next.js App Router**. It is written as a long‑term reference.

---

## 1. The Biggest Mental Shift

In React (Vite / CRA):

- `src/` = **client‑only**
- Everything inside `src`:
  - runs in the browser
  - has access to `window`
  - must be bundled
- The server lives elsewhere

In **Next.js App Router**, this assumption is **wrong**.

> **`src/` is NOT client‑only.**

It is simply a **project root**.

---

## 2. What Actually Decides Where Code Runs

In Next.js, **runtime is determined by usage, not location**.

### Runtime is decided by:

1. **File type** (e.g. `route.ts`, `page.tsx`)
2. **Directives** (`'use client'`)
3. **Who imports the file** (import graph)

> Location does NOT determine runtime.

---

## 3. Default Execution Rules

| File / Feature | Runtime |
|--------------|--------|
| `route.ts` | Server only |
| `page.tsx` | Server by default |
| `layout.tsx` | Server by default |
| `middleware.ts` | Edge runtime |
| `'use client'` | Forces client |
| `lib/*.ts` | Depends on importer |


### Important

- **Everything is server by default**
- Client code is **opt‑in**

---

## 4. The Import Graph Rule (Critical)

The same file can run in different environments depending on **who imports it**.

```ts
// lib/auth/tokens.ts
export function createAccessToken() {}
```

| Imported by | Runtime |
|-----------|--------|
| `route.ts` | Server |
| `middleware.ts` | Edge |
| Client component | ❌ Should not happen |

> **Imports decide runtime.**

---

## 5. Why This Feels Confusing at First

Your React intuition says:

> "This file is inside `src`, so it must be client code"

Next.js says:

> "This file runs wherever it’s imported"

This mismatch is the main source of confusion for React developers.

---

## 6. Understanding `'use client'`

```ts
'use client'

export default function Component() {}
```

This directive:
- forces the file to run in the browser
- allows hooks, state, effects
- disallows server‑only imports (Prisma, cookies, fs, etc.)

Without `'use client'`, the component is **server‑side**.

---

## 7. Shared Code Is a Feature (Not a Smell)

Next.js is designed so that **server and client live together**.

This enables:
- shared Zod validators
- shared types
- shared API contracts
- less duplication

Example:

```ts
lib/validators/user.ts
```

- Used by client forms
- Used by API routes
- Same rules, same errors

This is **intentional architecture**.

---

## 8. Understanding `apiFetch`

`apiFetch` is **not** a React hook.

### It is:
- a **transport abstraction**
- a centralized place for:
  - base URL
  - headers
  - credentials
  - error handling
  - refresh‑token retry logic

### It becomes client or server depending on who imports it.

```ts
// client component
await apiFetch('/api/me')  // browser

// server component
await apiFetch('/api/me')  // Node
```

Same function. Different runtime.

---

## 9. Axios vs Fetch

If you ever switch to Axios:

```ts
// lib/api/apiFetch.ts
import axios from 'axios'
```

This is the **only place** that changes.

All callers remain unchanged.

---

## 10. Recommended Mental Folder Map

Folders are not enforced by Next.js, but this mental grouping helps:

```
lib/
  auth/        ← server‑only by convention
  db/          ← server‑only (Prisma)
  api/         ← shared transport (apiFetch)
  validators/  ← shared schemas
  client/      ← client‑only helpers
```

This is about **discipline**, not framework rules.

---

## 11. Key One‑Line Rules to Remember

- Files do not decide runtime — **imports do**
- Everything is server unless marked `'use client'`
- `lib/` is shared infrastructure, not client code
- `apiFetch` is transport, not UI logic

---

## 12. Final Takeaway

> **In Next.js App Router, you don’t separate client and server by folders — you separate them by responsibility and imports.**

Once this clicks, App Router stops feeling magical and starts feeling clean.

---

**Keep this file. You will come back to it.**

