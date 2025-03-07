"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface MatchedEvent {
  id: string;
  eventName: string;
  eventDescription: string;
  location: string;
  requiredSkills: string[];
  urgency: 'Low' | 'Medium' | 'High';
  eventDate: string;
}

export default function MatchedEvents() {
  const [matchedEvents, setMatchedEvents] = useState<MatchedEvent[]>([]);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const email = localStorage.getItem('userEmail');
        const response = await fetch('/api/matching', {
          headers: {
            'x-user-email': email || ''
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setMatchedEvents(data);
        }
      } catch (error) {
        console.error('Failed to fetch matches:', error);
      }
    };

    fetchMatches();
  }, []);

  const handleAcceptMatch = async (eventId: string) => {
    try {
      const email = localStorage.getItem('userEmail');
      const response = await fetch('/api/matching', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': email || ''
        },
        body: JSON.stringify({ eventId })
      });

      if (response.ok) {
        setMatchedEvents(prev => 
          prev.filter(event => event.id !== eventId)
        );
      }
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