"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface HistoryEntry {
  id: string;
  eventName: string;
  participationDate: string;
  status: 'Pending' | 'Participated' | 'Canceled' | 'No Show';
  feedback?: string;
  hours?: number;
}

export default function VolunteerHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const email = localStorage.getItem('userEmail');
      const response = await fetch('/api/volunteer-history', {
        headers: {
          'x-user-email': email || ''
        }
      });

      if (!response.ok) throw new Error('Failed to fetch history');

      const data = await response.json();
      setHistory(data);
    } catch (error) {
      setError('Failed to load history');
      console.error('History fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    const baseClass = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "Participated":
        return `${baseClass} bg-green-100 text-green-700`;
      case "Canceled":
        return `${baseClass} bg-red-100 text-red-700`;
      case "No Show":
        return `${baseClass} bg-gray-100 text-gray-700`;
      case "Pending":
        return `${baseClass} bg-yellow-100 text-yellow-700`;
      default:
        return baseClass;
    }
  };

  if (loading) return <div className="text-center p-4">Loading history...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Volunteer History</h2>
      <Button
        onClick={async () => {
          const email = localStorage.getItem('userEmail');
          try {
            const response = await fetch('/api/volunteer-history', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-user-email': email || ''
              },
              body: JSON.stringify({
                eventId: '1', // Using the test event ID from your events array
                eventName: 'Houston Food Bank',
                status: 'Pending',
                participationDate: new Date()
              })
            });

            if (response.ok) {
              fetchHistory(); // Refresh the history list
            }
          } catch (error) {
            console.error('Failed to create history:', error);
          }
        }}
      >
        Test Add History
      </Button>
      {history.length === 0 ? (
        <p className="text-gray-500">No volunteer history yet.</p>
      ) : (
        <div className="grid gap-4">
          {history.map((entry) => (
            <div key={entry.id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{entry.eventName}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(entry.participationDate).toLocaleDateString()}
                  </p>
                  {entry.hours && (
                    <p className="text-sm text-gray-600">
                      Hours: {entry.hours}
                    </p>
                  )}
                  {entry.feedback && (
                    <p className="text-sm text-gray-600 mt-2">
                      Feedback: {entry.feedback}
                    </p>
                  )}
                </div>
                <span className={getStatusBadgeClass(entry.status)}>
                  {entry.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
