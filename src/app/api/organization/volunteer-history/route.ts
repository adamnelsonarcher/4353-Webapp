import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

export async function GET(request: Request) {
  try {
    const orgEmail = request.headers.get('x-user-email');

    if (!orgEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get volunteer history for this organization
    const historyQuery = query(
      collection(db, 'volunteerHistory'),
      where('organizerEmail', '==', orgEmail),
      orderBy('participationDate', 'desc')
    );
    
    const historySnapshot = await getDocs(historyQuery);
    const history = await Promise.all(historySnapshot.docs.map(async doc => {
      const historyData = doc.data();
      
      // Get volunteer profile
      const volunteerQuery = query(
        collection(db, 'profiles'),
        where('email', '==', historyData.volunteerId)
      );
      const volunteerSnapshot = await getDocs(volunteerQuery);
      const volunteerData = volunteerSnapshot.docs[0]?.data() || {};

      return {
        id: doc.id,
        eventName: historyData.eventName,
        volunteerName: volunteerData.fullName || 'Unknown Volunteer',
        volunteerEmail: historyData.volunteerId,
        participationDate: historyData.participationDate,
        status: historyData.status,
        hours: historyData.hours || 0,
        feedback: historyData.feedback || ''
      };
    }));

    return NextResponse.json(history);
  } catch (error) {
    console.error('Error fetching volunteer history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch volunteer history' },
      { status: 500 }
    );
  }
} 