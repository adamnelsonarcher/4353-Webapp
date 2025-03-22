import { NextResponse } from 'next/server';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

interface RegistrationRequest {
  email: string;
  password: string;
  userType: 'volunteer' | 'organization';
  orgName: string;
  phone: string;
  address: string;
  description: string;
}

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, userType, orgName, phone, address, description } = body;
    
    // Validation
    if (!email || !password || !userType || !orgName || !phone || !address || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    if (!PASSWORD_REGEX.test(password)) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters and contain both letters and numbers' },
        { status: 400 }
      );
    }

    if (!['volunteer', 'organization'].includes(userType)) {
      return NextResponse.json(
        { error: 'Invalid user type' },
        { status: 400 }
      );
    }

    // Create Firebase auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create user document in Firestore
    const userRef = collection(db, 'users');
    await addDoc(userRef, {
      uid: user.uid,
      email: email,
      userType: userType,
      orgName: orgName,
      phone: phone,
      address: address,
      description: description,
      createdAt: new Date()
    });

    const profileCollection = collection(db, 'profiles');
    await addDoc(profileCollection, {
      email: email,
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

    return NextResponse.json({ success: true });
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
          { error: error.message || 'Registration failed' },
          { status: 500 }
        );
    }
  }
} 