# **Authentication Flow Documentation**

# **Authentication Flow**

This document explains **how authentication works internally**, from signing in to refreshing tokens and accessing protected routes.

The system follows an **HTTP-only JWT cookie + rotating refresh token** architecture:

* Short-lived **Access Token** (JWT)
* Long-lived **Refresh Token** (JWT)
* Secure, HttpOnly cookies for both
* Server-side verification for all protected routes
* Automatic re-issuance of new tokens without re-login

This approach works for both **SSR pages** (via middleware + cookies) and **API routes**.

---

# 1. **Sign In Flow**

### **Step-by-step**

1. **User submits email + password**
   `POST /api/auth/signin`

2. **System looks up user**

   * Uses Prisma to find user by email
   * Fails if not found

3. **Password is compared using bcrypt**

   * Stored password is hashed
   * If mismatch → 401 Unauthorized

4. **Access Token is created**

   * Contains: `id`, `email`, `role`
   * Short expiration (`15m` default)

5. **Refresh Token is created**

   * Contains **only**: `id`
   * Longer expiration (`7d` default)

6. **Refresh token is hashed and stored in DB**

   ```ts
   await prisma.user.update({
     where: { id: user.id },
     data: { refreshTokenHash: bcrypt.hash(token) }
   })
   ```

7. **Tokens are sent back as secure cookies**

   * `accessToken`
   * `refreshToken`

### **Result**

The user is authenticated and can:

* Access protected pages
* Call protected API endpoints

---

# 2. **Accessing Protected Resources**

Every protected route is checked by:

* **middleware.ts** (for pages)
* **requireRole** (for server components)
* `getUserFromCookies()` (for server utilities)
* Bearer token validation (optional for API calls)

### **How protection works**

1. System checks for `accessToken` cookie.
2. Verifies the JWT signature using `JWT_ACCESS_SECRET`.
3. If invalid or expired → user is redirected or receives a 401.
4. If valid → route runs normally.

### **Why access tokens are short-lived**

To reduce risk if a token is leaked.

---

# 3. **Access Token Expiration**

When an access token expires, the frontend does **not** log the user out.

Instead, the app uses the **refresh token** to get a new pair of tokens.

---

# 4. **Refresh Flow**

### **Triggered when:**

* Access token is missing
* OR access token is expired

### **Route**

`POST /api/auth/refresh`

### **Step-by-step**

1. Read `refreshToken` from the HttpOnly cookie.

2. Verify token signature (`JWT_REFRESH_SECRET`).

3. Decode payload → get user ID.

4. Fetch the user from DB:

   ```ts
   const user = await prisma.user.findUnique({
     where: { id },
     select: { id: true, refreshTokenHash: true }
   })
   ```

5. **Compare presented refresh token to stored hash**

   ```ts
   bcrypt.compare(refreshToken, user.refreshTokenHash)
   ```

6. If mismatch → token revoked → FORCE logout.

7. If valid → create a new:

   * access token
   * refresh token

8. **Store the *new* refresh token hash in DB**
   (old one invalidated immediately)

9. Send new tokens back as cookies.

### **Result**

The user continues browsing without logging in again.

---

# 5. **Logout / Sign Out Flow**

### **Route**

`POST /api/auth/signout`

### **What it does**

1. Deletes `accessToken` cookie
2. Deletes `refreshToken` cookie
3. Clears stored `refreshTokenHash` in DB

This **immediately invalidates all sessions** on that browser.

---

# 6. **Token Summary**

| Token Type        | Lifetime    | Stored In DB? | Purpose                                |
| ----------------- | ----------- | ------------- | -------------------------------------- |
| **Access Token**  | ~15 minutes | ❌ No          | Authenticated requests / role checking |
| **Refresh Token** | ~7 days     | ✔️ Hashed     | Reissue access tokens without re-login |

---

# 7. **Cookie Summary**

| Cookie         | Purpose                       | Properties                                     |
| -------------- | ----------------------------- | ---------------------------------------------- |
| `accessToken`  | Identifies logged-in user     | HttpOnly, Secure, SameSite=Strict, short-lived |
| `refreshToken` | Allows silent session renewal | HttpOnly, Secure, SameSite=Strict, long-lived  |

---

# 8. **Middleware Interaction**

Middleware uses the **access token** only.

### If access token is:

* **valid** → allow access
* **expired** → redirect to `/signin`
* **missing** → redirect to `/signin`
* **present but missing role** → block admin pages

Refresh tokens are **not** read in middleware
(because middleware runs on the Edge Runtime and must stay minimal + fast).

---

# 9. **Frontend Flow Diagram**

```
User → POST /signin → Valid? → Set Cookies → Redirect to /dashboard
      |      |
      |      └→ Invalid → 401
      ↓
Browse protected pages → accessToken valid? → Yes → continue
                                |
                                └→ No → POST /refresh → Valid? → Yes → reissue tokens
                                                              |
                                                              └→ No → logout
```

---

# 10. **Security Principles**

* HttpOnly cookies prevent JS access
* Refresh tokens are hashed in DB (like passwords)
* Rotating refresh tokens reduce replay attacks
* Access tokens contain minimal info (no password, no PII)
* Admin pages require correct role **and** valid access token

