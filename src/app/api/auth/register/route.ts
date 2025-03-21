import { NextResponse } from 'next/server';
import { createUser } from '@/lib/firebase-utils';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface RegistrationRequest {
  email: string;
  password: string;
  userType: 'volunteer' | 'organization';
}

const registeredUsers: RegistrationRequest[] = [];

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body: RegistrationRequest = await request.json();
    
    // Validation
    if (!body.email || !body.password || !body.userType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    if (!PASSWORD_REGEX.test(body.password)) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters and contain both letters and numbers' },
        { status: 400 }
      );
    }

    if (!['volunteer', 'organization'].includes(body.userType)) {
      return NextResponse.json(
        { error: 'Invalid user type' },
        { status: 400 }
      );
    }

    if (registeredUsers.some(user => user.email === body.email)) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      body.email,
      body.password
    );

    // Create user document in Firestore
    await createUser({
      email: body.email,
      userType: body.userType,
      password: '' // We don't store the password in Firestore as it's handled by Firebase Auth
    });

    registeredUsers.push(body);

    return NextResponse.json({
      success: true,
      user: {
        email: userCredential.user.email,
        type: body.userType
      }
    });

  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 400 }
      );
    }

    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 