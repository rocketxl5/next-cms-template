# next-cms-template

![Next.js](https://img.shields.io/badge/Next.js-13-blue?logo=next.js)
![Prisma](https://img.shields.io/badge/Prisma-4.13-blue?logo=prisma)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.3-blue?logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green)

**Auth-first CMS / SaaS / E-commerce starter built on Next.js App Router**

`next-cms-template` is a production-grade starter designed for applications where **authentication, authorization, and data ownership are first-class concerns**.

It provides a clean, opinionated foundation for building CMSs, SaaS products, and e-commerce platforms without reinventing auth, access control, or App Router architecture.

---

## Why this template exists

Most starters treat authentication as an add-on.

This template treats authentication as **infrastructure**.

From the first request, the system assumes:

* Users may or may not be authenticated
* Sessions may expire
* Roles matter
* Server-side enforcement is mandatory
* UI state must be SSR-safe

The result is a codebase that scales **in complexity**, not just in features.

---

## Who this is for

This template is intended for developers who:

* Build **auth-heavy applications** (CMS, dashboards, internal tools)
* Care about **correct server/client boundaries**
* Want **predictable App Router structure**
* Prefer explicit architecture over magic

It is **not** a UI kit, page builder, or low-code solution.

---

## Core features (v1.0.0)

### Authentication

* JWT access + refresh token strategy
* httpOnly cookies
* Refresh token rotation
* Automatic session refresh
* Server-side session validation

### Authorization

* Role-based access control (RBAC)
* Server-enforced authorization
* Role guards for pages, layouts, and APIs

### Routing

* App Router with explicit route groups
* Public / auth / protected separation
* Auth-aware layouts
* SSR-safe redirects

### Theme system

* Light / dark / system themes
* Works for guests and authenticated users
* SSR-safe (no hydration mismatch)
* Persisted per user

### Data layer

* Prisma ORM
* PostgreSQL
* Clean schema organization
* Safe client lifecycle

---

## High-level architecture

```
app/
├─ (public)/        # Public pages (no auth required)
├─ (auth)/          # Sign-in / sign-up / auth flows
├─ (protected)/     # Authenticated application
├─ api/             # Route handlers
├─ layout.tsx       # Root layout
```

### Design principles

* **Auth is never optional** — it is handled before rendering
* **Security lives on the server** — never in components
* **Layouts enforce access** — pages assume valid context
* **Clients consume state** — they do not define it

---

## Authentication model

* Access tokens are short-lived
* Refresh tokens are long-lived and rotated
* Tokens are stored in httpOnly cookies
* Session validation happens on the server

There is no reliance on client-side storage for security decisions.

---

## Authorization model

Roles are enforced:

* In route handlers
* In layouts
* Before protected pages render

Client components may reflect permissions, but **never enforce them**.

---

## Getting started

### Prerequisites

* Node.js 18+
* PostgreSQL
* pnpm / yarn / npm

### Installation

```bash
git clone https://github.com/your-org/next-cms-template.git
cd next-cms-template
npm install
```

### Environment variables

Create a `.env` file based on `.env.example`:

```
DATABASE_URL=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
```

### Database

```bash
npx prisma migrate dev
npx prisma generate
```

### Development

```bash
npm run dev
```

---

## What is intentionally not included

v1.0.0 is deliberately focused.

Not included:

* CMS UI / page builders
* Payments or subscriptions
* Multitenancy
* Audit logs
* Plugin systems

These are left to higher versions or downstream projects.

---

## Versioning policy

This project follows semantic versioning:

* **v1.x** — additive, non-breaking improvements
* **v2.0** — architectural or breaking changes

Public APIs (auth primitives, route structure, theme system) are considered stable within v1.

---

## Documentation

Extensive internal documentation is available in `/docs`, covering:

* Authentication flow
* Route protection
* Theme system
* Prisma usage
* Architectural decisions

---

## License

MIT

---

## Philosophy

This template optimizes for:

* Correctness over convenience
* Explicitness over magic
* Long-term maintainability

If those values align with your project, this template is a solid foundation.
