Here is a **clean, complete, developer-friendly diagram** of **Next.js CMS Template** structure — including routes, roles, middleware flow, models, and how everything connects.

---

# 📐 **CMS Template Architecture Diagram**

## 1. 🏛 Project Structure Overview

```
src/
  app/
    (public)/
      page.tsx
      ...public pages
    (admin)/
      admin/
        page.tsx              <-- Protected admin dashboard
        settings/page.tsx     <-- Protected admin settings
    api/
      auth/
        signup/route.ts
        signin/route.ts
        refresh/route.ts
        signout/route.ts
      content/
        route.ts              <-- Protected CRUD endpoints
      products/
        route.ts              <-- Protected CRUD endpoints

  lib/
    auth/
      tokens.ts              <-- JWT helpers (create + verify)
      cookies.ts             <-- Cookie set/remove helpers
      requireRole.ts         <-- Protect server components / routes
      env.ts                 <-- Loads secrets + validation
    validation/...
    utils/...

  prisma/
    schema.prisma
    seed.ts
```

---

# 2. 🔐 **Authentication Flow Diagram**

```
(User enters email/password)
            |
            v
     POST /api/auth/signin
            |
     Verifies credentials
     Creates access + refresh tokens
     Saves refreshTokenHash in DB
            |
            v
   Sets httpOnly cookies:
   - accessToken
   - refreshToken
            |
            v
          Logged in
```

### Refresh flow

```
Browser sends refreshToken cookie
       |
       v
POST /api/auth/refresh
       |
Verify refresh JWT
Find user in DB
Compare stored hash with token
       |
Issue new:
 - accessToken
 - refreshToken
Rotate hash in DB
```

### Signout flow

```
POST /api/auth/signout
  |
  v
Clear both cookies
Rotate (invalidate) refreshTokenHash in DB
```

---

# 3. 🛡 **Middleware Protection Flow**

Your `middleware.ts` protects **all admin routes automatically**:

```
Request → /app/(admin)/...°
                 |
                 v
       middleware.ts checks:
       - Does accessToken exist?
       - Is it valid?
                 |
      +----------+----------+
      |                     |
Not logged in         Logged in
      |                     |
Redirect → /signin         Check role
                            |
                   +--------+--------+
                   |                 |
                 Not admin         ADMIN
                   |                 |
        Redirect → /unauthorized     Allow request
```

✔ Works on **server edges**
✔ Blocks unauthorized users BEFORE hitting the page
✔ Ensures `/app/(admin)` is 100% protected

---

# 4. 🧩 **Database Schema Diagram**

### Current Prisma schema structure

```
┌───────────────┐      ┌──────────────────┐
│     User       │ 1  n │   ContentItem     │
├───────────────┤      ├──────────────────┤
│ id             │◄────┤ authorId          │
│ email          │      │ title             │
│ password       │      │ content           │
│ role (enum)    │      │ type (ARTICLE...) │
│ refreshHash    │      │ createdAt         │
└───────────────┘      └──────────────────┘
```

If e-commerce enabled:

```
User 1 ─── n Product
Product n ─── n ContentItem (optional metadata)
```

---

# 5. 🎛 **Role System**

| Role        | Capabilities                        |
| ----------- | ----------------------------------- |
| PUBLIC      | View public pages                   |
| ADMIN       | Access `/admin`, manage content     |
| SUPER_ADMIN | Everything + manage users, settings |

### Enforced in 2 places:

* **middleware.ts** → protects all admin frontend routes
* **requireRole()** → protects server actions / backend API routes

---

# 6. 🗄 Content API Structure

```
GET    /api/content         → Public or protected depending on type
POST   /api/content         → ADMIN / SUPER_ADMIN
PUT    /api/content/:id     → ADMIN / SUPER_ADMIN
DELETE /api/content/:id     → SUPER_ADMIN only
```

Flexible enough for:

* blog posts
* products
* portfolio items
* pages
* announcements
* photo collections

---

# 7. 🚀 What This Template Is Good For

### ✔ CMS-first

For companies wanting a simple backend to manage:

* Pages
* Blog posts
* Collections
* Galleries
* Products (optional)

### ✔ E-commerce-ready

Optional `Product` model & admin tools.

### ✔ Scalable & secure

* JWT rotation system
* Refresh token hashing
* Middleware-based access control
* Clean auth helpers

### ✔ UI-agnostic

No UI included — letting you add **any** design later.

---

# 8. 🧭 What's Next (recommended steps)

If you want to keep improving the template:

1. **Add API documentation** (Swagger or markdown)
2. **Add soft deletes** (`isPublished`, `deletedAt`)
3. **Add image uploads** (Cloudinary or S3)
4. **Add admin hooks** (useAdminAuth)
5. **Add a basic CLI**: `pnpm seed`, `pnpm init:admin`

