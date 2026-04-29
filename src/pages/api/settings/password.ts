import type { APIRoute } from 'astro';
import { getDb } from '../../../lib/db/index';
import { settings } from '../../../lib/db/schema';
import { eq } from 'drizzle-orm';
import { compare, hash } from 'bcryptjs';
import { validateSession, SESSION_COOKIE_NAME } from '../../../lib/auth/session';

export const prerender = false;

export const PUT: APIRoute = async ({ request, cookies, locals }) => {
  try {
    const db = getDb(locals.runtime.env.DB);
    const token = cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!await validateSession(db, token)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const body = await request.json() as { currentPassword: string; newPassword: string };
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return new Response(JSON.stringify({ error: 'currentPassword and newPassword are required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    if (newPassword.length < 6) {
      return new Response(JSON.stringify({ error: 'New password must be at least 6 characters' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const hashRow = await db.select().from(settings).where(eq(settings.key, 'admin_password_hash')).get();
    if (!hashRow) return new Response(JSON.stringify({ error: 'Admin password not configured' }), { status: 500, headers: { 'Content-Type': 'application/json' } });

    const isValid = await compare(currentPassword, hashRow.value);
    if (!isValid) return new Response(JSON.stringify({ error: 'Current password is incorrect' }), { status: 401, headers: { 'Content-Type': 'application/json' } });

    const newHash = await hash(newPassword, 12);
    await db.update(settings).set({ value: newHash, updatedAt: new Date() }).where(eq(settings.key, 'admin_password_hash')).run();

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return new Response(JSON.stringify({ error: message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
