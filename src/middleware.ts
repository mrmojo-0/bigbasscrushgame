import { defineMiddleware } from 'astro:middleware';
import { validateSession, SESSION_COOKIE_NAME } from './lib/auth/session';

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  // Only protect admin and API routes (except login)
  const isAdminRoute = pathname.startsWith('/admin');
  const isApiRoute = pathname.startsWith('/api') && !pathname.startsWith('/api/auth/login') && !pathname.startsWith('/api/comments');
  const isLoginPage = pathname === '/admin/login';

  if ((isAdminRoute && !isLoginPage) || isApiRoute) {
    const sessionToken = context.cookies.get(SESSION_COOKIE_NAME)?.value;
    const isValid = validateSession(sessionToken);

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

  // Security headers for all responses
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  return response;
});
