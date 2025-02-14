'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import VolunteerHistory from "./VolunteerHistory";
import { Button } from "@/components/ui/button";

interface Notification {
  id: number;
  message: string;
  date: string;
}

export default function VolunteerDashboard() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      message: "Notification 1",
      date: "2024-03-15"
    },
    {
      id: 2,
      message: "Notification 2",
      date: "2024-03-14"
    },
    {
      id: 3,
      message: "Notification 3",
      date: "2024-03-13"
    }
  ]);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('volunteerLoggedIn');
    if (!isLoggedIn) {
      router.push('/volunteer/login');
    }
  }, [router]);

  return (
    <div className="container-page">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Welcome, [Volunteer Name]</h1>
          <Button 
            variant="secondary"
            onClick={() => {
              localStorage.removeItem('volunteerLoggedIn');
              router.push('/');
            }}
            className="hover:opacity-90 transition-opacity"
          >
            Logout
          </Button>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
          <div className="feature-card">
            <h2 className="text-xl font-semibold mb-4">Notifications</h2>
            <div className="space-y-2 overflow-y-auto max-h-[120px]">
              {notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className="p-2 rounded-lg hover:bg-secondary/5 transition-colors cursor-pointer"
                >
                  <p className="text-secondary-foreground">{notification.message}</p>
                  <p className="text-xs text-secondary-foreground/70">{new Date(notification.date).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="feature-card">
            <h2 className="text-xl font-semibold mb-4">My Events</h2>
            <p className="text-secondary-foreground">No upcoming events</p>
          </div>
          
          <div className="feature-card">
            <h2 className="text-xl font-semibold mb-4">My Skills</h2>
            <p className="text-secondary-foreground">No skills added</p>
          </div>
          
          <div className="feature-card">
            <h2 className="text-xl font-semibold mb-4">My Availability</h2>
            <p className="text-secondary-foreground">No availability set</p>
          </div>
        </div>

        <VolunteerHistory />
      </div>
    </div>
  );
} 