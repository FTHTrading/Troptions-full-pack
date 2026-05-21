import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, verifyPassword, createSession } from '@/lib/auth/db';
import { setSessionCookie } from '@/lib/auth/cookies';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      );
    }

    const user = getUserByEmail(email);

    if (!user || !verifyPassword(password, user.password_hash)) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const sessionId = createSession(user.id);
    await setSessionCookie(sessionId);

    return NextResponse.json(
      { user: { id: user.id, email: user.email } },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
