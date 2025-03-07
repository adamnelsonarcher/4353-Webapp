import { NextResponse } from 'next/server';

interface RegistrationRequest {
  email: string;
  password: string;
  userType: 'volunteer' | 'organization';
}

// In-memory storage for demo
const registeredUsers: RegistrationRequest[] = [];

export async function POST(request: Request) {
  try {
    const body: RegistrationRequest = await request.json();

    // Validate request body
    if (!body.email || !body.password || !body.userType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Password validation
    if (body.password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Check if email already exists
    if (registeredUsers.some(user => user.email === body.email)) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Store user (in real app, this would be a DB operation)
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