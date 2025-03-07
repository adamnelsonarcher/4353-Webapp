import { NextResponse } from 'next/server';

interface LoginRequest {
  email: string;
  password: string;
  userType: 'volunteer' | 'organization';
}

// Hardcoded users for demo
const DEMO_USERS = [
  { email: 'volunteer@test.com', password: 'password123', type: 'volunteer' },
  { email: 'org@test.com', password: 'password123', type: 'organization' }
];

export async function POST(request: Request) {
  try {
    const body: LoginRequest = await request.json();
    
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

    // Find user (in real app, this would be a DB query)
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

    // In a real app, we would generate a JWT token here
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