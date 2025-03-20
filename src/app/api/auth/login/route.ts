import { NextResponse } from 'next/server';

interface LoginRequest {
  email: string;
  password: string;
  userType: 'volunteer' | 'organization';
}

// Hardcoded users for demo, for assignment 3, this will be replaced with a database query
const DEMO_USERS = [
  { email: 'volunteer@test.com', password: 'password123', type: 'volunteer' },
  { email: 'org@test.com', password: 'password123', type: 'organization' }
];

export async function POST(request: Request) {
  try {
    const body: LoginRequest = await request.json();
    
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

    const user = DEMO_USERS.find(u => 
      u.email === body.email && 
      u.password === body.password &&
      u.type === body.userType
    );

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // In a real app, we would generate a JWT token here. We are not because this is only assignment 3.
    return NextResponse.json({
      success: true,
      user: {
        email: user.email,
        type: user.type
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 