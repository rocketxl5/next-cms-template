# Next CMS Template

Auth-first Next.js App Router template designed for CMS, SaaS dashboards, and e-commerce foundations.

Includes:

- Role-based access control (USER / ADMIN / SUPER_ADMIN / etc)
- Server-first session resolution (JWT access + refresh tokens)
- Persistent theme system (guest + auth users)
- CMS-ready architecture (blog, content, products)
- API-first design with public/protected separation
- Optimized folder structure for App Router


![Next.js](https://img.shields.io/badge/Next.js-13-blue?logo=next.js)
![Prisma](https://img.shields.io/badge/Prisma-4.13-blue?logo=prisma)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.3-blue?logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green)

A **production-ready Next.js App Router template** built for:

- authentication-heavy apps
- CMS + blog platforms
- e-commerce foundations
- admin dashboards
- role-based systems

Designed to be **forked, reused, and scaled** across multiple projects.


## ✨ Features

- Next.js App Router
- Prisma + PostgreSQL
- JWT authentication (access + refresh)
- HTTP-only cookies
- Server-first session resolution
- Role-based authorization
- Public / protected route groups
- Persistent theme system (guest + authenticated users)
- CMS + blog + shop–ready structure
- API-first architecture


## 🧱 Architecture Highlights

- Server is the source of truth
- No tokens stored in the client
- Layouts enforce access
- Explicit domain boundaries (auth / theme / routing)
- Optimistic UI with server reconciliation

This template favors **clarity and correctness over magic**.


## 📁 High-Level Structure

app/
  layout.tsx              → root layout (SSR theme + providers)
  providers.tsx

  (public)/               → unauthenticated area
    page.tsx
    auth/
      signin/
      signup/
    blog/
    shop/

  (protected)/            → authenticated area
    layout.tsx
    admin/
    user/

  api/
    auth/
    admin/


## 🔐 Authentication

- JWT-based authentication (access + refresh tokens)
- Tokens stored in **HTTP-only cookies**
- Session resolved server-side via `getSession`
- No client-side auth state duplication

Auth routes:

/api/auth/signin
/api/auth/signup
/api/auth/refresh
/api/auth/signout
/api/auth/me


## 👥 Roles & Authorization

Roles are enforced **server-side**, never in the client.

Example roles:

enum Role {
  USER
  AUTHOR
  EDITOR
  ADMIN
  SUPER_ADMIN
}


## 🎨 Theme System

- Supports `light`, `dark`, and `system`
- Works for guests and authenticated users
- Guest theme persisted via cookie
- Auth user theme persisted in database
- SSR-safe theme resolution in the root layout

Theme behavior:

- UI updates optimistically
- Persistence happens automatically
- Theme is synced after signin via `router.refresh()`

See `docs/theme.md` for full details.


## 🧪 API Strategy

Clear separation between public and protected APIs:

| Route            | Purpose         |
|------------------|-----------------|
| `/api/products`  | public data     |
| `/api/posts`     | blog content    |
| `/api/admin/*`   | admin CRUD      |
| `/api/auth/*`    | authentication  |
| `/api/auth/me`   | current user    |

APIs are role-aware and server-secured.


## 🗄️ Database migrations

- Use `yarn prisma migrate dev` during development
- Commit migrations to git
- Use `yarn prisma migrate deploy` in production
- Never run `migrate dev` in production

## 🛍 Placeholder Pages

This template includes sample placeholder pages for **Shop** and **Blog**:

- `/shop` → main shop listing page  
- `/shop/[slug]` → individual product pages  
- `/blog` → main blog listing page  
- `/blog/[slug]` → individual blog post pages  

These pages are **minimal placeholders**:

- They show simple messages explaining their purpose.  
- They use consistent Tailwind styling for readability.  
- They are intended to be **replaced with your own implementations** when building your project.  

💡 Tip: Keep these placeholders in the template to provide structure, but replace them with your own logic to fetch and display products, posts, or other content.



## 📚 Documentation

Detailed documentation lives in `/docs`:

- `api-auth.md` – authentication endpoints
- `auth-flow.md` – signin / refresh lifecycle
- `architecture.md` – design decisions
- `middleware.md` – access enforcement
- `theme.md` – theme system
- `password.md` – hashing strategy
- `seed.md` – database seeding
- `suspense.md` – async UI patterns
- `tailwind.md` – styling setup
- `next.md` – Next.js specifics

This README intentionally stays **high-level**.


## 🚀 Setup

yarn install
cp .env.example .env
yarn prisma migrate dev
yarn dev


## 🎯 Who This Is For

This template is ideal for building:

- company websites
- blogs & content platforms
- online stores
- admin dashboards
- SaaS back offices
- headless CMS projects

All from **one consistent foundation**.


## 🧭 Philosophy

This project favors:

- explicit over implicit
- server truth over client guesses
- composition over conditionals
- long-term maintainability over shortcuts

If something feels “verbose”, it’s probably intentional.
