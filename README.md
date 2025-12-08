# Next.js Auth Starter (Template)

Includes:

- Next.js App Router
- Prisma + PostgreSQL
- JWT auth (access + refresh)
- httpOnly cookies
- /signin, /signup, /refresh, /signout, /me routes

## Setup

```bash
yarn install
cp .env.example .env
yarn prisma migrate dev
yarn dev

Production-grade template structure** for **Next.js + Prisma + Auth + CMS + E-commerce hybrid** that you can **fork and reuse** for multiple projects.

Designed for:

* small → mid-size companies
* ecommerce first
* content + blog
* admin CMS
* scalable roles
* API ready

## ✅ 1. Final Recommended Folder Structure

```
/app
  (public)                 // visible public pages
    page.tsx               →  /
    shop/
      page.tsx             →  /shop
      [slug]/page.tsx       → /shop/product
    blog/
      page.tsx             →  /blog
      [slug]/page.tsx       → /blog/post

  (auth)                   // signin/signup
    signin/page.tsx        → /signin
    signup/page.tsx        → /signup

  (admin)                  // protected area
    dashboard/page.tsx      → /dashboard
    products/page.tsx        → /products
    posts/page.tsx           → /posts
    users/page.tsx           → /users
    settings/page.tsx        → /settings

  api
    auth/
      signin/route.ts
      signup/route.ts
      refresh/route.ts
      signout/route.ts
      me/route.ts

    products/route.ts        → public products api
    admin/products/route.ts  → admin only products
    posts/route.ts

/components
  /layout
    Navbar.tsx
    Footer.tsx
    Sidebar.tsx
    AdminNav.tsx

  /cards
    ProductCard.tsx
    ContentCard.tsx

  /forms
    SigninForm.tsx
    SignupForm.tsx
    ProductForm.tsx
    PostForm.tsx

  /ui
    Button.tsx
    Input.tsx
    Modal.tsx
    Table.tsx

/lib
  prisma.ts
  auth/
    tokens.ts
    cookies.ts
    requireAuth.ts
    requireRole.ts

  utils.ts

/prisma
  schema.prisma
  seed.ts
```

This is **exactly** how professional templates are organized.

---

## ✅ 2. Roles System (for CMS + E-commerce)

In your Prisma schema:

```prisma
model User {
  id               String   @id @default(cuid())
  name             String?
  email            String   @unique
  password         String
  role             Role     @default(USER)
  refreshTokenHash String?
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  posts            ContentItem[]
}

enum Role {
  USER
  AUTHOR
  EDITOR
  ADMIN
  SUPER_ADMIN
}
```

Purpose:

| Role        | Can do         |
| ----------- | -------------- |
| USER        | buy, comment   |
| AUTHOR      | write posts    |
| EDITOR      | manage content |
| ADMIN       | manage site    |
| SUPER_ADMIN | manage admins  |

Perfect for **company CMS + store**.

---

## ✅ 3. Core Content + Product Models

```prisma
model Product {
  id          String   @id @default(cuid())
  title       String
  description String
  price       Float
  images      String[]
  inStock     Boolean @default(true)
  createdAt   DateTime @default(now())
}

model ContentItem {
  id        String   @id @default(cuid())
  title     String
  slug      String   @unique
  body      String
  authorId  String
  author    User     @relation(fields: [authorId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

This supports:
✅ CMS
✅ Blog
✅ Marketing pages
✅ Product catalog

---

## ✅ 4. Protection for Admin Pages

In any admin page like:

`/app/(admin)/dashboard/page.tsx`

Use:

```ts
import { requireRole } from "@/lib/auth/requireRole"

export default async function AdminPage() {
  await requireRole(["ADMIN", "SUPER_ADMIN"])

  return <h1>Admin Dashboard</h1>
}
```

No client-side hacks. Real server security.

---

## ✅ 5. API Strategy

Example:

| Route                 | Use             |
| --------------------- | --------------- |
| `/api/products`       | public          |
| `/api/admin/products` | admin CRUD      |
| `/api/posts`          | blog            |
| `/api/me`             | current user    |
| `/api/auth/refresh`   | session renewal |
| `/api/auth/signout`   | logout          |

This is **exactly how SaaS + shops are built**.

---

## ✅ 6. Should you use same database for now?

**YES — totally fine**
Since only 1 project uses it in dev mode, no conflict.

Later, your fork will simply change `.env` and use a new DB.

---

## ✅ 7. Why this is PERFECT for your plan

You said:

> small to mid size companies, products, collections, blogs

This structure lets you build:

✅ online stores
✅ company websites
✅ blogs
✅ portfolios
✅ product launch sites
✅ SaaS dashboard
✅ photo collection sites
✅ headless CMS
✅ digital stores

Using **the same core template**.

That’s very smart thinking long-term.

---

## ✅ 8. Next step choice (pick ONE letter)

A — I generate your **Prisma schema v1 (final CMS + Ecommerce)**
B — I generate your **protected Admin layout (Sidebar + Layout)**
C — I generate your **Product & Blog page templates (SEO-ready)**
D — I generate your **roles + permission middleware system**

Reply with **A / B / C / D** and we’ll build the foundation of your reusable CMS template.
