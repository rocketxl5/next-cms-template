# Next.js Middleware — Authentication & Authorization Layer

**Location:** `src/middleware.ts`
**Runtime:** Edge
**Purpose:** Global request validation for protected routes (Admin-only, Auth-required, Public).

---

## **1. Overview**

This middleware runs **before every request** hitting your Next.js application.
It enforces:

1. **Authentication** — verifies a valid JWT access token from cookies.
2. **Authorization** — checks the user’s role for admin-only routes.
3. **Routing Protection** — redirects users to `/auth/signin` when needed.
4. **Security** — prevents non-admins from accessing admin pages.

It is your app’s **gatekeeper**.

---

## **2. What the Middleware Does (Step-by-Step)**

### **Step 1 — Parse the incoming request**

* Extract the pathname from `request.nextUrl.pathname`.

### **Step 2 — Determine the requested zone**

The middleware categorizes each request into one of three groups:

| Zone                | Example Routes                              | Authentication?                              | Authorization?          |
| ------------------- | ------------------------------------------- | -------------------------------------------- | ----------------------- |
| **Public**          | `/`, `/about`, `/blog`                      | No                                           | No                      |
| **Auth Pages**      | `/auth/signin`, `/auth/signup`              | Should not be visited when already logged in | No                      |
| **Admin Protected** | `/admin`, `/admin/users`, `/admin/settings` | **Yes**                                      | **ADMIN / SUPER_ADMIN** |

This determination is done using simple prefix checks:

```ts
const path = request.nextUrl.pathname;
const isAuthPage = path.startsWith("/auth");
const isAdminPage = path.startsWith("/admin");
```

---

### **Step 3 — Read & Validate the JWT**

The middleware reads the `access_token` cookie:

```ts
const token = request.cookies.get("access_token")?.value;
```

It validates the token using your existing helper:

```ts
const payload = await verifyAccessToken(token);
```

If the token is invalid, expired, or missing:

* Public pages → allowed
* Auth pages → allowed
* Admin pages → **redirect to `/auth/signin`**

---

### **Step 4 — Prevent logged-in users from accessing `/auth` pages**

If the user is authenticated already, optionally redirect them away:

```
/auth/signin  → redirect to /dashboard
```

---

### **Step 5 — Enforce Admin Role**

If the request is an admin route:

```ts
if (payload.role !== "ADMIN" && payload.role !== "SUPER_ADMIN") {
    return redirectToSignin(request);
}
```

Your Prisma schema uses uppercase roles, so the middleware also uses uppercase.

---

### **Step 6 — Allow or Redirect**

If all checks pass → `NextResponse.next()`
Otherwise → redirect via:

```ts
return NextResponse.redirect(new URL("/auth/signin", request.url));
```

---

## **3. Folder / File Placement**

### ✔ Recommended

Place middleware at the **project root**, outside `/src`:

```
/middleware.ts
/src
  /app
  /lib
  /components
```

### Why not inside `/src`?

Because **Next.js requires it at project root** so it can intercept all routes.
It *can* live inside `/src` but only if you configure a custom root — not worth the overhead.

---

## **4. What Is Not the Middleware’s Job**

* Refresh tokens
* Database lookups
* Logging in / signing up
* UI redirection logic
* Fetching user data
* Server actions validation

Those belong to `/lib/auth` and your API routes.

Middleware’s job is **purely gatekeeping**.

---

## **5. Notes on Performance**

* Middleware runs on the Edge, meaning extremely fast.
* Avoid heavy work (no DB queries).
* Token verification is fine — it’s synchronous & cheap.

---

## **6. Related Files**

| Purpose                     | File                        |
| --------------------------- | --------------------------- |
| Token creation & validation | `src/lib/auth/tokens.ts`    |
| Reading/writing cookies     | `src/lib/auth/cookies.ts`   |
| Role enforcement helpers    | `src/lib/auth/role.ts`      |
| API route authentication    | `src/app/api/...`           |
| Auth pages                  | `src/app/(public)/auth/...` |
| Admin pages                 | `src/app/(admin)/...`       |
