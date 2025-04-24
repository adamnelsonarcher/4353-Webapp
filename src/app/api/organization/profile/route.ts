import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export async function GET(request: Request) {
  try {
    const orgEmail = request.headers.get('x-user-email');

    if (!orgEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userQuery = query(
      collection(db, 'users'),
      where('email', '==', orgEmail)
    );
    
    const userSnapshot = await getDocs(userQuery);
    if (userSnapshot.empty) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    const orgData = userSnapshot.docs[0].data();
    
    return NextResponse.json({
      orgName: orgData.orgName || 'Organization',
      email: orgData.email,
      phone: orgData.phone || '',
      address: orgData.address || '',
      description: orgData.description || '',
      createdAt: orgData.createdAt || null
    });
  } catch (error) {
    console.error('Error fetching organization profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch organization profile' },
      { status: 500 }
    );
  }
} 