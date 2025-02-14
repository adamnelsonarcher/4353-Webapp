"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function eventForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    eventName: "",
    description: "",
    location: "",
    requiredSkills: [],
    urgency: "",
    eventDate: "",
  });

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    console.log("Event Created: ", formData);
    router.push("/organization/dashboard");
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div className="container-centered">
          <div className="form-container">
            <form onSubmit={handleSubmit} className="space-y-4">
              <h1 className="text-xl font-semibold mb-4 items-center">
                Create Event Management Form
              </h1>
              {/* Event Name */}
              <div>
                <label htmlFor="eventName" className="block font-medium mb-1">
                  Event Name
                </label>
                <input
                  type="text"
                  id="eventName"
                  name="eventName"
                  value={formData.eventName}
                  onChange={handleChange}
                  maxLength={100}
                  className="w-1/2 px-2 py-1/2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* Description */}
              <div>
                <label htmlFor="description" className="block font-medium mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-1/2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* Location */}
              <div>
                <label htmlFor="location" className="block font-medium mb-1">
                  Location
                </label>
                <textarea
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-1/2 px-1 py-1/2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* Required Skills (Multi-Select Dropdown) */}
              <div>
                <label
                  htmlFor="requiredSkills"
                  className="block font-medium mb-1"
                >
                  Required Skills
                </label>
                <select
                  id="requiredSkills"
                  name="requiredSkills"
                  multiple
                  onChange={handleChange}
                  className="w-1/2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Leadership">Leadership</option>
                  <option value="Communication">Communication</option>
                  <option value="Problem-Solving">Problem-Solving</option>
                </select>
              </div>
              {/* Urgency */}
              <div>
                <label htmlFor="urgency" className="block font-medium mb-1">
                  Urgency
                </label>
                <select
                  id="urgency"
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleChange}
                  className="w-1/4 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Urgency</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              {/* Event Date */}
              <div>
                <label htmlFor="eventDate" className="block font-medium mb-1">
                  Event Date
                </label>
                <input
                  type="date"
                  id="eventDate"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  className="w-1/4 px-1/4 py-1/2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button type="submit">Create Event</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
