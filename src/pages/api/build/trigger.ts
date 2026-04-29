import type { APIRoute } from 'astro';
import { exec } from 'child_process';
import { validateSession, SESSION_COOKIE_NAME } from '../../../lib/auth/session';

export const prerender = false;

// Simple flag to prevent concurrent builds
let isBuildRunning = false;

export const POST: APIRoute = async ({ cookies }) => {
  try {
    const token = cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!validateSession(token)) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (isBuildRunning) {
      return new Response(
        JSON.stringify({ error: 'A build is already in progress' }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      );
    }

    isBuildRunning = true;

    const buildResult = await new Promise<{ success: boolean; stdout: string; stderr: string }>((resolve) => {
      exec('npm run build', { cwd: process.cwd(), timeout: 300000 }, (error, stdout, stderr) => {
        isBuildRunning = false;
        if (error) {
          resolve({
            success: false,
            stdout: stdout || '',
            stderr: stderr || error.message,
          });
        } else {
          resolve({
            success: true,
            stdout: stdout || '',
            stderr: stderr || '',
          });
        }
      });
    });

    const status = buildResult.success ? 200 : 500;

    return new Response(
      JSON.stringify({
        success: buildResult.success,
        stdout: buildResult.stdout,
        stderr: buildResult.stderr,
      }),
      { status, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    isBuildRunning = false;
    const message = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
