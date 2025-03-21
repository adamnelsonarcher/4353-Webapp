import { NextResponse } from 'next/server';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

interface RegistrationRequest {
  email: string;
  password: string;
  userType: 'volunteer' | 'organization';
}

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

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      body.email,
      body.password
    );

    const userCollection = collection(db, 'users');
    await addDoc(userCollection, {
      email: body.email,
      userType: body.userType,
      createdAt: new Date()
    });

    const profileCollection = collection(db, 'profiles');
    await addDoc(profileCollection, {
      email: body.email,
      fullName: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      zipCode: '',
      skills: [],
      preferences: '',
      availability: [],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return NextResponse.json({
      success: true,
      user: {
        email: userCredential.user.email,
        type: body.userType
      }
    });

  } catch (error: any) {
    console.error('Registration error:', error);
    
    // Firebase Auth specific errors
    switch (error.code) {
      case 'auth/email-already-in-use':
        return NextResponse.json(
          { error: 'This email is already registered' },
          { status: 400 }
        );
      case 'auth/invalid-email':
        return NextResponse.json(
          { error: 'Invalid email format' },
          { status: 400 }
        );
      case 'auth/operation-not-allowed':
        return NextResponse.json(
          { error: 'Email/password registration is not enabled' },
          { status: 400 }
        );
      case 'auth/weak-password':
        return NextResponse.json(
          { error: 'Password is too weak. It must be at least 8 characters long' },
          { status: 400 }
        );
      default:
        return NextResponse.json(
          { error: 'Failed to create account. Please try again.' },
          { status: 500 }
        );
    }
  }
} 