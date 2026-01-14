# # 📚 API Documentation

This document describes all backend API endpoints available in the Next CMS Template, including authentication, token lifecycle, user roles, content management, and product management.

---

# ## 🔐 Authentication API

All auth routes are located under:

```
POST /api/auth/*
```

---

# ### **POST /api/auth/signup**

Creates a new account.

#### **Request Body**

```json
{
  "email": "admin@example.com",
  "password": "StrongPassword123",
  "name": "Admin User"
}
```

#### **Response**

* Creates user
* Creates refreshTokenHash in DB
* Returns success message
* Sets the following cookies:

  * `accessToken` (15 minutes)
  * `refreshToken` (7 days)

```json
{
  "message": "Account created",
  "user": {
    "id": "cuid123",
    "email": "admin@example.com"
  }
}
```

---

# ### **POST /api/auth/signin**

Authenticates a user with email + password.

#### **Request Body**

```json
{
  "email": "admin@example.com",
  "password": "StrongPassword123"
}
```

#### **Response**

Automatically sets cookies:

* `accessToken`
* `refreshToken`

```json
{
  "message": "Signed in",
  "user": {
    "id": "cuid123",
    "role": "ADMIN"
  }
}
```

---

# ### **POST /api/auth/refresh**

Issues new access + refresh tokens.

This endpoint:

* Reads `refreshToken` cookie
* Verifies refresh JWT
* Compares with stored hash
* Rotates refresh token
* Sets new cookies

#### **Response**

```json
{
  "message": "Tokens refreshed"
}
```

---

# ### **POST /api/auth/signout**

Logs the user out securely.

This endpoint:

* Clears both cookies
* Rotates refreshTokenHash in DB

#### **Response**

```json
{
  "message": "Signed out"
}
```

---

---

# ## 👤 User API (Protected)

### Middleware Required

All user/admin routes require:

* Valid accessToken (JWT)
* Sometimes specific roles

---

# ### **GET /api/users/me**

Returns the authenticated user's profile.

#### **Response**

```json
{
  "id": "cuid123",
  "email": "admin@example.com",
  "role": "ADMIN"
}
```

---

# ### **GET /api/users**

Requires: `ADMIN` or `SUPER_ADMIN`

Returns all users in the database.

#### **Response**

```json
[
  {
    "id": "u1",
    "email": "admin@example.com",
    "role": "ADMIN"
  }
]
```

---

# ### **POST /api/users**

Requires: `SUPER_ADMIN`

Creates new staff/admin users.

---

---

# ## 📝 Content API

Content items can represent:

* Blog posts
* Pages
* Collection items
* Announcements
* Articles
* Photos
* Etc.

Schema example:

```ts
model ContentItem {
  id        String   @id @default(cuid())
  title     String
  content   String
  type      ContentType
  authorId  String
  author    User     @relation(fields: [authorId], references: [id])
  createdAt DateTime @default(now())
}
```

---

# ### **GET /api/content**

Returns a list of content items.
This route can be **public** or **protected**, depending on your design.

#### Response

```json
[
  {
    "id": "post1",
    "title": "Hello World",
    "type": "ARTICLE"
  }
]
```

---

# ### **POST /api/content**

Requires: `ADMIN` or `SUPER_ADMIN`

Creates a content item.

#### Request Body

```json
{
  "title": "My Post",
  "content": "...",
  "type": "ARTICLE"
}
```

---

# ### **PUT /api/content/:id**

Requires: `ADMIN` or `SUPER_ADMIN`

Updates content by ID.

---

# ### **DELETE /api/content/:id**

Requires: `SUPER_ADMIN`

Deletes a content item.

---

---

# ## 🛒 Product API (optional)

Used if you want E-commerce support.

Same role rules as content:

* `ADMIN` → CRUD
* `SUPER_ADMIN` → can delete

---

# ### **GET /api/products**

Returns list of products.

---

# ### **POST /api/products**

Requires `ADMIN` or `SUPER_ADMIN`

Creates a product.

---

# ### **PUT /api/products/:id**

Updates a product.

---

# ### **DELETE /api/products/:id**

Requires `SUPER_ADMIN`

---

---

# ## 🔐 Authorization Overview

### Authentication is enforced in **two layers**:

---

## 1. **Middleware Layer (frontend protection)**

Located at:

```
/src/middleware.ts
```

Protects:

```
/app/(admin)/**
```

Checks:

* Is accessToken present?
* Is token valid?
* Does user have ADMIN / SUPER_ADMIN role?

If not → redirects.

---

## 2. **requireRole() (backend API protection)**

Used in:

```
/api/content
/api/products
/api/users
```

Example:

```ts
await requireRole(["ADMIN", "SUPER_ADMIN"]);
```

---

# ## 🧪 Testing (Postman)

### Required to test:

* Signin
* Copy cookies from browser or Postman cookie jar
* Hit protected routes

### Token rotation test:

1. Sign in
2. Wait 15 minutes (or reduce expiry for testing)
3. Call `/api/auth/refresh`
4. Use the new access token

---

# ## 🧾 HTTP Status Codes

| Code    | Meaning               |
| ------- | --------------------- |
| **200** | OK                    |
| **201** | Created               |
| **400** | Invalid input         |
| **401** | Not authenticated     |
| **403** | Missing required role |
| **404** | Not found             |
| **500** | Server error          |

---

# ## 🧩 TODO / Extensible Areas

Suggested extensions:

* Image uploads (Cloudinary / S3)
* Categories & tags
* Draft / published states
* Search API
* Audit logs
* Webhooks
* Admin UI (React dashboard)
