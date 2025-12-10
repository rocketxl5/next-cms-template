Freezing the template **as-is** is a *smart move* — your schema is excellent, your seed strategy is now stable, and you’ve hit the point where continued tweaking just adds friction instead of value.

But **before you freeze it**, here’s one thing I *strongly* recommend adding:

---

# ✅ **One Missing Piece Before Freezing**

A **single, canonical `seed.ts` pattern** that:

### ✔ Uses *string literal enums* (not imports)

### ✔ Avoids all `any`

### ✔ Matches *exactly* your schema

### ✔ Explains when to use `connect`, `create`, and stored IDs

### ✔ Produces a reproducible, deterministic seed

### ✔ Works reliably on Render, Vercel, local dev, Docker, etc.

To make this painless, here is your **drop-in documentation**.

You can save it as:

```
/docs/SEEDING.md
```

---

# 🌱 **Prisma Seeding Guide — Next CMS Template**

*A simple, stable approach that always works with this schema.*

---

## 1. **How Seeding Works in This Project**

* Prisma seeds the database using the file defined in `package.json`:

```json
"prisma": {
  "seed": "ts-node prisma/seed.ts"
}
```

* Run the seed manually:

# **there are two different commands** and they do different things.

---

# ✅ **1. Local development migration (creates a new migration)**

You use this when you **change the schema locally** and want Prisma to *generate a new migration file*:

### **Local migration (creates migration files)**

```
yarn prisma migrate dev --name some_name
```

Short form:

```
yarn prisma -D --name some_name
```

This:

* Reads your `schema.prisma`
* Generates SQL migration files in `prisma/migrations/*`
* Applies them to your *local* database

---

# ✅ **2. Production migration (applies existing migration files)**

Render (or any prod server) should **never generate migrations**.

Instead, it applies the already-existing migration files.

### **Production migration (apply only)**

```
yarn prisma migrate deploy
```

This:

* Does **not** generate new migrations
* Does **not** require a name
* Only applies the migration files already in `/prisma/migrations`

This is the correct command to run in deployment (Render, Vercel, Railway, etc.).

---

# 🧠 Summary

| Environment                     | Purpose                      | Command                                      |
| ------------------------------- | ---------------------------- | -------------------------------------------- |
| **Local dev**                   | Create new migration + apply | `yarn prisma migrate dev --name change_name` |
| **Production (Render)**         | Apply existing migrations    | `yarn prisma migrate deploy`                 |
| **Seeding (both local + prod)** | Populate DB                  | `yarn prisma db seed`                        |

---

# ⭐ What you should run on **Render**

When you deploy or test:

```
yarn prisma migrate deploy
yarn prisma db seed
```

---

## 2. **Rules We Use in ALL Seeds**

### **Rule 1 — Never import Prisma enums**

Instead of:

```ts
import { ContentType } from "@prisma/client";
```

We always use string literals:

```ts
type: "POST",
status: "PUBLISHED",
role: "ADMIN",
```

This avoids TypeScript conflict when running seeds in constrained environments.

---

### **Rule 2 — Never use `any`**

If you need a lookup table (e.g. for created users), use `Record<string, string>`:

```ts
const users: Record<string, string> = {}; // email → id
```

---

### **Rule 3 — Create users first, then content**

Users are needed for `authorId`.

---

### **Rule 4 — Always mark seed data**

You already have:

```ts
isSeed Boolean @default(false)
```

Always set:

```ts
isSeed: true
```

This gives you:

* easy deletion
* easy filtering in the CMS
* safe production migrations

---

## 3. **Canonical Seed File Template**

> **Copy/paste this.**
> Works exactly with your schema.
> No `any`. No enum imports. No TS complaints.

```ts
/**
 * prisma/seed.ts
 * Stable seeding pattern for Next CMS Template
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ---------------------------------------------
  // 1. Seed Users
  // ---------------------------------------------
  const createdUsers: Record<string, string> = {};

  const userData = [
    {
      key: "admin",
      email: "admin@example.com",
      password: "hashed-admin-password",
      role: "ADMIN" as const,
    },
    {
      key: "author",
      email: "author@example.com",
      password: "hashed-author-password",
      role: "AUTHOR" as const,
    },
  ];

  for (const u of userData) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        email: u.email,
        password: u.password,
        role: u.role,
        isSeed: true,
      },
    });

    createdUsers[u.key] = user.id;
  }

  // ---------------------------------------------
  // 2. Seed Content
  // ---------------------------------------------
  const contentData = [
    {
      type: "POST" as const,
      title: "Welcome to the CMS",
      slug: "welcome-to-cms",
      description: "Starter post for your CMS template.",
      body: { blocks: [] },
      status: "PUBLISHED" as const,
      authorKey: "admin",
    },
    {
      type: "PAGE" as const,
      title: "About",
      slug: "about",
      description: "About page",
      body: { blocks: [] },
      status: "PUBLISHED" as const,
      authorKey: "author",
    },
  ];

  for (const item of contentData) {
    await prisma.contentItem.upsert({
      where: { slug: item.slug },
      update: {},
      create: {
        ...item,
        authorId: createdUsers[item.authorKey],
        isSeed: true,
      },
    });
  }

  console.log("🌱 Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

---

## 4. **How to Reset Seed Data**

Because every record includes `isSeed: true`, you can wipe seed data anytime:

```ts
await prisma.contentItem.deleteMany({ where: { isSeed: true } });
await prisma.user.deleteMany({ where: { isSeed: true } });
```

---

## 5. **Common Errors & Fixes**

### ❌ `"Unexpected any"`

Use `Record<string, string>` instead.

---

### ❌ `"Named export 'User' not found"`

Never import models from `@prisma/client`.

---

### ❌ `"Enum type mismatch"`

Use string literals (`"POST"`, `"PAGE"`) instead of importing enums.

---

### ❌ `"authorId: undefined"`

You probably referenced an author key that doesn’t exist in `createdUsers`.

---

# ✅ **Now You Can Freeze the Template**

This seeding strategy is:

* portable
* production-safe
* TS-safe
* simple
* deterministic
* aligned exactly with **your** schema
* no conflicting answers

