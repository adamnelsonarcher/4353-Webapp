"use client";

import { useState, useEffect } from "react";

interface VolunteerHistoryEntry {
  eventName: string;
  eventDescription: string;
  location: string;
  requiredSkills: string;
  urgency: "Low" | "Medium" | "High";
  eventDate: string;
  status: "Participated" | "Canceled" | "No Show" | "Pending";
}

const VolunteerHistory = () => {
  const [history, setHistory] = useState<VolunteerHistoryEntry[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const email = localStorage.getItem('userEmail');
        const response = await fetch('/api/events?type=history', {
          headers: {
            'x-user-email': email || ''
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setHistory(data);
        }
      } catch (error) {
        console.error('Failed to fetch history:', error);
      }
    };

    fetchHistory();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-US");
  };

  const getUrgencyBadgeClass = (urgency: string) => {
    const baseClass = "px-2 py-1 rounded-full text-xs font-medium";
    switch (urgency) {
      case "High":
        return `${baseClass} bg-red-100 text-red-700`;
      case "Medium":
        return `${baseClass} bg-yellow-100 text-yellow-700`;
      case "Low":
        return `${baseClass} bg-green-100 text-green-700`;
      default:
        return baseClass;
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

  return (
    <div className="feature-card overflow-hidden">
      <h2 className="text-xl font-semibold mb-6">Volunteer History</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-secondary/5 rounded-lg">
          <thead>
            <tr className="bg-secondary/20 text-secondary-foreground border-b border-secondary/10">
              <th className="p-4 text-left font-medium border-r border-secondary/10 last:border-r-0">Event Name</th>
              <th className="p-4 text-left font-medium border-r border-secondary/10 last:border-r-0">Event Description</th>
              <th className="p-4 text-left font-medium border-r border-secondary/10 last:border-r-0">Location</th>
              <th className="p-4 text-left font-medium border-r border-secondary/10 last:border-r-0">Required Skills</th>
              <th className="p-4 text-left font-medium border-r border-secondary/10 last:border-r-0">Urgency</th>
              <th className="p-4 text-left font-medium whitespace-nowrap border-r border-secondary/10 last:border-r-0">Event Date</th>
              <th className="p-4 text-left font-medium border-r border-secondary/10 last:border-r-0">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary/10">
            {history.map((entry, index) => (
              <tr key={index} className="hover:bg-secondary/10 transition-colors">
                <td className="p-4 border-r border-secondary/10">{entry.eventName}</td>
                <td className="p-4 max-w-md border-r border-secondary/10">
                  <div className="line-clamp-2">{entry.eventDescription}</div>
                </td>
                <td className="p-4 border-r border-secondary/10">{entry.location}</td>
                <td className="p-4 border-r border-secondary/10">{entry.requiredSkills}</td>
                <td className="p-4 border-r border-secondary/10">
                  <span className={getUrgencyBadgeClass(entry.urgency)}>
                    {entry.urgency}
                  </span>
                </td>
                <td className="p-4 whitespace-nowrap border-r border-secondary/10">{formatDate(entry.eventDate)}</td>
                <td className="p-4">
                  <span className={getStatusBadgeClass(entry.status)}>
                    {entry.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VolunteerHistory;
