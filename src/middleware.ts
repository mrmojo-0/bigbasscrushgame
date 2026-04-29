import { defineMiddleware } from 'astro:middleware';
import { getDb } from './lib/db/index';
import { validateSession, SESSION_COOKIE_NAME } from './lib/auth/session';

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  const isAdminRoute = pathname.startsWith('/admin');
  const isApiRoute = pathname.startsWith('/api') && !pathname.startsWith('/api/auth/login') && !pathname.startsWith('/api/comments') && !pathname.startsWith('/api/internal/cron');
  const isLoginPage = pathname === '/admin/login';

  if ((isAdminRoute && !isLoginPage) || isApiRoute) {
    const { env } = context.locals.runtime;
    const db = getDb(env.DB);
    const sessionToken = context.cookies.get(SESSION_COOKIE_NAME)?.value;
    const isValid = await validateSession(db, sessionToken);

    if (!isValid) {
      if (isAdminRoute) {
        return context.redirect('/admin/login', 302);
      }
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  const response = await next();

  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  return response;
});
