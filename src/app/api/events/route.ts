import { NextResponse } from "next/server";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
import { db } from "../../../lib/firebase";

interface Event {
  id: string;
  eventName: string;
  eventDescription: string;
  location: string;
  requiredSkills: string[];
  urgency: "Low" | "Medium" | "High";
  eventDate: string;
  orgEmail: string; // Track which organization created the event
  status?: "Pending" | "Participated" | "Canceled" | "No Show";
}

interface VolunteerHistory {
  id: string;
  eventId: string;
  eventName: string;
  feedback: string;
  hours: number;
  participationDate: string;
  status: string;
  volunteerId: string;
}

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
    "Teamwork",
  ],
  VALID_URGENCY: ["Low", "Medium", "High"],
  DATE_MIN: new Date().toISOString().split("T")[0], // Today
  DATE_MAX: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0], // 1 year from now
  MIN_SKILLS: 1,
  MAX_SKILLS: 5,
  LOCATION_PATTERN: /^[A-Za-z0-9\s,.-]+$/,
};

export async function GET(request: Request) {
  const email = request.headers.get("x-user-email");
  const userType = request.headers.get("x-user-type"); // Check if user is volunteer or organization
  const searchParams = new URL(request.url).searchParams;
  const type = searchParams.get("type"); // Check if the request is for history
  const orgEmail = searchParams.get("org");

  if (!email || !userType) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    );
  }

  try {
    if (type === "history" && userType === "organization") {
      // Fetch volunteer history for the organization's events
      // Step 1: Fetch all events created by the organization
      const eventsRef = collection(db, "eventDetails");
      const orgEventsQuery = query(eventsRef, where("createdBy", "==", email));
      const orgEventsSnapshot = await getDocs(orgEventsQuery);

      // Extract event IDs created by the organization
      const orgEventIds = orgEventsSnapshot.docs.map((doc) => doc.id);

      if (orgEventIds.length === 0) {
        // No events created by the organization
        return NextResponse.json([]);
      }

      // Step 2: Fetch volunteer history for the organization's events
      const historyRef = collection(db, "volunteerHistory");
      const historyQuery = query(historyRef, where("eventId", "in", orgEventIds));
      const historySnapshot = await getDocs(historyQuery);

      // Map volunteer history data
      const historyData = historySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as VolunteerHistory[];

      return NextResponse.json(historyData);
    }

    if (type === "history") {
      // Fetch volunteer history
      const historyRef = collection(db, "volunteerHistory");
      const q = query(historyRef, where("volunteerId", "==", email));
      const querySnapshot = await getDocs(q);

      const historyData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as VolunteerHistory[];

      return NextResponse.json(historyData);
    } else {
      // Fetch events
      const eventsRef = collection(db, "eventDetails");
      const querySnapshot = await getDocs(eventsRef);
      const events = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        eventName: doc.data().name, // Map Firestore 'name' to 'eventName'
        eventDescription: doc.data().description, // Map Firestore 'description' to 'eventDescription'
        location: doc.data().location,
        requiredSkills: doc.data().RequiredSkills, // Map Firestore 'RequiredSkills' to 'requiredSkills'
        urgency: doc.data().Urgency, // Map Firestore 'Urgency' to 'urgency'
        eventDate: doc.data().EventDate, // Map Firestore 'EventDate' to 'eventDate'
        orgEmail: doc.data().createdBy, // Map Firestore 'createdBy' to 'orgEmail'
      })) as Event[];

      //if (userType === "organization") {
        // Organization should only see its own events
      //  const orgEvents = events.filter((event) => event.orgEmail === email);
      //  return NextResponse.json(orgEvents);
      //}

      // Volunteers see all events
      return NextResponse.json(events);
    }
  } catch (error) {
    console.error("Failed to fetch data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = request.headers.get("x-user-email");

    if (!email) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    // Validate fields
    if (
      !body.eventName ||
      !body.eventDescription ||
      !body.location ||
      !body.requiredSkills ||
      !body.urgency ||
      !body.eventDate
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Field validation
    if (body.eventName.length > VALIDATION.EVENT_NAME_MAX) {
      return NextResponse.json(
        { error: `Event name must be ${VALIDATION.EVENT_NAME_MAX} characters or less` },
        { status: 400 }
      );
    }

    if (!body.requiredSkills.every((skill: string) => VALIDATION.VALID_SKILLS.includes(skill))) {
      return NextResponse.json(
        { error: "Invalid skills provided" },
        { status: 400 }
      );
    }

    if (!VALIDATION.VALID_URGENCY.includes(body.urgency)) {
      return NextResponse.json(
        { error: "Invalid urgency level" },
        { status: 400 }
      );
    }

    const eventDate = new Date(body.eventDate);
    const today = new Date(VALIDATION.DATE_MIN);
    const maxDate = new Date(VALIDATION.DATE_MAX);

    if (eventDate < today) {
      return NextResponse.json(
        { error: "Event date cannot be in the past" },
        { status: 400 }
      );
    }

    if (eventDate > maxDate) {
      return NextResponse.json(
        { error: "Event date cannot be more than 1 year in the future" },
        { status: 400 }
      );
    }

    if (body.requiredSkills.length < VALIDATION.MIN_SKILLS || body.requiredSkills.length > VALIDATION.MAX_SKILLS) {
      return NextResponse.json(
        { error: `Number of required skills must be between ${VALIDATION.MIN_SKILLS} and ${VALIDATION.MAX_SKILLS}` },
        { status: 400 }
      );
    }

    if (!VALIDATION.LOCATION_PATTERN.test(body.location)) {
      return NextResponse.json(
        { error: "Location contains invalid characters" },
        { status: 400 }
      );
    }

    if (body.eventDescription.trim().split(/\s+/).length < 5) {
      return NextResponse.json(
        { error: "Event description must contain at least 5 words" },
        { status: 400 }
      );
    }

    // Add event to Firestore
    const eventsRef = collection(db, "eventDetails");
    const newEvent = {
      name: body.eventName, // Map 'eventName' to Firestore 'name'
      description: body.eventDescription, // Map 'eventDescription' to Firestore 'description'
      location: body.location,
      RequiredSkills: body.requiredSkills, // Map 'requiredSkills' to Firestore 'RequiredSkills'
      Urgency: body.urgency, // Map 'urgency' to Firestore 'Urgency'
      EventDate: body.eventDate, // Map 'eventDate' to Firestore 'EventDate'
      createdBy: email, // Map 'orgEmail' to Firestore 'createdBy'
      createdAt: new Date().toISOString(), // Add timestamp
    };

    const docRef = await addDoc(eventsRef, newEvent);

    return NextResponse.json({
      success: true,
      event: {
        id: docRef.id,
        ...newEvent,
      },
    });
  } catch (error) {
    console.error("Failed to create event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}