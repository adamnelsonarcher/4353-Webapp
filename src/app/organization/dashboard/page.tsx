'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OrganizationDashboard() {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('organizationLoggedIn');
    if (!isLoggedIn) {
      router.push('/organization/login');
    }
  }, [router]);

  return (
    <div className="container-page">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Welcome, [Organization Name]</h1>
          <button 
            onClick={() => {
              localStorage.removeItem('organizationLoggedIn');
              router.push('/organization/login');
            }}
            className="text-sm text-red-500 hover:text-red-700"
          >
            Logout
          </button>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Event Management */}
          <div className="feature-card">
            <h2 className="text-xl font-semibold mb-4">Event Management</h2>
            <button className="text-primary hover:underline">Create New Event</button>
            <p className="text-secondary-foreground mt-2">No active events</p>
          </div>
          
          {/* Volunteer Matching */}
          <div className="feature-card">
            <h2 className="text-xl font-semibold mb-4">Volunteer Matching</h2>
            <button className="text-primary hover:underline">Match Volunteers</button>
            <p className="text-secondary-foreground mt-2">No pending matches</p>
          </div>
          
          {/* Notifications */}
          <div className="feature-card">
            <h2 className="text-xl font-semibold mb-4">Notifications</h2>
            <p className="text-secondary-foreground">No new notifications</p>
          </div>

          {/* Volunteer History */}
          <div className="feature-card">
            <h2 className="text-xl font-semibold mb-4">Volunteer History</h2>
            <p className="text-secondary-foreground">No volunteer history available</p>
          </div>
          
          {/* Quick Stats */}
          <div className="feature-card">
            <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
            <div className="space-y-2">
              <p className="text-secondary-foreground">Active Events: 0</p>
              <p className="text-secondary-foreground">Total Volunteers: 0</p>
              <p className="text-secondary-foreground">Pending Applications: 0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 