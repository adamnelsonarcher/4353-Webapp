'use client';

import React, { useState } from 'react';

const volunteerData = [
  { id: 1, name: 'John Doe', skills: ['Cooking', 'Teaching'], preferences: ['day'] },
  { id: 2, name: 'Jane Smith', skills: ['Teaching', 'Coding'], preferences: ['night'] },
  // Add more volunteers as needed
];

const eventData = [
  { id: 1, name: 'Food Drive', requiredSkills: ['Cooking'], preferences: 'day' },
  { id: 2, name: 'Coding Workshop', requiredSkills: ['Coding'], preferences: 'night' },
  // Add more events as needed
];

const VolunteerMatching = () => {
  const [selectedVolunteer, setSelectedVolunteer] = useState<{ id: number; name: string; skills: string[]; preferences: string[] } | null>(null);
  const [matchedEvent, setMatchedEvent] = useState('');

  const handleVolunteerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const volunteerId = Number(e.target.value);
    const volunteer = volunteerData.find(v => v.id === volunteerId);
    setSelectedVolunteer(volunteer || null);

    if (volunteer) {
      // Filter events that match volunteer's skills and availability
      const matchedEvents = eventData.filter(event =>
        volunteer.skills.some(skill => event.requiredSkills.includes(skill)) &&
        volunteer.preferences.includes(event.preferences)
      );
      setMatchedEvent(matchedEvents[0]?.name || 'No matching events');
    }
  };

  return (
    <div className="flex justify-center">
      <div className="w-full px-4 py-8">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-center">Volunteer Matching Form</h1>

          <form>
            {/* Volunteer Name */}
            <div className="mb-6 flex justify-center"> 
              <div className="w-1/2">
                <label htmlFor="volunteer" className="block text-sm font-medium text-white text-center"> 
                  Volunteer Name
                </label>
                <select
                  id="volunteer"
                  name="volunteer"
                  onChange={handleVolunteerChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                >
                  <option value="">Select Volunteer</option>
                  {volunteerData.map(volunteer => (
                    <option key={volunteer.id} value={volunteer.id} className="text-black">
                      {volunteer.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Matched Event */}
            {selectedVolunteer && (
              <div className="mb-6 flex justify-center"> 
                <div className="w-1/2"> 
                  <label htmlFor="event" className="block text-sm font-medium text-white text-center">
                    Matched Event
                  </label>
                  <input
                    id="event"
                    name="event"
                    type="text"
                    value={matchedEvent}
                    disabled
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-black"
                  />
                </div>
              </div>
            )}

            <div className="mb-6 flex justify-center">
              <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">
                Submit Match
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VolunteerMatching;
