import { NextResponse } from 'next/server';

interface Event {
  id: string;
  eventName: string;
  eventDescription: string;
  location: string;
  requiredSkills: string[];
  urgency: 'Low' | 'Medium' | 'High';
  eventDate: string;
}

interface Profile {
  skills: string[];
  availability: Array<{date: string, timeSlots: string[]}>;
}

// In-memory storage
const profileStore: Record<string, Profile> = {};
const events: Event[] = [];
const matchedEvents: Record<string, string[]> = {}; // email -> eventIds

export async function GET(request: Request) {
  const email = request.headers.get('x-user-email');

  if (!email) {
    return NextResponse.json(
      { error: 'User not authenticated' },
      { status: 401 }
    );
  }

  const userProfile = profileStore[email];
  if (!userProfile) {
    return NextResponse.json(
      { error: 'Profile not found' },
      { status: 404 }
    );
  }

  // Match events based on skills and availability
  const matchedEvents = events.filter(event => {
    // Check if user has any of the required skills
    const hasRequiredSkills = event.requiredSkills.some(skill => 
      userProfile.skills.includes(skill)
    );

    // Check if user is available on event date
    const eventDate = event.eventDate.split('T')[0]; // Get just the date part
    const isAvailable = userProfile.availability.some(a => 
      a.date.split('T')[0] === eventDate
    );

    return hasRequiredSkills && isAvailable;
  });

  return NextResponse.json(matchedEvents);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = request.headers.get('x-user-email');
    const eventId = body.eventId;

    if (!email || !eventId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Store the match
    if (!matchedEvents[email]) {
      matchedEvents[email] = [];
    }
    matchedEvents[email].push(eventId);

    return NextResponse.json({
      success: true,
      message: 'Successfully matched with event'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 