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
    const storedHistory = localStorage.getItem("volunteerHistory");
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    } else {
      const demoData: VolunteerHistoryEntry[] = [
        {
          eventName: "Houston Food Bank",
          eventDescription:
            "To provide food assistance to those in need and alleviate hunger in the community.",
          location: "535 Portwall St, Houston, TX 77029",
          requiredSkills: "Lift Heavy Objects, Stand",
          urgency: "Medium",
          eventDate: "03/11/2024",
          status: "Participated",

        },
        {
            eventName: "Homeless Shelter",
            eventDescription:
              "Providing meals, shelter, and support services for individuals experiencing homelessness.",
            location: "101 Homeless Way, Houston, TX 77001",
            requiredSkills: "Empathy, Teamwork, Basic Problem-Solving",
            urgency: "High",
            eventDate: "04/04/2024",
            status: "Participated",
        },
        {
            eventName: "Public Library",
            eventDescription:
              "Hosting a reading event for children in the community to promote literacy and education.",
            location: "4500 Library Ln, Houston, TX 77002",
            requiredSkills: "Communication, Patience, Working with Children",
            urgency: "Low",
            eventDate: "04/19/2024",
            status: "Canceled",
        },
        {
            eventName: "Blood Drive",
            eventDescription:
              "Organizing a blood donation drive to support local hospitals and medial facilities.",
            location: "500 Donation Dr., Houston, TX 77003",
            requiredSkills: "Organization, Attention to Detail",
            urgency: "High",
            eventDate: "4/30/2024",
            status: "No Show",
        },
      ];
      localStorage.setItem("volunteerHistory", JSON.stringify(demoData));
      setHistory(demoData);
    }
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-US");
  };

  return ( 
    <div className="p-6 bg-[#b3b1b1] shadow-lg rounded-lg text-white">
      <h1 className="text-2xl font-semibold mb-4 text-center text-black">
        Volunteer History
      </h1>
      <table className="w-full border border-gray-700 shadow-md rounded-md">
        <thead className="bg-gray-400 text-gray-900">
          <tr>
            <th className="border border-gray-700 p-2">Event Name</th>
            <th className="border border-gray-700 p-2">Event Description</th>
            <th className="border border-gray-700 p-2">Location</th>
            <th className="border border-gray-700 p-2">Required Skills</th>
            <th className="border border-gray-700 p-2">Urgency</th>
            <th className="border border-gray-700 p-2 whitespace-nowrap">Event Date</th> 
            <th className="border border-gray-700 p-2">Status</th>
          </tr>
        </thead>
        <tbody className="bg-gray-300 text-black">
          {history.map((entry, index) => (
            <tr key={index} className="text-center border border-gray-700">
              <td className="border border-gray-700 p-2">{entry.eventName}</td>
              <td className="border border-gray-700 p-2">{entry.eventDescription}</td>
              <td className="border border-gray-700 p-2">{entry.location}</td>
              <td className="border border-gray-700 p-2">{entry.requiredSkills}</td>
              <td
                className={`border border-gray-700 p-2 font-semibold ${
                  entry.urgency === "High"
                    ? "text-red-500"
                    : entry.urgency === "Medium"
                    ? "text-yellow-500"
                    : "text-green-500"
                }`}
              >
                {entry.urgency}
              </td>
              <td className="border border-gray-700 p-2 text-center whitespace-nowrap">
                {formatDate(entry.eventDate)}
              </td>
              <td
                className={`border border-gray-700 p-2 font-semibold ${
                  entry.status === "Participated"
                    ? "text-green-500"
                    : entry.status === "Canceled"
                    ? "text-red-500"
                    : entry.status === "Pending"
                    ? "text-yellow-500"
                    : entry.status === "No Show"
                    ? "text-gray-500"
                    : ""
                    
                }`}
              >
                {entry.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VolunteerHistory;
