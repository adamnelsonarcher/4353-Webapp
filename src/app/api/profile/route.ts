import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';

interface ProfileData {
  fullName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  skills: string[];
  preferences: string;
  availability: Array<{ date: string; timeSlots: string[] }>;
}

interface UserData {
  email: string;
  userType: 'volunteer' | 'organization';
  createdAt?: string;
  updatedAt?: string;
}

// Fetch or update combined user and profile data
export async function GET(request: Request) {
  try {
    const email = request.headers.get('x-user-email');

    if (!email) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Fetch user data
    const usersRef = collection(db, 'users');
    const userQuery = query(usersRef, where('email', '==', email));
    const userSnapshot = await getDocs(userQuery);

    if (userSnapshot.empty) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const userData = userSnapshot.docs[0].data() as UserData;

    // Fetch profile data
    const profilesRef = collection(db, 'profiles');
    const profileQuery = query(profilesRef, where('email', '==', email));
    const profileSnapshot = await getDocs(profileQuery);

    const profileData = profileSnapshot.empty ? null : profileSnapshot.docs[0].data();

    return NextResponse.json({
      user: userData,
      profile: profileData,
    });
  } catch (error) {
    console.error('Failed to fetch user and profile data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user and profile data' },
      { status: 500 }
    );
  }
}

// Update profile data
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

    // Validate required fields
    if (
      !body.fullName ||
      !body.address1 ||
      !body.city ||
      !body.state ||
      !body.zipCode ||
      !body.skills?.length
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate ZIP code format
    const zipRegex = /^\d{5}(-\d{4})?$/;
    if (!zipRegex.test(body.zipCode)) {
      return NextResponse.json(
        { error: 'Invalid ZIP code format' },
        { status: 400 }
      );
    }

    // Find the profile document
    const profilesRef = collection(db, 'profiles');
    const q = query(profilesRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    // Update the profile
    const profileDoc = querySnapshot.docs[0];
    await updateDoc(profileDoc.ref, {
      ...body,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}