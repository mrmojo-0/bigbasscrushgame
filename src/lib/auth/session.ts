import { randomBytes } from 'crypto';

const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const activeSessions = new Map<string, { expiresAt: number }>();

export function createSession(): string {
  const token = randomBytes(32).toString('hex');
  activeSessions.set(token, { expiresAt: Date.now() + SESSION_DURATION });
  return token;
}

export function validateSession(token: string | undefined): boolean {
  if (!token) return false;
  const session = activeSessions.get(token);
  if (!session || session.expiresAt < Date.now()) {
    activeSessions.delete(token);
    return false;
  }
  return true;
}

export function destroySession(token: string): void {
  activeSessions.delete(token);
}

export const SESSION_COOKIE_NAME = 'admin_session';

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: true,
    sameSite: 'strict' as const,
    path: '/',
    maxAge: SESSION_DURATION / 1000, // seconds
  };
}
