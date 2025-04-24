import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';

export async function POST() {
  try {
    const auth = getAuth();
    
    // Create organization user in Auth
    await createUserWithEmailAndPassword(auth, "seedorg123@test.com", "Test123!");

    // Add organization user to Firestore
    await addDoc(collection(db, 'users'), {
      address: "123 Address Ln",
      createdAt: Timestamp.fromDate(new Date("2025-03-21T23:30:09")),
      description: "Testing Org",
      email: "seedorg123@test.com",
      orgName: "TestOrg",
      phone: "8321234444",
      userType: "organization"
    });

    // Create volunteer user in Auth
    await createUserWithEmailAndPassword(auth, "seedvol123@test.com", "Test123!");

    // Add volunteer user to Firestore
    await addDoc(collection(db, 'profiles'), {
      address1: "1232 Address St.",
      address2: "",
      availability: [{
        date: "2025-03-28",
        timeSlots: ["Morning (8AM-12PM)", "Evening (4PM-8PM)"]
      }],
      city: "Houston",
      createdAt: Timestamp.fromDate(new Date("2025-03-20T19:37:33")),
      email: "seedvol123@test.com",
      fullName: "Tester Name",
      preferences: "",
      skills: ["Leadership", "Communication"]
    });

    // Add test event
    await addDoc(collection(db, 'events'), {
      createdAt: Timestamp.fromDate(new Date("2025-03-21T23:31:22")),
      eventDate: "2025-03-01",
      eventDescription: "event Test 1",
      eventName: "Test Event",
      location: "Location 1",
      organizerEmail: "seedorg123@test.com",
      requiredSkills: ["Leadership", "Communication"],
      status: "Active",
      updatedAt: Timestamp.fromDate(new Date("2025-03-21T23:31:22")),
      urgency: "Medium"
    });

    // Add volunteer history entry
    await addDoc(collection(db, 'volunteerHistory'), {
      createdAt: Timestamp.fromDate(new Date("2025-03-21T23:18:18")),
      eventId: "1",
      eventName: "Houston Food Bank",
      participationDate: Timestamp.fromDate(new Date("2025-03-21T23:18:18")),
      status: "Pending",
      updatedAt: Timestamp.fromDate(new Date("2025-03-21T23:18:18")),
      volunteerId: "seedvol123@test.com",
      volunteerName: "Tester Name",
      volunteerEmail: "seedvol123@test.com",
      organizerEmail: "seedorg123@test.com"
    });

    return NextResponse.json({ message: 'Sample data created successfully' });
  } catch (error) {
    console.error('Error seeding data:', error);
    return NextResponse.json({ error: 'Failed to seed data' }, { status: 500 });
  }
} 