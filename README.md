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
