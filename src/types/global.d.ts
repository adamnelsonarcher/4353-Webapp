interface Event {
  id: string;
  eventName: string;
  eventDescription: string;
  location: string;
  requiredSkills: string[];
  urgency: 'Low' | 'Medium' | 'High';
  eventDate: string;
  status?: 'Pending' | 'Participated' | 'Canceled' | 'No Show';
}

declare global {
  var events: Event[];
}

export {};
