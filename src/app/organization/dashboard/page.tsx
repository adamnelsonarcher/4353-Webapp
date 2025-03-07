'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";

interface Event {
  id?: string;
  eventName: string;
  eventDescription: string;
  location: string;
  requiredSkills: string[];
  urgency: 'Low' | 'Medium' | 'High';
  eventDate: string;
  status?: 'Pending' | 'Participated' | 'Canceled' | 'No Show';
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

  const TRANSITION_DURATION = 300;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const email = localStorage.getItem('organizationEmail');
        const response = await fetch('/api/events', {
          headers: {
            'x-user-email': email || ''
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setEvents(data);
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    };

    const isLoggedIn = localStorage.getItem('organizationLoggedIn');
    if (isLoggedIn) {
      fetchEvents();
    }
  }, []);

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields first
    if (!eventFormData.eventName || !eventFormData.eventDescription || 
        !eventFormData.location || !eventFormData.requiredSkills.length || 
        !eventFormData.urgency || !eventFormData.eventDate) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate field lengths
    if (eventFormData.eventName.length > 100) {
      alert('Event name must be 100 characters or less');
      return;
    }
    if (eventFormData.eventDescription.length > 500) {
      alert('Event description must be 500 characters or less');
      return;
    }
    if (eventFormData.location.length > 200) {
      alert('Location must be 200 characters or less');
      return;
    }

    try {
      const email = localStorage.getItem('organizationEmail');
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': email || ''
        },
        body: JSON.stringify(eventFormData)
      });

      const data = await response.json();

      if (response.ok) {
        setEvents(prev => [...prev, data.event]);
        setShowEventForm(false);
        setEventFormData({
          eventName: '',
          eventDescription: '',
          location: '',
          requiredSkills: [],
          urgency: 'Medium',
          eventDate: ''
        });
      } else {
        alert(data.error || 'Failed to create event');
      }
    } catch (error) {
      console.error('Failed to create event:', error);
      alert('Failed to create event. Please try again.');
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
          <div className={`feature-card h-[200px] ${
            firstOpenedForm ? 'order-last' : 'order-none'
          }`}>
            <h2 className="text-xl font-semibold mb-4">Volunteer History</h2>
            <p className="text-secondary-foreground">No volunteer history available</p>
          </div>
          
          {/* Quick Stats */}
          <div className={`feature-card h-[200px] ${
            firstOpenedForm ? 'order-last' : 'order-none'
          }`}>
            <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
            <div className="space-y-2">
              <p className="text-secondary-foreground">Active Events: {events.length}</p>
              <p className="text-secondary-foreground">Total Volunteers: 0</p>
              <p className="text-secondary-foreground">Pending Applications: 0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 