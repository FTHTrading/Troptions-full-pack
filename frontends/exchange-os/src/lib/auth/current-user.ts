import { getSessionCookie } from '@/lib/auth/cookies';
import { getSessionUser } from '@/lib/auth/db';

export async function getCurrentUser() {
  const sessionId = await getSessionCookie();
  if (!sessionId) return null;
  
  const user = getSessionUser(sessionId);
  return user || null;
}
