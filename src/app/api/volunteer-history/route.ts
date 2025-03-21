import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, updateDoc } from 'firebase/firestore';
import type { FirebaseVolunteerHistory } from '@/types/firebase';

export async function GET(request: Request) {
  try {
    const email = request.headers.get('x-user-email');

    if (!email) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    const historyRef = collection(db, 'volunteerHistory');
    const q = query(historyRef, where('volunteerId', '==', email));
    const querySnapshot = await getDocs(q);

    const history = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(history);
  } catch (error) {
    console.error('History fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch history' },
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

    if (!body.eventId || !body.eventName || !body.status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create base history data with required fields
    const historyData: Partial<FirebaseVolunteerHistory> = {
      volunteerId: email,
      eventId: body.eventId,
      eventName: body.eventName,
      participationDate: new Date(),
      status: body.status,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Only add optional fields if they exist
    if (body.feedback) {
      historyData.feedback = body.feedback;
    }
    
    if (body.hours) {
      historyData.hours = body.hours;
    }

    const historyRef = collection(db, 'volunteerHistory');
    await addDoc(historyRef, historyData);

    return NextResponse.json({
      success: true,
      message: 'History recorded successfully'
    });
  } catch (error) {
    console.error('History creation error:', error);
    return NextResponse.json(
      { error: 'Failed to record history' },
      { status: 500 }
    );
  }
} 