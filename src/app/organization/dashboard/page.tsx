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
  const [volunteerHistory, setVolunteerHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  const TRANSITION_DURATION = 300;

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

    const fetchHistory = async () => {
      try {
        setHistoryLoading(true);
        const response = await fetch('/api/organization/volunteer-history', {
          headers: {
            'x-user-email': orgEmail
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch history');
        
        const data = await response.json();
        setVolunteerHistory(data);
      } catch (error) {
        console.error('Failed to fetch history:', error);
      } finally {
        setHistoryLoading(false);
      }
    };

    fetchStats();
    fetchHistory();
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
          <div className={`feature-card h-[200px] ${
            firstOpenedForm ? 'order-last' : 'order-none'
          }`}>
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

          {/* Volunteer History */}
          <div className={`feature-card ${
            firstOpenedForm ? 'order-last' : 'order-none'
          }`}>
            <h2 className="text-xl font-semibold mb-4">Volunteer History</h2>
            {historyLoading ? (
              <p className="text-secondary-foreground">Loading history...</p>
            ) : volunteerHistory.length === 0 ? (
              <p className="text-secondary-foreground">No volunteer history available</p>
            ) : (
              <div className="space-y-4 max-h-[300px] overflow-y-auto">
                {volunteerHistory.map((entry: any) => (
                  <div 
                    key={entry.id}
                    className="p-4 bg-secondary/5 rounded-lg hover:bg-secondary/10 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{entry.eventName}</h3>
                        <p className="text-sm text-secondary-foreground">
                          {entry.volunteerName} ({entry.volunteerEmail})
                        </p>
                      </div>
                      <Badge
                        variant={
                          entry.status === 'Completed' ? 'default' :
                          entry.status === 'Pending' ? 'secondary' :
                          entry.status === 'Canceled' ? 'destructive' :
                          'outline'
                        }
                        className="ml-2"
                      >
                        {entry.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-secondary-foreground">
                      <p>Date: {new Date(entry.participationDate.seconds * 1000).toLocaleDateString()}</p>
                      <p>Hours: {entry.hours}</p>
                      {entry.feedback && (
                        <p className="mt-2">Feedback: {entry.feedback}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Quick Stats */}
          <div className={`feature-card h-[200px] ${
            firstOpenedForm ? 'order-last' : 'order-none'
          }`}>
            <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-2 bg-secondary/5 rounded-lg">
                <span className="text-secondary-foreground">Active Events</span>
                <span className="font-medium">{stats.activeEvents}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-secondary/5 rounded-lg">
                <span className="text-secondary-foreground">Total Volunteers</span>
                <span className="font-medium">{stats.totalVolunteers}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-secondary/5 rounded-lg">
                <span className="text-secondary-foreground">Pending Applications</span>
                <span className="font-medium">{stats.pendingApplications}</span>
              </div>
            </div>
          </div>

          {/* Report Generation */}
          <div className="feature-card">
            <ReportGenerator />
          </div>
        </div>
      </div>
    </div>
  );
} 