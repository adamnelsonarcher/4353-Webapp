import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orgEmail = request.headers.get('x-user-email');

    if (!orgEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get active events count
    const eventsQuery = query(
      collection(db, 'events'),
      where('organizerEmail', '==', orgEmail)
    );
    const eventsSnapshot = await getDocs(eventsQuery);
    const events = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const activeEvents = events.filter(event => event.status === 'Active').length;

    // Get total volunteers count (unique volunteers who have participated)
    const historyQuery = query(
      collection(db, 'volunteerHistory'),
      where('organizerEmail', '==', orgEmail)
    );
    const historySnapshot = await getDocs(historyQuery);
    const uniqueVolunteers = new Set(
      historySnapshot.docs.map(doc => doc.data().volunteerId)
    );

    // Get pending applications count
    const pendingHistory = historySnapshot.docs.filter(
      doc => doc.data().status === 'Pending'
    ).length;

    return NextResponse.json({
      activeEvents,
      totalVolunteers: uniqueVolunteers.size,
      pendingApplications: pendingHistory
    });
  } catch (error) {
    console.error('Error fetching organization stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch organization stats' },
      { status: 500 }
    );
  }
} 