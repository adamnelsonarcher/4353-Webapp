"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

interface MatchedEvent {
  id: string;
  eventName: string;
  eventDescription: string;
  location: string;
  requiredSkills: string[];
  urgency: 'Low' | 'Medium' | 'High';
  eventDate: string;
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

interface MatchedEventsProps {
  userProfile: VolunteerProfile | null;
}

export default function MatchedEvents({ userProfile }: MatchedEventsProps) {
  const [matchedEvents, setMatchedEvents] = useState<MatchedEvent[]>([]);

  useEffect(() => {
    const fetchMatches = async () => {
      if (!userProfile) return;

      try {
        // Fetch all events
        const eventsQuery = query(collection(db, 'events'));
        const eventsSnapshot = await getDocs(eventsQuery);
        
        // Filter events based on skills match
        const allEvents = eventsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as MatchedEvent[];

        // Match events based on skills
        const matched = allEvents.filter(event => {
          // Ensure requiredSkills is an array
          const eventSkills = Array.isArray(event.requiredSkills) ? event.requiredSkills : [];
          return eventSkills.some(skill => 
            userProfile.skills.includes(skill)
          );
        });

        setMatchedEvents(matched);
      } catch (error) {
        console.error('Failed to fetch matches:', error);
      }
    };

    fetchMatches();
  }, [userProfile]);

  const handleAcceptMatch = async (eventId: string) => {
    if (!userProfile) return;

    try {
      // Add to volunteer history
      await fetch('/api/volunteer-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': userProfile.email
        },
        body: JSON.stringify({
          eventId,
          eventName: matchedEvents.find(e => e.id === eventId)?.eventName
        })
      });

      // Remove from matched events
      setMatchedEvents(prev => 
        prev.filter(event => event.id !== eventId)
      );
    } catch (error) {
      console.error('Failed to accept match:', error);
    }
  };

  return (
    <div className="feature-card">
      <h2 className="text-xl font-semibold mb-6">Matched Events</h2>
      <div className="space-y-4">
        {matchedEvents.map(event => (
          <div key={event.id} className="p-4 border border-secondary rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{event.eventName}</h3>
                <p className="text-sm text-muted-foreground">{event.eventDescription}</p>
                <p className="text-sm mt-2">Location: {event.location}</p>
                <p className="text-sm">Date: {new Date(event.eventDate).toLocaleDateString()}</p>
                <div className="mt-2">
                  <p className="text-sm font-medium">Required Skills:</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {event.requiredSkills.map((skill, index) => (
                      <span 
                        key={index}
                        className={`px-2 py-1 rounded-md text-xs ${
                          userProfile?.skills.includes(skill)
                            ? 'bg-green-100 text-green-800'
                            : 'bg-secondary/10'
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <Button
                onClick={() => handleAcceptMatch(event.id)}
                className="ml-4"
              >
                Accept Match
              </Button>
            </div>
          </div>
        ))}
        {matchedEvents.length === 0 && (
          <p className="text-center text-muted-foreground">No matched events found</p>
        )}
      </div>
    </div>
  );
} 