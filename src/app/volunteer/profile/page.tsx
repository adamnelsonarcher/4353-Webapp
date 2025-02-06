'use client';
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from 'next/navigation';

const US_STATES = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' }
];

export default function VolunteerProfile() {
  const router = useRouter();
  const [profile, setProfile] = useState({
    fullName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    skills: [] as string[],
    preferences: '',
    availability: [] as Array<{date: string, timeSlots: string[]}>
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
        if (
      profile.fullName &&
      profile.address1 &&
      profile.city &&
      profile.state &&
      profile.zipCode &&
      profile.skills.length > 0 &&
      profile.availability.length > 0
    ) {
      localStorage.setItem('volunteerProfile', JSON.stringify(profile));
      
      localStorage.removeItem('pendingRegistration');
      
      router.push('/volunteer/login');
    } else {
      alert('Please fill in all required fields');
    }
  };

  const timeSlots = [
    "Morning (8AM-12PM)",
    "Afternoon (12PM-4PM)",
    "Evening (4PM-8PM)",
    "Night (8PM-12AM)"
  ];

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    if (!profile.availability.some(a => a.date === date)) {
      setProfile({ 
        ...profile, 
        availability: [...profile.availability, { date, timeSlots: [] }]
      });
    }
  };

  const handleTimeSlotChange = (date: string, timeSlot: string) => {
    setProfile(prev => {
      const newAvailability = prev.availability.map(a => {
        if (a.date === date) {
          return {
            ...a,
            timeSlots: a.timeSlots.includes(timeSlot)
              ? a.timeSlots.filter(t => t !== timeSlot)
              : [...a.timeSlots, timeSlot]
          };
        }
        return a;
      });
      return { ...prev, availability: newAvailability };
    });
  };

  const removeAvailability = (date: string) => {
    setProfile(prev => ({
      ...prev,
      availability: prev.availability.filter(a => a.date !== date)
    }));
  };

  return (
    <div className="container-page">
      <div className="container-centered">
        <div className="form-container">
          <h1 className="heading-primary">Complete Your Profile</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="form-label">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                className="form-input"
                maxLength={50}
                required
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="address1" className="form-label">
                Address Line 1
              </label>
              <input
                type="text"
                id="address1"
                className="form-input"
                maxLength={100}
                required
                value={profile.address1}
                onChange={(e) => setProfile({ ...profile, address1: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="address2" className="form-label">
                Address Line 2 (Optional)
              </label>
              <input
                type="text"
                id="address2"
                className="form-input"
                maxLength={100}
                value={profile.address2}
                onChange={(e) => setProfile({ ...profile, address2: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="form-label">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  className="form-input"
                  maxLength={100}
                  required
                  value={profile.city}
                  onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="state" className="form-label">
                  State
                </label>
                <select 
                  id="state" 
                  className="form-input"
                  required
                  value={profile.state}
                  onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                >
                  <option value="">Select State</option>
                  {US_STATES.map((state) => (
                    <option key={state.code} value={state.code}>{state.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="zipCode" className="form-label">
                ZIP Code
              </label>
              <input
                type="text"
                id="zipCode"
                className="form-input"
                minLength={5}
                maxLength={9}
                required
                pattern="[0-9]*"
                value={profile.zipCode}
                onChange={(e) => setProfile({ ...profile, zipCode: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="skills" className="form-label">
                Skills
              </label>
              <select
                id="skills"
                multiple
                className="form-input h-32"
                required
                value={profile.skills}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, option => option.value);
                  setProfile({ ...profile, skills: selected });
                }}
              >
                <option value="teaching">Teaching</option>
                <option value="medical">Medical</option>
                <option value="technical">Technical</option>
                <option value="administrative">Administrative</option>
                <option value="construction">Construction</option>
                <option value="counseling">Counseling</option>
                <option value="cooking">Cooking</option>
                <option value="driving">Driving</option>
              </select>
              <p className="text-sm text-secondary-foreground mt-1">
                Hold Ctrl/Cmd to select multiple skills
              </p>
            </div>

            <div>
              <label htmlFor="preferences" className="form-label">
                Preferences (Optional)
              </label>
              <textarea
                id="preferences"
                className="form-input"
                rows={3}
                value={profile.preferences}
                onChange={(e) => setProfile({ ...profile, preferences: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="availability" className="form-label">
                Availability
              </label>
              <input
                type="date"
                id="availability"
                className="form-input"
                onChange={handleDateChange}
                min={new Date().toISOString().split('T')[0]}
              />
              
              <div className="mt-4 space-y-4">
                {profile.availability.map(({ date, timeSlots: selectedTimeSlots }) => (
                  <div key={date} className="p-4 border border-secondary rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">
                        {new Date(date).toLocaleDateString(undefined, {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                      <button
                        type="button"
                        className="text-sm text-red-500 hover:text-red-700"
                        onClick={() => removeAvailability(date)}
                      >
                        Remove Day
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {timeSlots.map(timeSlot => (
                        <label
                          key={`${date}-${timeSlot}`}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            checked={selectedTimeSlots.includes(timeSlot)}
                            onChange={() => handleTimeSlotChange(date, timeSlot)}
                            className="rounded border-secondary"
                          />
                          <span className="text-sm">{timeSlot}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button type="submit" variant="primary" className="w-full">
              Save Profile
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
} 