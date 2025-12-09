# Authentication API — Specification & Flow

**Location:** `src/app/api/auth/*`
**Auth Model:** Email + Password + JWT (Access + Refresh)
**Storage:** Prisma + PostgreSQL
**Token Transport:** HTTP-only Cookies
**Token Lifetimes:**

* **Access Token:** short-lived (e.g., 15 min)
* **Refresh Token:** long-lived (e.g., 7 days / 30 days)
* **Rotation:** Enabled (refresh token hash stored in DB)

---

# 1. Endpoints Overview

| Route               | Method | Purpose                                     | Protected          |
| ------------------- | ------ | ------------------------------------------- | ------------------ |
| `/api/auth/signup`  | POST   | Create user account                         | ❌                  |
| `/api/auth/signin`  | POST   | Login and receive tokens                    | ❌                  |
| `/api/auth/refresh` | POST   | Refresh access token using refresh token    | ❌                  |
| `/api/auth/logout`  | POST   | Invalidate refresh token + clear cookies    | ❌                  |
| `/api/auth/me`      | GET    | Return current user’s decoded token payload | **✔ Access token** |

---

# 2. /api/auth/signup

### **POST → Create an account**

### Payload

```json
{
  "name": "Max",
  "email": "test@example.com",
  "password": "secret123"
}
```

### Response

```json
{
  "user": {
    "id": "cuid123",
    "email": "test@example.com",
    "name": "Max",
    "role": "USER"
  }
}
```

### Notes

* Passwords are hashed using bcrypt.
* User role defaults to `"USER"` unless explicitly seeded.
* No tokens are issued yet (signup ≠ signin).

---

# 3. /api/auth/signin

### **POST → Authenticate user and return tokens**

### Payload

```json
{
  "email": "test@example.com",
  "password": "secret123"
}
```

### Internal flow

1. Validate email/password.
2. Compare bcrypt hash.
3. Generate:

   * **Access Token** (JWT)
   * **Refresh Token** (JWT)
4. Hash refresh token → store in DB (`refreshTokenHash`).
5. Set secure HTTP-only cookies:

   * `access_token`
   * `refresh_token`
6. Return user info (optional).

### Response

```json
{
  "user": {
    "id": "cuid123",
    "email": "test@example.com",
    "role": "USER"
  }
}
```

---

# 4. /api/auth/refresh

### **POST → Issue new tokens when access token is expired**

This endpoint consumes the `refresh_token` cookie.

### Internal flow

1. Read refresh token from cookie.
2. Validate JWT signature & expiry.
3. Lookup user in DB.
4. Compare refresh token hash.
5. Rotate:

   * create new access token
   * create new refresh token
   * update DB with new hash
6. Update both cookies.

### Response

```json
{
  "accessToken": "new.jwt.token"
}
```

### Failure scenarios

| Case                   | Result |
| ---------------------- | ------ |
| Refresh token missing  | 401    |
| JWT invalid or expired | 401    |
| Token hash mismatch    | 401    |
| User not found         | 404    |

---

# 5. /api/auth/logout

### **POST → Invalidate session**

### Steps

1. Clear cookies:

   * `access_token`
   * `refresh_token`
2. Remove user's `refreshTokenHash` in DB (optional but recommended).
3. Respond with status OK.

### Response

```json
{
  "success": true
}
```

---

# 6. /api/auth/me

### **GET → Return current user session info**

Uses access token.

### Response

```json
{
  "user": {
    "id": "cuid123",
    "email": "test@example.com",
    "role": "USER"
  }
}
```

If token missing/invalid → return 401.

---

# 7. Token Model

### Access Token (short-lived)

Payload may contain:

```json
{
  "id": "cuid123",
  "email": "test@example.com",
  "role": "ADMIN",
  "exp": 1717690000
}
```

### Refresh Token (long-lived)

Payload usually contains:

```json
{
  "id": "cuid123",
  "tokenVersion": 1,
  "exp": 1719690000
}
```

---

# 8. Cookie Configuration

| Cookie          | Purpose          | HttpOnly | Secure | Path                       | Expires    |
| --------------- | ---------------- | -------- | ------ | -------------------------- | ---------- |
| `access_token`  | short-lived auth | ✔        | ✔      | `/`                        | minutes    |
| `refresh_token` | session renewal  | ✔        | ✔      | `/api/auth/refresh` or `/` | days/weeks |

All cookies must be:

```ts
httpOnly: true,
secure: process.env.NODE_ENV === "production",
sameSite: "strict"
```

---

# 9. Error Handling

Common error responses:

```json
{
  "error": "Invalid credentials"
}
```

```json
{
  "error": "Unauthorized"
}
```

```json
{
  "error": "Token expired"
}
```

---

# 10. Security Notes

### ✔ Protected Admin Routes

Middleware enforces:

```ts
role === "ADMIN" || role === "SUPER_ADMIN"
```

### ✔ DB-stored hashed refresh token

Prevents token theft.

### ✔ Token rotation

New refresh token on every refresh.

### ✔ No tokens returned in JSON except when requested

Most flows rely on cookies only.

### ✔ No DB access in middleware

All token checks must be local.

---

# 11. Related Files

| Purpose                      | File                       |
| ---------------------------- | -------------------------- |
| Token signing & verification | `src/lib/auth/tokens.ts`   |
| Cookie utilities             | `src/lib/auth/cookies.ts`  |
| Role helpers                 | `src/lib/auth/role.ts`     |
| Password hashing             | `src/lib/auth/password.ts` |
| Auth middleware              | `middleware.ts`            |

---

If you'd like, I can also generate:

✅ `auth-flow.md` (full step-by-step system-level flow)
✅ `tokens.md` (details for access & refresh token structures)
✅ `roles.md` (role hierarchy + capabilities)
✅ `users.md` (schema explanation + user model docs)

Just tell me **which document next**.
