import type { DrizzleD1 } from '../db/index';
import { sessions } from '../db/schema';
import { eq } from 'drizzle-orm';

const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export async function createSession(db: DrizzleD1): Promise<string> {
  const token = crypto.randomUUID();
  const expiresAt = Date.now() + SESSION_DURATION;
  await db.insert(sessions).values({ token, expiresAt }).run();
  return token;
}

export async function validateSession(db: DrizzleD1, token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const session = await db.select().from(sessions).where(eq(sessions.token, token)).get();
  if (!session || session.expiresAt < Date.now()) {
    if (session) await db.delete(sessions).where(eq(sessions.token, token)).run();
    return false;
  }
  return true;
}

export async function destroySession(db: DrizzleD1, token: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.token, token)).run();
}

export const SESSION_COOKIE_NAME = 'admin_session';

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: true,
    sameSite: 'strict' as const,
    path: '/',
    maxAge: SESSION_DURATION / 1000,
  };
}
