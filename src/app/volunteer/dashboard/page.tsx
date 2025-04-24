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
  const [volunteerName, setVolunteerName] = useState<string>('');
  const [volunteerEmail, setVolunteerEmail] = useState('');
  const [mounted, setMounted] = useState(false);

  // Handle initial mount
  useEffect(() => {
    setMounted(true);
    const email = window.localStorage.getItem('userEmail');
    const name = window.localStorage.getItem('volunteerName');
    const isLoggedIn = window.localStorage.getItem('volunteerLoggedIn');
    
    setVolunteerEmail(email || '');
    setVolunteerName(name || '');
    
    if (!isLoggedIn) {
      router.push('/volunteer/login');
      return;
    }
  }, [router]);

  // Handle data fetching after mount
  useEffect(() => {
    if (!mounted || !volunteerEmail) return;

    const fetchNotifications = async () => {
      try {
        const response = await fetch('/api/notifications', {
          headers: {
            'x-user-email': volunteerEmail
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
  }, [mounted, volunteerEmail]);

  if (!mounted) {
    return null; // or a loading spinner
  }

  return (
    <div className="container-page">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Welcome, {volunteerName || 'Volunteer'}</h1>
            <p className="text-secondary-foreground mt-1">{volunteerEmail}</p>
          </div>
          <Button 
            variant="secondary"
            onClick={() => {
              window.localStorage.removeItem('volunteerLoggedIn');
              window.localStorage.removeItem('userEmail');
              window.localStorage.removeItem('volunteerName');
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