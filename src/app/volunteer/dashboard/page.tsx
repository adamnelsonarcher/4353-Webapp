'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import VolunteerHistory from "./VolunteerHistory";
import MatchedEvents from "./MatchedEvents";
import { Button } from "@/components/ui/button";

interface Notification {
  id: number;
  message: string;
  date: string;
}

export default function VolunteerDashboard() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('volunteerLoggedIn');
    if (!isLoggedIn) {
      router.push('/volunteer/login');
    } else {
      const fetchNotifications = async () => {
        try {
          const email = localStorage.getItem('userEmail');
          const response = await fetch('/api/notifications', {
            headers: {
              'x-user-email': email || ''
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            setNotifications(data);
          }
        } catch (error) {
          console.error('Failed to fetch notifications:', error);
        }
      };

      fetchNotifications();
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left column */}
          <div className="space-y-8">
            <MatchedEvents />
            <div className="feature-card">
              <h2 className="text-xl font-semibold mb-6">Notifications</h2>
              <div className="space-y-4">
                {notifications.map(notification => (
                  <div key={notification.id} className="p-4 border border-secondary rounded-lg">
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-2">{notification.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-8">
            <VolunteerHistory />
          </div>
        </div>
      </div>
    </div>
  );
} 