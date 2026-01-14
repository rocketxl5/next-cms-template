app/

  (protected)/            → authenticated area 
    layout.tsx            ← auth enforcement
    admin/                → admin
      page.tsx            
      layout.tsx          ← role enforcement (ADMIN+)
    user/                
      page.tsx
      layout.tsx          ← authenticated users (user, author, editor, etc)

  (public)/               → unauthenticated area
    layout.tsx
    page.tsx 
    auth/               
      signin/
        page.tsx          ← Suspense boundary
        SigninSkeleton.tsx      
      signup/
        page.tsx
        schema.ts
        SignupSkeleton.tsx
    blog/
      page.tsx
      [slug]/
        page.tsx
    shop/
      page.tsx
      [slug]/
        page.tsx

  api/
    admin/
      posts/
        route.ts
      products/
        route.ts
      settings/
        route.ts
      users/
        route.ts
        
    auth/
      me/
        route.ts
      refresh/
        route.ts
      signin/
        route.ts
      signout/
        route.ts
      signup/
        route.ts
      user/
        theme/
          route.ts
      health/
        route.ts

components/
  layout/
    Footer.tsx
    Header.tsx
    AccountLayout.tsx
  providers/
    ThemeProvider.tsx
  hoc/
    withSuspense.tsx
  auth/
    SigninForm.tsx
    SignupForm.tsx
  ui/
    button/
      SignoutBtn.tsx
      ToggleThemeBtn.tsx

hooks/
  useDashboard.tsx
  useProtectedQuery.tsx

lib/
  env.ts
  http.ts
  prisma.ts

  api/
    apiFetch.ts
    axios.ts
    index.ts
    interceptors.ts

  auth/
    auth-cookies.ts
    config.ts
    tokens.ts                 ← JWT create/verify

  server/
    enforceRole.ts
    getCookie.ts              ← Cookie helpers
    getRedirectPathname.ts    ← Client-side redirect resolution
    getSession.ts
    redirects.ts              ← Server-side redirects (middleware)
    requireAuth.ts
    requireRole.ts            ← Server-only guards
    signOut.ts
    withRole.ts
  
  theme/
    getTheme.ts
    mapTheme.ts
    resolveNextTheme.ts

  utils/
    normalizers/
      asserRequired/
        asserRequired.ts
      email.ts
      index.ts
      object.ts
      slug.ts
      string.ts
      theme.ts

  validators/ 
    common.ts
    index.ts
    auth/
      signin.ts
      signup.ts
    
    users/
      admin.ts

types/
  contexts.ts
  cookies.ts
  dashboard.ts
  users.ts

docs/ 
  api-auth.md
  api.md
  architecture.md
  auth-flow.md
  middleware.md
  next.md
  password.md
  seed.md
  suspense.md
  tailwind.md
  theme.md