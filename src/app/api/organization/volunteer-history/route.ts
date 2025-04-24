import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export async function GET(request: Request) {
  try {
    const orgEmail = request.headers.get('x-user-email');

    if (!orgEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get volunteer history for this organization
    const historyQuery = query(
      collection(db, 'volunteerHistory'),
      where('organizerEmail', '==', orgEmail)
    );
    
    const historySnapshot = await getDocs(historyQuery);
    const historyData = historySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Group history by volunteer
    const volunteerMap = new Map();

    for (const entry of historyData) {
      if (!volunteerMap.has(entry.volunteerId)) {
        // Get volunteer profile
        const volunteerQuery = query(
          collection(db, 'profiles'),
          where('email', '==', entry.volunteerId)
        );
        const volunteerSnapshot = await getDocs(volunteerQuery);
        const volunteerData = volunteerSnapshot.docs[0]?.data() || {};

        volunteerMap.set(entry.volunteerId, {
          id: entry.volunteerId,
          name: volunteerData.fullName || 'Unknown Volunteer',
          email: entry.volunteerId,
          skills: volunteerData.skills || [],
          totalHours: 0,
          eventsParticipated: 0,
          completedEvents: 0,
          history: []
        });
      }

      const volunteer = volunteerMap.get(entry.volunteerId);
      
      // Convert Firestore Timestamp to milliseconds for the frontend
      const participationDate = entry.participationDate ? {
        seconds: entry.participationDate.seconds,
        nanoseconds: entry.participationDate.nanoseconds
      } : null;

      volunteer.history.push({
        id: entry.id,
        eventName: entry.eventName,
        participationDate,
        status: entry.status,
        hours: entry.hours || 0,
        feedback: entry.feedback || ''
      });

      if (entry.status === 'Completed') {
        volunteer.completedEvents++;
        volunteer.totalHours += (entry.hours || 0);
      }
      volunteer.eventsParticipated++;
    }

    // Sort each volunteer's history by date
    for (const volunteer of volunteerMap.values()) {
      volunteer.history.sort((a, b) => {
        if (!a.participationDate || !b.participationDate) return 0;
        return b.participationDate.seconds - a.participationDate.seconds;
      });
    }

    return NextResponse.json(Array.from(volunteerMap.values()));
  } catch (error) {
    console.error('Error fetching volunteer history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch volunteer history' },
      { status: 500 }
    );
  }
} 