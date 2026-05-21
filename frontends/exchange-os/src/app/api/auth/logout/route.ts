import { NextRequest, NextResponse } from 'next/server';
import { getSessionCookie, clearSessionCookie } from '@/lib/auth/cookies';
import { deleteSession } from '@/lib/auth/db';

export async function POST(request: NextRequest) {
  try {
    const sessionId = await getSessionCookie();
    
    if (sessionId) {
      deleteSession(sessionId);
      await clearSessionCookie();
    }

    return NextResponse.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}
