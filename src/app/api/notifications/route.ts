import { NextResponse } from 'next/server';

interface Notification {
  id: number;
  message: string;
  date: string;
  userEmail: string;
  type: 'event_match' | 'event_reminder' | 'event_update' | 'system';
}

// In-memory storage for notifications
const notifications: Notification[] = [
  {
    id: 1,
    message: "You've been matched with 'Houston Food Bank' event",
    date: "2024-03-15",
    userEmail: "volunteer@test.com",
    type: "event_match"
  },
  {
    id: 2,
    message: "Reminder: 'Homeless Shelter' event tomorrow",
    date: "2024-03-14",
    userEmail: "volunteer@test.com",
    type: "event_reminder"
  },
  {
    id: 3,
    message: "'Public Library' event has been updated",
    date: "2024-03-13",
    userEmail: "volunteer@test.com",
    type: "event_update"
  }
];

export async function GET(request: Request) {
  const email = request.headers.get('x-user-email');

  if (!email) {
    return NextResponse.json(
      { error: 'User not authenticated' },
      { status: 401 }
    );
  }

  // Filter notifications for the specific user
  const userNotifications = notifications.filter(
    notification => notification.userEmail === email
  );

  return NextResponse.json(userNotifications);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, userEmail, type } = body;

    if (!message || !userEmail || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create new notification
    const newNotification: Notification = {
      id: notifications.length + 1,
      message,
      date: new Date().toISOString().split('T')[0],
      userEmail,
      type
    };

    notifications.push(newNotification);

    return NextResponse.json({
      success: true,
      notification: newNotification
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 