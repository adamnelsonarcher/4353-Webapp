import { NextResponse } from 'next/server';

interface ProfileData {
  fullName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  skills: string[];
  preferences: string;
  availability: Array<{date: string, timeSlots: string[]}>;
}

// In-memory storage for demo
const profileStore: Record<string, ProfileData> = {};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = request.headers.get('x-user-email');

    if (!email) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    if (!body.fullName || !body.address1 || !body.city || 
        !body.state || !body.zipCode || !body.skills?.length) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const zipRegex = /^\d{5}(-\d{4})?$/;
    if (!zipRegex.test(body.zipCode)) {
      return NextResponse.json(
        { error: 'Invalid ZIP code format' },
        { status: 400 }
      );
    }
    profileStore[email] = body;

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const email = request.headers.get('x-user-email');

  if (!email) {
    return NextResponse.json(
      { error: 'User not authenticated' },
      { status: 401 }
    );
  }

  const profile = profileStore[email];
  
  if (!profile) {
    return NextResponse.json(
      { error: 'Profile not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(profile);
} 