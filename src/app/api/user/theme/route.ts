import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/server/getSession';
import {
  ThemeClassName,
  mapCssThemeToDatabase,
  mapDatabaseThemeToCss,
} from '@/lib/theme/mapTheme';
import { isThemeClassName } from '@/lib/utils/normalizers/theme';

export async function PATCH(req: NextRequest) {
  const session = await getSession();

  // Guest: nothing to do
  if (!session) {
    return NextResponse.json({ ok: true });
  }

  // Parse incoming theme
  const { theme } = (await req.json()) as { theme?: string };

  // Validate and normalize to ThemeClassName
  if (!isThemeClassName(theme)) {
    return NextResponse.json(
      { ok: false, error: 'Invalid theme' },
      { status: 400 }
    );
  }

  let updatedUser;

  try {
    updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { theme: mapCssThemeToDatabase(theme) },
    });
  } catch (error) {
    console.error('Failed to update user theme:', error);
    return NextResponse.json(
      { ok: false, error: 'Database update failed' },
      { status: 500 }
    );
  }

  const updatedTheme: ThemeClassName = mapDatabaseThemeToCss(updatedUser.theme);

  return NextResponse.json({ ok: true, theme: updatedTheme });
}
