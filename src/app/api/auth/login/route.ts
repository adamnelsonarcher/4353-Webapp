import { NextResponse } from 'next/server';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

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

    // Sign in with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(
      auth,
      body.email,
      body.password
    );

    // Verify user type matches
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', body.email));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const userData = querySnapshot.docs[0].data();
    if (userData.userType !== body.userType) {
      return NextResponse.json(
        { error: 'Invalid user type' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        email: userCredential.user.email,
        type: userData.userType
      }
    });

  } catch (error: any) {
    console.error('Login error:', error);
    
    // Firebase Auth specific errors
    switch (error.code) {
      case 'auth/user-not-found':
        return NextResponse.json(
          { error: 'No account found with this email' },
          { status: 401 }
        );
      case 'auth/wrong-password':
        return NextResponse.json(
          { error: 'Incorrect password' },
          { status: 401 }
        );
      case 'auth/invalid-email':
        return NextResponse.json(
          { error: 'Invalid email format' },
          { status: 400 }
        );
      case 'auth/user-disabled':
        return NextResponse.json(
          { error: 'This account has been disabled' },
          { status: 401 }
        );
      case 'auth/too-many-requests':
        return NextResponse.json(
          { error: 'Too many failed attempts. Please try again later' },
          { status: 429 }
        );
      default:
        return NextResponse.json(
          { error: 'Failed to sign in. Please try again.' },
          { status: 500 }
        );
    }
  }
} 