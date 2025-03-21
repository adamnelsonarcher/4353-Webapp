export interface FirebaseUser {
  email: string;
  password: string; // Will be hashed
  userType: 'volunteer' | 'organization';
  createdAt: Date;
}

export interface FirebaseProfile {
  email: string;
  fullName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  skills: string[];
  preferences: string;
  availability: Array<{date: string, timeSlots: string[]}>;
  createdAt: Date;
  updatedAt: Date;
}

export interface FirebaseEvent {
  id: string;
  eventName: string;
  eventDescription: string;
  location: string;
  requiredSkills: string[];
  urgency: 'Low' | 'Medium' | 'High';
  eventDate: string;
  organizerEmail: string;
  status: 'Active' | 'Cancelled' | 'Completed';
  createdAt: Date;
  updatedAt: Date;
}

export interface FirebaseVolunteerHistory {
  volunteerId: string;
  eventId: string;
  eventName: string;
  participationDate: Date;
  status: 'Pending' | 'Participated' | 'Canceled' | 'No Show';
  createdAt: Date;
  updatedAt: Date;
  feedback?: string;
  hours?: number;
} 