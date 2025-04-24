import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';

export async function POST() {
  try {
    const auth = getAuth();

    // Create volunteer users in Auth and Firestore
    const volunteers = [
      {
        email: "seedvol555@test.com",
        name: "John Smith",
        skills: ["Leadership", "Communication"],
        address: "1232 Address St."
      },
      {
        email: "seedvol456@test.com",
        name: "Jane Wilson",
        skills: ["Teaching", "Problem-Solving"],
        address: "789 Second St."
      },
      {
        email: "seedvol789@test.com",
        name: "Mike Johnson",
        skills: ["Cooking", "Communication"],
        address: "456 Third Ave."
      }
    ];

    // Add test events
    const events = [
      {
        eventName: "Community Food Drive",
        description: "Help distribute food to those in need",
        date: "2025-03-01",
        skills: ["Leadership", "Communication"],
        urgency: "High"
      },
      {
        eventName: "Youth Mentoring Program",
        description: "Mentor local youth in academic subjects",
        date: "2025-03-15",
        skills: ["Teaching", "Communication"],
        urgency: "Medium"
      },
      {
        eventName: "Senior Center Meal Prep",
        description: "Prepare meals for local senior center",
        date: "2025-03-10",
        skills: ["Cooking", "Leadership"],
        urgency: "Medium"
      }
    ];

    for (const event of events) {
      await addDoc(collection(db, 'events'), {
        createdAt: Timestamp.fromDate(new Date("2025-03-21T23:31:22")),
        eventDate: event.date,
        eventDescription: event.description,
        eventName: event.eventName,
        location: "Another Community Center",
        organizerEmail: "seedorg123@test.com",
        requiredSkills: event.skills,
        status: "Active",
        updatedAt: Timestamp.fromDate(new Date("2025-03-21T23:31:22")),
        urgency: event.urgency
      });
    }

    // Add volunteer history entries
    const volunteerHistory = [
      {
        volunteerEmail: "seedvol123@test.com",
        volunteerName: "John Smith",
        eventName: "Community Food Drive",
        date: "2025-03-01",
        status: "Completed"
      },
      {
        volunteerEmail: "seedvol456@test.com",
        volunteerName: "Jane Wilson",
        eventName: "Youth Mentoring Program",
        date: "2025-03-15",
        status: "Pending"
      },
      {
        volunteerEmail: "seedvol789@test.com",
        volunteerName: "Mike Johnson",
        eventName: "Senior Center Meal Prep",
        date: "2025-03-10",
        status: "Completed"
      },
      {
        volunteerEmail: "seedvol123@test.com",
        volunteerName: "John Smith",
        eventName: "Youth Mentoring Program",
        date: "2025-03-15",
        status: "Pending"
      },
      {
        volunteerEmail: "seedvol456@test.com",
        volunteerName: "Jane Wilson",
        eventName: "Senior Center Meal Prep",
        date: "2025-03-10",
        status: "Completed"
      }
    ];

    for (const history of volunteerHistory) {
      await addDoc(collection(db, 'volunteerHistory'), {
        createdAt: Timestamp.fromDate(new Date("2025-03-21T23:18:18")),
        eventId: "1",
        eventName: history.eventName,
        participationDate: Timestamp.fromDate(new Date(history.date)),
        status: history.status,
        updatedAt: Timestamp.fromDate(new Date("2025-03-21T23:18:18")),
        volunteerId: history.volunteerEmail,
        volunteerName: history.volunteerName,
        volunteerEmail: history.volunteerEmail,
        organizerEmail: "seedorg123@test.com"
      });
    }

    return NextResponse.json({ message: 'Sample data created successfully' });
  } catch (error) {
    console.error('Error seeding data:', error);
    return NextResponse.json({ error: 'Failed to seed data' }, { status: 500 });
  }
} 