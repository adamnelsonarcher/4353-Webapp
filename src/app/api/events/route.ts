import { NextResponse } from 'next/server';

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

// In-memory storage for demo
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

// In-memory storage for volunteer event assignments
const volunteerEvents: Record<string, Event[]> = {};

// Validation constants
const VALIDATION = {
  EVENT_NAME_MAX: 100,
  DESC_MAX: 500,
  LOCATION_MAX: 200,
  VALID_SKILLS: [
    "Leadership",
    "Communication",
    "Problem-Solving",
    "Teaching",
    "Cooking",
    "Coding",
    "Lift Heavy Objects",
    "Stand",
    "Empathy",
    "Teamwork"
  ],
  VALID_URGENCY: ["Low", "Medium", "High"]
};

export async function GET(request: Request) {
  const email = request.headers.get('x-user-email');
  const searchParams = new URL(request.url).searchParams;
  const type = searchParams.get('type'); // 'all' or 'history'

  if (!email) {
    return NextResponse.json(
      { error: 'User not authenticated' },
      { status: 401 }
    );
  }

  if (type === 'history') {
    return NextResponse.json(volunteerEvents[email] || []);
  }

  return NextResponse.json(events);
}

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

    // Validation checks
    if (body.eventName.length > VALIDATION.EVENT_NAME_MAX) {
      return NextResponse.json(
        { error: `Event name must be ${VALIDATION.EVENT_NAME_MAX} characters or less` },
        { status: 400 }
      );
    }

    if (!body.requiredSkills.every((skill: string) => 
      VALIDATION.VALID_SKILLS.includes(skill))) {
      return NextResponse.json(
        { error: 'Invalid skills provided' },
        { status: 400 }
      );
    }

    if (!VALIDATION.VALID_URGENCY.includes(body.urgency)) {
      return NextResponse.json(
        { error: 'Invalid urgency level' },
        { status: 400 }
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

    const newEvent: Event = {
      id: Date.now().toString(),
      ...body
    };

    events.push(newEvent);

    return NextResponse.json({
      success: true,
      event: newEvent
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 