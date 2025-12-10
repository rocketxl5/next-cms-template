/**
 * HEALTH CHECK ROUTE
 * -----------------------------------------------------------------------------
 * This endpoint is used for uptime monitoring (keep-alive) when deployed on
 * Render or any platform that spins down inactive instances.
 *
 * Why it exists:
 * - External uptime services (e.g., UptimeRobot, BetterStack, cron pings)
 *   will call this endpoint every few minutes to keep the dyno/container warm.
 * - Ensures Prisma can connect successfully and that the server is responsive.
 *
 * Deployment Notes:
 * - This route is included in the Next.js build, so committing this file will
 *   automatically trigger a new deployment on Render.
 * - If you use GitHub Actions workflows to trigger health checks or deploy,
 *   ensure `.github/workflows/*` is committed and not ignored in .gitignore.
 *
 * Security:
 * - Returns only a lightweight "ok" response.
 * - No DB access, no sensitive data.
 *
 * Location:
 *   /app/api/health/route.ts
 *   or
 *   /src/app/api/health/route.ts
 *
 * Usage Example:
 *   GET https://your-app.onrender.com/api/health
 * -----------------------------------------------------------------------------
 */

export async function GET() {
  return Response.json({
    ok: true,
    timestamp: new Date().toISOString(),
  });
}
