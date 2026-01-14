# Suspense Ownership — Visual Guide

This diagram complements the architectural notes by showing **where responsibilities live** in a Next.js App Router app.

---

## High‑level flow

```
Request
  │
  ▼
page.tsx  (Route boundary)
  │  • structure only
  │  • no hooks
  │  • no Suspense HOCs
  ▼
Client Component (e.g. SigninForm)
  │  • owns behavior
  │  • uses hooks
  │  • opts into Suspense
  ▼
<Suspense>
  │
  ├─ fallback → Skeleton UI
  │
  └─ Component resolves → Real UI
```

---

## Folder responsibility map

```
app/
└─ (public)/
   └─ auth/
      └─ signin/
         ├─ page.tsx          ← Route shell (server by default)
         ├─ SigninForm.tsx    ← Client behavior + Suspense owner
         └─ SigninSkeleton.tsx← Loading UI (dumb, visual)
```

---

## What owns what

| File                 | Owns                           | Does NOT own         |
| -------------------- | ------------------------------ | -------------------- |
| `page.tsx`           | Route structure                | Loading, data, hooks |
| `SigninForm.tsx`     | Behavior, redirects, API calls | Layout concerns      |
| `SigninSkeleton.tsx` | Visual placeholder             | Logic, state         |
| `withSuspense`       | Loading boundary               | Routing              |

---

## Correct Suspense placement

```
// GOOD
SigninForm
 └─ <Suspense fallback={SigninSkeleton}>
     └─ Form logic
```

```
// BAD
page.tsx
 └─ <Suspense>
     └─ Entire route
```

---

## Mental shortcut

> **Pages compose. Components behave.**

If a file answers:

* *“Where am I?”* → page
* *“How do I work?”* → component
* *“What do I show while loading?”* → skeleton

---

## Why this matters

Following this boundary:

* avoids prerender errors
* avoids hydration mismatches
* keeps routing server‑safe
* makes components portable

This pattern scales cleanly from auth forms to admin dashboards and beyond.
