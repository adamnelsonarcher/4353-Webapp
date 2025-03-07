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
    
    // Validate required fields
    if (!body.email || !body.password || !body.userType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Find user in the demo database
    const user = DEMO_USERS.find(u => 
      u.email === body.email && 
      u.password === body.password &&
      u.type === body.userType
    );

    // Return 401 if user is not found
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Return success response with a mock token
    return NextResponse.json(
      { 
        success: true,
        token: 'fake-jwt-token', // Mock token for testing
        user: {
          email: user.email,
          type: user.type
        }
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}