'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";

interface Event {
  eventName: string;
  description: string;
  location: string;
  requiredSkills: string[];
  urgency: string;
  eventDate: string;
}

export default function OrganizationDashboard() {
  const router = useRouter();
  const [showEventForm, setShowEventForm] = useState(false);
  const [showMatchingForm, setShowMatchingForm] = useState(false);

  const [eventFormData, setEventFormData] = useState<Event>({
    eventName: '',
    description: '',
    location: '',
    requiredSkills: [],
    urgency: '',
    eventDate: '',
  });

  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('organizationLoggedIn');
    console.log(isLoggedIn);
    if (!isLoggedIn) {
      router.push('/organization/login');
    }
  }, [router]);

  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventFormData.eventName || !eventFormData.description || 
        !eventFormData.location || eventFormData.requiredSkills.length === 0 || 
        !eventFormData.urgency || !eventFormData.eventDate) {
      alert('Please fill in all required fields');
      return;
    }
    
    setEvents([...events, eventFormData]);
    setShowEventForm(false);
    setEventFormData({
      eventName: '',
      description: '',
      location: '',
      requiredSkills: [],
      urgency: '',
      eventDate: '',
    });
  };

  return (
    <div className="container-page">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Welcome, [Organization Name]</h1>
          <Button 
            variant="secondary"
            onClick={() => {
              localStorage.removeItem('organizationLoggedIn');
              router.push('/');
            }}
            className="hover:opacity-90 transition-opacity"
          >
            Logout
          </Button>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Event Management */}
          <div className="feature-card">
            <h2 className="text-xl font-semibold mb-4">Event Management</h2>
            <Button 
              onClick={() => setShowEventForm(!showEventForm)} 
              variant="primary"
              className="hover:opacity-90 transition-opacity"
            >
              {showEventForm ? 'Hide Event Form' : 'Create New Event'}
            </Button>
            
            {showEventForm && (
              <div className="mt-4 p-4 bg-secondary/10 rounded-lg">
                <form onSubmit={handleEventSubmit} className="space-y-4">
                  <div>
                    <label className="block font-medium mb-1">
                      Event Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Enter event name"
                      maxLength={100}
                      required
                      value={eventFormData.eventName}
                      onChange={(e) => setEventFormData({...eventFormData, eventName: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block font-medium mb-1">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      className="form-input"
                      placeholder="Event description"
                      required
                      value={eventFormData.description}
                      onChange={(e) => setEventFormData({...eventFormData, description: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block font-medium mb-1">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      className="form-input"
                      placeholder="Event location"
                      required
                      value={eventFormData.location}
                      onChange={(e) => setEventFormData({...eventFormData, location: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block font-medium mb-1">
                      Required Skills <span className="text-red-500">*</span>
                    </label>
                    <select
                      multiple
                      className="form-input"
                      required
                      value={eventFormData.requiredSkills}
                      onChange={(e) => {
                        const selected = Array.from(e.target.selectedOptions, option => option.value);
                        setEventFormData({...eventFormData, requiredSkills: selected});
                      }}
                    >
                      <option value="Leadership">Leadership</option>
                      <option value="Communication">Communication</option>
                      <option value="Problem-Solving">Problem-Solving</option>
                      <option value="Teaching">Teaching</option>
                      <option value="Cooking">Cooking</option>
                      <option value="Coding">Coding</option>
                    </select>
                    <p className="text-sm text-secondary-foreground mt-1">Hold Ctrl/Cmd to select multiple skills</p>
                  </div>
                  
                  <div>
                    <label className="block font-medium mb-1">
                      Urgency <span className="text-red-500">*</span>
                    </label>
                    <select 
                      className="form-input"
                      required
                      value={eventFormData.urgency}
                      onChange={(e) => setEventFormData({...eventFormData, urgency: e.target.value})}
                    >
                      <option value="">Select Urgency</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block font-medium mb-1">
                      Event Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      className="form-input"
                      required
                      value={eventFormData.eventDate}
                      onChange={(e) => setEventFormData({...eventFormData, eventDate: e.target.value})}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    variant="primary"
                    className="w-full hover:opacity-90 transition-opacity"
                  >
                    Create Event
                  </Button>
                </form>
              </div>
            )}
          </div>
          
          {/* Volunteer Matching */}
          <div className="feature-card">
            <h2 className="text-xl font-semibold mb-4">Volunteer Matching</h2>
            <Button 
              onClick={() => setShowMatchingForm(!showMatchingForm)}
              variant="primary"
              className="hover:opacity-90 transition-opacity"
            >
              {showMatchingForm ? 'Hide Matching Form' : 'Match Volunteers'}
            </Button>

            {showMatchingForm && (
              <div className="mt-4 p-4 bg-secondary/10 rounded-lg">
                <form className="space-y-4">
                  <div>
                    <label className="block font-medium mb-1">Select Volunteer</label>
                    <select className="form-input">
                      <option value="">Choose a volunteer</option>
                      <option value="1">John Doe - Teaching, Cooking</option>
                      <option value="2">Jane Smith - Coding, Communication</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium mb-1">Matched Events</label>
                    <select className="form-input" disabled>
                      <option>No matching events found</option>
                    </select>
                  </div>

                  <Button 
                    type="submit" 
                    variant="primary"
                    className="w-full hover:opacity-90 transition-opacity"
                  >
                    Confirm Match
                  </Button>
                </form>
              </div>
            )}
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