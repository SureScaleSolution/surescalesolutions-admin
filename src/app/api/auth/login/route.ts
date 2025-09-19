import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/lib/jwt';
import { AUTH_CONSTANTS } from '@/constants/auth';

export async function POST(request: NextRequest) {
  try {
    const { loginKey } = await request.json();

    // Validate the login key
    const expectedLoginKey = process.env.LOGIN_KEY;
    if (!expectedLoginKey) {
      console.error('LOGIN_KEY environment variable is not set');
      return NextResponse.json(
        { success: false, error: 'Server configuration error' },
        { status: 500 }
      );
    }

    if (!loginKey || loginKey !== expectedLoginKey) {
      return NextResponse.json(
        { success: false, error: 'Invalid login key' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = await generateToken();

    // Create response with token in both cookie and body
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      token,
      expiresIn: AUTH_CONSTANTS.TOKEN_EXPIRY_MS,
    });

    // Set HTTP-only cookie for security
    response.cookies.set(AUTH_CONSTANTS.AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: AUTH_CONSTANTS.TOKEN_EXPIRY_SECONDS,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
