'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import ReportGenerator from '@/components/ReportGenerator';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Badge } from "@/components/ui/badge";

interface Event {
  id?: string;
  eventName: string;
  eventDescription: string;
  location: string;
  requiredSkills: string[];
  urgency: 'Low' | 'Medium' | 'High';
  eventDate: string;
  status?: 'Active' | 'Cancelled' | 'Completed';
  organizerEmail?: string;
  createdAt?: any;
  updatedAt?: any;
}

interface Volunteer {
  name: string;
  skills: string[];
  preferences: string[];
}

interface MatchedEvent {
  eventName: string;
  description: string;
  skills: string[];
}

interface Notification {
  id: number;
  message: string;
  date: string;
}

export default function OrganizationDashboard() {
  const router = useRouter();
  const [orgName, setOrgName] = useState('Organization');
  const [orgEmail, setOrgEmail] = useState('');
  const [mounted, setMounted] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showMatchingForm, setShowMatchingForm] = useState(false);
  const [firstOpenedForm, setFirstOpenedForm] = useState<'event' | 'matching' | null>(null);
  const [historyError, setHistoryError] = useState('');
  const [volunteerHistory, setVolunteerHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  const [eventFormData, setEventFormData] = useState<Event>({
    eventName: '',
    eventDescription: '',
    location: '',
    requiredSkills: [],
    urgency: 'Medium',
    eventDate: '',
  });

  const [events, setEvents] = useState<Event[]>([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [matchedEvents, setMatchedEvents] = useState<MatchedEvent[]>([]);
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [stats, setStats] = useState({
    activeEvents: 0,
    totalVolunteers: 0,
    pendingApplications: 0
  });

  const [orgProfile, setOrgProfile] = useState({
    orgName: '',
    email: '',
    phone: '',
    address: '',
    description: '',
    createdAt: null as { seconds: number; nanoseconds: number } | null
  });

  const TRANSITION_DURATION = 300;

  const fetchHistory = async () => {
    if (!mounted || !orgEmail) return;
    
    try {
      setHistoryLoading(true);
      setHistoryError('');
      const response = await fetch('/api/organization/volunteer-history', {
        headers: {
          'x-user-email': orgEmail
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch history');
      }
      
      const data = await response.json();
      setVolunteerHistory(data);
    } catch (error) {
      console.error('Failed to fetch history:', error);
      setHistoryError('Failed to load volunteer history. Please try again later.');
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (!mounted || !orgEmail) return;
    fetchHistory();
  }, [mounted, orgEmail]);

  useEffect(() => {
    setMounted(true);
    const email = window.localStorage.getItem('organizationEmail');
    const isLoggedIn = window.localStorage.getItem('organizationLoggedIn');
    
    setOrgEmail(email || '');
    
    if (!isLoggedIn) {
      router.push('/organization/login');
      return;
    }
  }, [router]);

  useEffect(() => {
    if (!mounted) return;

    const fetchData = async () => {
      try {
        const q = query(
          collection(db, 'users'),
          where('email', '==', orgEmail)
        );
        
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const orgData = querySnapshot.docs[0].data();
          setOrgName(orgData.orgName || 'Organization');
        }

        const response = await fetch('/api/events?type=organization', {
          headers: {
            'x-user-email': orgEmail
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch events');
        
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setError('Failed to load data');
      }
    };

    if (orgEmail) {
      fetchData();
    }
  }, [mounted, orgEmail]);

  useEffect(() => {
    if (!mounted || !orgEmail) return;

    const fetchStats = async () => {
      try {
        const response = await fetch('/api/organization/stats', {
          headers: {
            'x-user-email': orgEmail
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch stats');
        
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
  }, [mounted, orgEmail]);

  useEffect(() => {
    if (!mounted || !orgEmail) return;

    const fetchOrgProfile = async () => {
      try {
        const response = await fetch('/api/organization/profile', {
          headers: {
            'x-user-email': orgEmail
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch profile');
        
        const data = await response.json();
        setOrgProfile(data);
        setOrgName(data.orgName);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };

    fetchOrgProfile();
  }, [mounted, orgEmail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': orgEmail
        },
        body: JSON.stringify(eventFormData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create event');
      }

      const data = await response.json();
      setEvents(prev => [...prev, data.event]);
      setEventFormData({
        eventName: '',
        eventDescription: '',
        location: '',
        requiredSkills: [],
        urgency: 'Medium',
        eventDate: '',
      });
      setShowEventForm(false);
    } catch (error) {
      console.error('Failed to create event:', error);
      setError(error instanceof Error ? error.message : 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const handleEventFormClick = () => {
    if (!showEventForm && !showMatchingForm) {
      setFirstOpenedForm('event');
      setShowEventForm(true);
    } else if (showEventForm) {
      setShowEventForm(false);
      setFirstOpenedForm(showMatchingForm ? 'matching' : null);
    } else {
      setShowEventForm(true);
    }
  };

  const handleMatchingFormClick = () => {
    if (!showMatchingForm && !showEventForm) {
      setFirstOpenedForm('matching');
      setShowMatchingForm(true);
    } else if (showMatchingForm) {
      setShowMatchingForm(false);
      setFirstOpenedForm(showEventForm ? 'event' : null);
    } else {
      setShowMatchingForm(true);
    }
  };

  const handleVolunteerSelect = (volunteerId: string) => {
    // This would normally come from an API, using mock data for now
    const mockVolunteerData: Record<string, Volunteer> = {
      "1": {
        name: "John Doe",
        skills: ["deploy", "code"],
        preferences: ["night"]
      },
      "2": {
        name: "Jane Smith",
        skills: ["packing", "assisting"],
        preferences: ["morning"]
      }
    };

    const mockMatchedEvents: Record<string, MatchedEvent[]> = {
      "1": [
        {
          eventName: "Tech Workshop",
          description: "Teaching basic coding skills",
          skills: ["code", "teaching"]
        }
      ],
      "2": [
        {
          eventName: "Blood Drive",
          description: "Saving lives",
          skills: ["packing", "assisting"]
        },
        {
          eventName: "Donation",
          description: "Donate",
          skills: ["packing", "assisting"]
        }
      ]
    };

    setSelectedVolunteer(mockVolunteerData[volunteerId]);
    setMatchedEvents(mockMatchedEvents[volunteerId] || []);
  };

  if (!mounted) {
    return null; // or a loading spinner
  }

  return (
    <div className="container-page">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Welcome, {orgName}</h1>
            <p className="text-secondary-foreground mt-1">{orgEmail}</p>
          </div>
          <Button 
            variant="secondary"
            onClick={() => {
              window.localStorage.removeItem('organizationLoggedIn');
              window.localStorage.removeItem('organizationEmail');
              router.push('/');
            }}
            className="hover:opacity-90 transition-opacity"
          >
            Logout
          </Button>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Organization Profile */}
          <div className="feature-card">
            <h2 className="text-xl font-semibold mb-4">Organization Profile</h2>
            <div className="space-y-4">
              <div className="p-4 bg-secondary/5 rounded-lg">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-primary"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <p className="text-sm">
                      <span className="font-medium">Phone:</span>{' '}
                      {orgProfile.phone || 'Not provided'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-primary"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm">
                      <span className="font-medium">Address:</span>{' '}
                      {orgProfile.address || 'Not provided'}
                    </p>
                  </div>
                  {orgProfile.createdAt && (
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-primary"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm">
                        <span className="font-medium">Member since:</span>{' '}
                        {new Date(orgProfile.createdAt?.seconds * 1000).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
                {orgProfile.description && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm">
                      <span className="font-medium">About:</span><br />
                      {orgProfile.description}
                    </p>
                  </div>
                )}
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="w-full"
                onClick={() => {/* TODO: Add edit profile functionality */}}
              >
                Edit Profile
              </Button>
            </div>
          </div>
          
          {/* Event Management */}
          <div className={`feature-card transition-all duration-300 ease-in-out ${
            showEventForm ? 'col-span-full row-span-2 h-auto' : 'h-[200px]'
          } ${firstOpenedForm === 'event' ? 'order-first' : 'order-none'}`}>
            <h2 className="text-xl font-semibold mb-4">Event Management</h2>
            <Button 
              onClick={handleEventFormClick}
              variant="primary"
              className="hover:opacity-90 transition-opacity"
            >
              {showEventForm ? 'Hide Event Form' : 'Create New Event'}
            </Button>
            
            <div className={`
              mt-4 overflow-hidden transition-all duration-300 ease-in-out
              ${showEventForm ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}
            `}>
              <div className="p-4 bg-secondary/10 rounded-lg">
                <form onSubmit={handleSubmit} className="space-y-4">
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
                      value={eventFormData.eventDescription}
                      onChange={(e) => setEventFormData({...eventFormData, eventDescription: e.target.value})}
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
                      onChange={(e) => setEventFormData({...eventFormData, urgency: e.target.value as 'Low' | 'Medium' | 'High'})}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
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
            </div>
          </div>
          
          {/* Volunteer Matching */}
          <div className={`feature-card transition-all duration-300 ease-in-out ${
            showMatchingForm ? 'col-span-full row-span-2 h-auto' : 'h-[200px]'
          } ${firstOpenedForm === 'matching' ? 'order-first' : 'order-none'}`}>
            <h2 className="text-xl font-semibold mb-4">Volunteer Matching</h2>
            <Button 
              onClick={handleMatchingFormClick}
              variant="primary"
              className="hover:opacity-90 transition-opacity"
            >
              {showMatchingForm ? 'Hide Matching Form' : 'Match Volunteers'}
            </Button>

            <div className={`
              mt-4 overflow-hidden transition-all duration-300 ease-in-out
              ${showMatchingForm ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}
            `}>
              <div className="p-4 bg-secondary/10 rounded-lg">
                <div className="space-y-4">
                  <div>
                    <label className="block font-medium mb-1">Select a Volunteer</label>
                    <select 
                      className="form-input w-full"
                      onChange={(e) => handleVolunteerSelect(e.target.value)}
                      defaultValue=""
                    >
                      <option value="" disabled>Select a Volunteer</option>
                      <option value="1">John Doe</option>
                      <option value="2">Jane Smith</option>
                    </select>
                  </div>

                  {selectedVolunteer && (
                    <div className="mt-6 space-y-4">
                      <div className="bg-background p-4 rounded-lg">
                        <h3 className="text-lg font-medium text-primary mb-2">
                          {selectedVolunteer.name}
                        </h3>
                        <div className="space-y-2">
                          <p className="text-sm">
                            <span className="font-medium">Skills:</span>{' '}
                            {selectedVolunteer.skills.join(', ')}
                          </p>
                          <p className="text-sm">
                            <span className="font-medium">Preferences:</span>{' '}
                            {selectedVolunteer.preferences.join(', ')}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium">Matching Events</h4>
                        <div className="space-y-2">
                          {matchedEvents.map((event, index) => (
                            <div 
                              key={index}
                              className="bg-background p-4 rounded-lg hover:bg-secondary/5 transition-colors"
                            >
                              <h5 className="font-medium">{event.eventName}</h5>
                              <p className="text-sm text-secondary-foreground">{event.description}</p>
                              <p className="text-sm mt-1">
                                <span className="font-medium">Required Skills:</span>{' '}
                                {event.skills.join(', ')}
                              </p>
                            </div>
                          ))}
                          {matchedEvents.length === 0 && (
                            <p className="text-secondary-foreground">No matching events found</p>
                          )}
                        </div>
                      </div>

                      <Button 
                        type="button" 
                        variant="primary"
                        className="w-full hover:opacity-90 transition-opacity"
                        disabled={matchedEvents.length === 0}
                      >
                        Confirm Match
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Notifications */}
          <div className="feature-card h-[200px]">
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

          {/* Quick Stats */}
          <div className="feature-card">
            <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-secondary/5 rounded-lg hover:bg-secondary/10 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-primary"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">Total Volunteers</span>
                </div>
                <span className="text-2xl font-semibold">{stats.totalVolunteers}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary/5 rounded-lg hover:bg-secondary/10 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">Active Events</span>
                </div>
                <span className="text-2xl font-semibold">{stats.activeEvents}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary/5 rounded-lg hover:bg-secondary/10 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-yellow-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">Pending Applications</span>
                </div>
                <span className="text-2xl font-semibold">{stats.pendingApplications}</span>
              </div>
            </div>
          </div>

          {/* Report Generation */}
          <div className="feature-card">
            <ReportGenerator />
          </div>

          {/* Volunteer History - Now full width at the bottom */}
          <div className="feature-card col-span-full">
            <h2 className="text-xl font-semibold mb-4">Volunteer History</h2>
            {historyLoading ? (
              <div className="text-center py-8">
                <p className="text-secondary-foreground">Loading volunteer history...</p>
              </div>
            ) : historyError ? (
              <div className="text-center py-8">
                <p className="text-red-500">{historyError}</p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={fetchHistory}
                  className="mt-4"
                >
                  Try Again
                </Button>
              </div>
            ) : volunteerHistory.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-secondary-foreground">No volunteer history available</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {volunteerHistory.map((volunteer: any) => (
                  <div 
                    key={volunteer.id}
                    className="p-4 bg-secondary/5 rounded-lg"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-medium">{volunteer.name}</h3>
                        <p className="text-sm text-secondary-foreground">{volunteer.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">Total Hours: {volunteer.totalHours}</p>
                        <p className="text-xs text-secondary-foreground">
                          {volunteer.completedEvents} completed / {volunteer.eventsParticipated} total events
                        </p>
                      </div>
                    </div>

                    {volunteer.skills.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium mb-2">Skills:</p>
                        <div className="flex flex-wrap gap-2">
                          {volunteer.skills.map((skill: string, index: number) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs bg-secondary/10 rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Recent Activity:</p>
                      <div className="space-y-2">
                        {volunteer.history.slice(0, 3).map((entry: any) => (
                          <div
                            key={entry.id}
                            className="flex justify-between items-center p-2 bg-background rounded"
                          >
                            <div>
                              <p className="text-sm font-medium">{entry.eventName}</p>
                              <p className="text-xs text-secondary-foreground">
                                {new Date(entry.participationDate.seconds * 1000).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={
                                entry.status === 'Completed' ? 'default' :
                                entry.status === 'Pending' ? 'secondary' :
                                entry.status === 'Canceled' ? 'destructive' :
                                'outline'
                              }>
                                {entry.status}
                              </Badge>
                              {entry.hours > 0 && (
                                <span className="text-xs text-secondary-foreground">
                                  {entry.hours}h
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 