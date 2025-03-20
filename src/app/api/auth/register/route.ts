import { NextResponse } from 'next/server';

interface RegistrationRequest {
  email: string;
  password: string;
  userType: 'volunteer' | 'organization';
}

const registeredUsers: RegistrationRequest[] = [];

export async function POST(request: Request) {
  try {
    const body: RegistrationRequest = await request.json();

    if (!body.email || !body.password || !body.userType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    if (body.password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    if (registeredUsers.some(user => user.email === body.email)) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    registeredUsers.push(body);

    return NextResponse.json({
      success: true,
      message: 'Registration successful'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 