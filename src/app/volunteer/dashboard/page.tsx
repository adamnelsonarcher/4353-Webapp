'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import VolunteerHistory from "./VolunteerHistory";
import MatchedEvents from "./MatchedEvents";
import { Button } from "@/components/ui/button";
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

interface Notification {
  id: number;
  message: string;
  date: string;
}

interface VolunteerProfile {
  fullName: string;
  email: string;
  skills: string[];
  preferences: string;
  availability: Array<{
    date: string;
    timeSlots: string[];
  }>;
}

export default function VolunteerDashboard() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [volunteerName, setVolunteerName] = useState<string>('');
  const [volunteerEmail, setVolunteerEmail] = useState('');
  const [volunteerProfile, setVolunteerProfile] = useState<VolunteerProfile | null>(null);
  const [mounted, setMounted] = useState(false);

  // Handle initial mount
  useEffect(() => {
    setMounted(true);
    const email = window.localStorage.getItem('userEmail');
    const isLoggedIn = window.localStorage.getItem('volunteerLoggedIn');
    
    setVolunteerEmail(email || '');
    
    if (!isLoggedIn) {
      router.push('/volunteer/login');
      return;
    }
  }, [router]);

  // Handle data fetching after mount
  useEffect(() => {
    if (!mounted || !volunteerEmail) return;

    const fetchData = async () => {
      try {
        // Fetch volunteer profile data
        const q = query(
          collection(db, 'profiles'),
          where('email', '==', volunteerEmail)
        );
        
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const profileData = querySnapshot.docs[0].data() as VolunteerProfile;
          setVolunteerProfile(profileData);
          setVolunteerName(profileData.fullName || 'Volunteer');
        }

        // Add placeholder notifications
        setNotifications([
          {
            id: 1,
            message: "New event match found: 'Houston Food Bank Distribution' matches your skills!",
            date: new Date(Date.now() - 1000 * 60 * 30).toLocaleString() // 30 minutes ago
          },
          {
            id: 2,
            message: "Your upcoming event 'Senior Center Visit' is tomorrow. Don't forget to attend!",
            date: new Date(Date.now() - 1000 * 60 * 60 * 2).toLocaleString() // 2 hours ago
          },
          {
            id: 3,
            message: "You've received positive feedback for your participation in 'Beach Cleanup'!",
            date: new Date(Date.now() - 1000 * 60 * 60 * 24).toLocaleString() // 1 day ago
          }
        ]);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, [mounted, volunteerEmail]);

  if (!mounted) {
    return null; // or a loading spinner
  }

  return (
    <div className="container-page">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Welcome, {volunteerName}</h1>
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
            <div className="feature-card">
              <h2 className="text-xl font-semibold mb-6">Your Profile</h2>
              {volunteerProfile && (
                <div className="space-y-6">
                  <div className="bg-secondary/5 p-4 rounded-lg">
                    <h3 className="font-medium text-primary mb-3">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {volunteerProfile.skills.map((skill, index) => (
                        <span 
                          key={index} 
                          className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-secondary/5 p-4 rounded-lg">
                    <h3 className="font-medium text-primary mb-3">Availability</h3>
                    <div className="space-y-3">
                      {volunteerProfile.availability.map((slot, index) => (
                        <div key={index} className="border-l-2 border-primary/30 pl-3">
                          <p className="font-medium text-sm">{slot.date}</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {slot.timeSlots.map((time, idx) => (
                              <span 
                                key={idx}
                                className="px-2 py-1 bg-secondary/10 rounded-md text-xs text-secondary-foreground"
                              >
                                {time}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {volunteerProfile.preferences && (
                    <div className="bg-secondary/5 p-4 rounded-lg">
                      <h3 className="font-medium text-primary mb-3">Preferences</h3>
                      <p className="text-sm text-secondary-foreground">{volunteerProfile.preferences}</p>
                    </div>
                  )}

                  <div className="mt-4 text-right">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => router.push('/volunteer/profile')}
                      className="text-sm hover:opacity-90"
                    >
                      Edit Profile
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <MatchedEvents userProfile={volunteerProfile} />
            <div className="feature-card">
              <h2 className="text-xl font-semibold mb-6">Notifications</h2>
              <div className="space-y-4">
                {notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className="p-4 bg-secondary/5 rounded-lg border-l-4 border-primary transition-all hover:translate-x-1"
                  >
                    <p className="text-sm">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-2">{notification.date}</p>
                  </div>
                ))}
                {notifications.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">No new notifications</p>
                )}
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