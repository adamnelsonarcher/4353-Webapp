"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HistoryEntry {
  id: string;
  eventName: string;
  participationDate: {
    seconds: number;
    nanoseconds: number;
  } | string;
  status: 'Pending' | 'Participated' | 'Canceled' | 'No Show';
  feedback?: string;
  hours?: number;
}

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case 'participated':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'canceled':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'no show':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusDescription = (status: string) => {
    switch (status.toLowerCase()) {
      case 'participated':
        return 'You successfully participated in this event';
      case 'pending':
        return 'Your participation is awaiting confirmation';
      case 'canceled':
        return 'You or the organization canceled this participation';
      case 'no show':
        return 'You were marked as not showing up for this event';
      default:
        return 'Status unknown';
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusStyles(status)}`}>
            {status}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getStatusDescription(status)}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

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

  if (loading) return <div className="text-center p-4">Loading history...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Volunteer History</CardTitle>
          <CardDescription>Your past and upcoming volunteer activities</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading history...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-4">{error}</div>
          ) : history.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">No history entries found</div>
          ) : (
            <div className="grid gap-4">
              {history.map((entry, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-medium">{entry.eventName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {typeof entry.participationDate === 'string' 
                          ? new Date(entry.participationDate).toLocaleDateString()
                          : new Date(entry.participationDate.seconds * 1000).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                        }
                      </p>
                    </div>
                    <StatusBadge status={entry.status} />
                  </div>
                  <div className="mt-4 space-y-2">
                    {entry.feedback && (
                      <p className="text-sm">
                        <span className="font-medium">Feedback:</span>{' '}
                        <span className="text-muted-foreground">{entry.feedback}</span>
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
