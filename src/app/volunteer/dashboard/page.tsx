'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import VolunteerHistory from "./VolunteerHistory";
import { Button } from "@/components/ui/button";

export default function VolunteerDashboard() {
  const router = useRouter();

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