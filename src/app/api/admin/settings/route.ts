/**
 * ADMIN SETTINGS API
 * -------------------------------------------------------
 * Purpose:
 *   Provides access to global application settings for
 *   admin users. These settings control site-wide behavior,
 *   display, and basic operational parameters.
 *
 * Common Settings Examples:
 *   - siteName       : Name of the website
 *   - contactEmail   : Admin contact email
 *   - theme          : Site theme (light/dark)
 *   - currency       : Default currency for e-commerce
 *   - itemsPerPage   : Pagination default
 *   - maintenance    : Boolean to toggle maintenance mode
 *   - allowRegistration : Boolean to allow public signup
 *
 * Route:
 *   GET /api/admin/settings
 *
 * Auth:
 *   - Requires valid access token
 *   - Role: ADMIN or SUPER_ADMIN
 *
 * Response:
 *   - JSON object with settings keys and values
 *
 * Implementation Notes:
 *   - Currently returns static placeholders
 *   - Can be extended later with database-backed settings table
 *   - POST / PUT endpoints can be added to update these settings
 *
 * Usage (Postman):
 *   GET http://localhost:3000/api/admin/settings
 *   Headers:
 *      Authorization: Bearer <access_token>
 *
 * Related Files:
 *   - /lib/auth/withRole.ts → withRole()
 * -------------------------------------------------------
 */

import { NextResponse } from 'next/server';
import { withRole } from '@/lib/server/withRole';
// -------------------------------------------------------
// GET — Fetch admin settings
// -------------------------------------------------------
export const GET = withRole(['ADMIN', 'SUPER_ADMIN'], async (req, user) => {
  // 2️⃣ Placeholder settings
  const settings = {
    siteName: 'CMS + E-commerce Template',
    contactEmail: 'admin@example.com',
    theme: 'light',
    currency: 'USD',
    itemsPerPage: 10,
    maintenance: false,
    allowRegistration: true,
    socialLinks: {
      facebook: 'https://facebook.com/example',
      twitter: 'https://twitter.com/example',
      linkedin: 'https://linkedin.com/company/example',
    },
  };

  // 3️⃣ Return JSON response
  return NextResponse.json(settings, { status: 200 });
});

// -------------------------------------------------------
// Note:
// Later, POST or PUT functions can be added to allow
// updating these settings via admin panel.
// -------------------------------------------------------
