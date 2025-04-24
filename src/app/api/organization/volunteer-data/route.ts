import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export async function GET(request: Request) {
  try {
    const userEmail = request.headers.get('x-user-email');
    if (!userEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all volunteer history entries for this organization
    const historyQuery = query(
      collection(db, 'volunteerHistory'),
      where('organizerEmail', '==', userEmail)
    );

    const historySnapshot = await getDocs(historyQuery);
    const volunteerData = historySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        volunteerName: data.volunteerName,
        volunteerEmail: data.volunteerEmail,
        eventName: data.eventName,
        date: data.createdAt ? new Date(data.createdAt.seconds * 1000).toISOString() : null
      };
    });

    return NextResponse.json(volunteerData);
  } catch (error) {
    console.error('Failed to fetch volunteer data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch volunteer data' },
      { status: 500 }
    );
  }
} 