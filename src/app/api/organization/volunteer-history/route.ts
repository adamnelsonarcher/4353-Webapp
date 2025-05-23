import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

interface VolunteerHistoryEntry {
  id: string;
  volunteerId: string;
  eventName: string;
  participationDate: {
    seconds: number;
    nanoseconds: number;
  };
  status: 'Pending' | 'Completed' | 'Canceled';
  hours?: number;
  feedback?: string;
  organizerEmail: string;
}

interface VolunteerProfile {
  fullName?: string;
  email: string;
  skills?: string[];
}

interface VolunteerWithHistory {
  id: string;
  name: string;
  email: string;
  skills: string[];
  totalHours: number;
  eventsParticipated: number;
  completedEvents: number;
  history: Array<{
    id: string;
    eventName: string;
    participationDate: {
      seconds: number;
      nanoseconds: number;
    };
    status: 'Pending' | 'Completed' | 'Canceled';
    hours: number;
    feedback: string;
  }>;
}

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
    const historyData = historySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as VolunteerHistoryEntry[];

    // Group history by volunteer
    const volunteerMap = new Map<string, VolunteerWithHistory>();

    for (const entry of historyData) {
      if (!volunteerMap.has(entry.volunteerId)) {
        // Get volunteer profile
        const volunteerQuery = query(
          collection(db, 'profiles'),
          where('email', '==', entry.volunteerId)
        );
        const volunteerSnapshot = await getDocs(volunteerQuery);
        const volunteerData = volunteerSnapshot.docs[0]?.data() as VolunteerProfile || {};

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

      const volunteer = volunteerMap.get(entry.volunteerId)!;
      volunteer.history.push({
        id: entry.id,
        eventName: entry.eventName,
        participationDate: entry.participationDate,
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

    return NextResponse.json(Array.from(volunteerMap.values()));
  } catch (error) {
    console.error('Error fetching volunteer history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch volunteer history' },
      { status: 500 }
    );
  }
} 