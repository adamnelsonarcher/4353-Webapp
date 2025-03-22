import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, Timestamp } from 'firebase/firestore';
import type { FirebaseEvent } from '@/types/firebase';

interface Event {
  id: string;
  eventName: string;
  eventDescription: string;
  location: string;
  requiredSkills: string[];
  urgency: 'Low' | 'Medium' | 'High';
  eventDate: string;
  status?: 'Pending' | 'Participated' | 'Canceled' | 'No Show';
}

const events: Event[] = [
  {
    id: '1',
    eventName: "Houston Food Bank",
    eventDescription: "To provide food assistance to those in need and alleviate hunger in the community.",
    location: "535 Portwall St, Houston, TX 77029",
    requiredSkills: ["Lift Heavy Objects", "Stand"],
    urgency: "Medium",
    eventDate: "03/11/2024"
  },
  {
    id: '2',
    eventName: "Homeless Shelter",
    eventDescription: "Providing meals, shelter, and support services for individuals experiencing homelessness.",
    location: "101 Homeless Way, Houston, TX 77001",
    requiredSkills: ["Empathy", "Teamwork", "Basic Problem-Solving"],
    urgency: "High",
    eventDate: "04/04/2024"
  }
];

const volunteerEvents: Record<string, Event[]> = {};

const VALIDATION = {
  EVENT_NAME_MAX: 100,
  DESC_MAX: 500,
  LOCATION_MAX: 200,
  VALID_SKILLS: [
    "Leadership", "Communication", "Problem-Solving", "Teaching",
    "Cooking", "Coding", "Lift Heavy Objects", "Stand",
    "Empathy", "Teamwork"
  ],
  VALID_URGENCY: ["Low", "Medium", "High"],
  DATE_MIN: new Date().toISOString().split('T')[0], // Today
  DATE_MAX: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 year from now
  MIN_SKILLS: 1,
  MAX_SKILLS: 5,
  LOCATION_PATTERN: /^[A-Za-z0-9\s,.-]+$/,
};

export async function GET(request: Request) {
  try {
    const email = request.headers.get('x-user-email');
    const searchParams = new URL(request.url).searchParams;
    const type = searchParams.get('type');

    if (!email) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    const eventsRef = collection(db, 'events');
    let q;

    if (type === 'organization') {
      // Get events created by this organization
      q = query(eventsRef, where('organizerEmail', '==', email));
    } else {
      // Get all active events for volunteers
      q = query(eventsRef, where('status', '==', 'Active'));
    }

    const querySnapshot = await getDocs(q);
    const events = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || null,
        updatedAt: data.updatedAt?.toDate?.() || null
      };
    });

    return NextResponse.json(events);

  } catch (error) {
    console.error('Events fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const email = request.headers.get('x-user-email');
    const body = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Validate required fields
    if (!body.eventName || !body.eventDescription || !body.location || 
        !body.requiredSkills || !body.urgency || !body.eventDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate field lengths
    if (body.eventName.length > VALIDATION.EVENT_NAME_MAX ||
        body.eventDescription.length > VALIDATION.DESC_MAX ||
        body.location.length > VALIDATION.LOCATION_MAX) {
      return NextResponse.json(
        { error: 'Field length exceeded maximum allowed' },
        { status: 400 }
      );
    }

    // Validate skills
    if (!body.requiredSkills.every((skill: string) => 
        VALIDATION.VALID_SKILLS.includes(skill))) {
      return NextResponse.json(
        { error: 'Invalid skills provided' },
        { status: 400 }
      );
    }

    // Create event document
    const eventData: Omit<FirebaseEvent, 'id'> = {
      eventName: body.eventName,
      eventDescription: body.eventDescription,
      location: body.location,
      requiredSkills: body.requiredSkills,
      urgency: body.urgency,
      eventDate: body.eventDate,
      organizerEmail: email,
      status: 'Active',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    const eventsRef = collection(db, 'events');
    const docRef = await addDoc(eventsRef, eventData);

    return NextResponse.json({
      success: true,
      event: { id: docRef.id, ...eventData }
    });

  } catch (error) {
    console.error('Event creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
} 