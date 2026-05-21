import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUserByEmail, verifyPassword, createSession } from '@/lib/auth/db';
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

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    if (!email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    const user = createUser(email, password);
    const sessionId = createSession(user.id);
    
    await setSessionCookie(sessionId);

    return NextResponse.json(
      { user: { id: user.id, email: user.email } },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error.message || 'Registration failed' },
      { status: 400 }
    );
  }
}
