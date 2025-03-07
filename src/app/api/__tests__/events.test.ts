import { describe, it, expect, beforeEach } from 'vitest';
import { POST, GET, VALIDATION } from '../events/route';

describe('Events API', () => {
  beforeEach(() => {
    // Reset test data before each test
    global.events = [];
  });

  describe('POST /api/events', () => {
    const baseEvent = {
      eventName: 'Valid Event',
      eventDescription: 'This is a valid test description for the event',
      location: 'Valid Location, 123',
      requiredSkills: ['Leadership', 'Communication'],
      urgency: 'Medium',
      eventDate: new Date().toISOString().split('T')[0]
    };

    it('should require authentication', async () => {
      const request = new Request('http://localhost:3000/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(baseEvent)
      });

      const response = await POST(request);
      expect(response.status).toBe(401);
    });

    it('should validate event name length', async () => {
      const request = new Request('http://localhost:3000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': 'test@example.com'
        },
        body: JSON.stringify({
          ...baseEvent,
          eventName: 'A'.repeat(101)
        })
      });

      const response = await POST(request);
      const data = await response.json();
      expect(response.status).toBe(400);
      expect(data.error).toContain('Event name must be 100 characters or less');
    });

    it('should validate required skills', async () => {
      const request = new Request('http://localhost:3000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': 'test@example.com'
        },
        body: JSON.stringify({
          ...baseEvent,
          requiredSkills: ['Invalid Skill']
        })
      });

      const response = await POST(request);
      const data = await response.json();
      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid skills provided');
    });

    it('should validate urgency level', async () => {
      const request = new Request('http://localhost:3000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': 'test@example.com'
        },
        body: JSON.stringify({
          ...baseEvent,
          urgency: 'Invalid'
        })
      });

      const response = await POST(request);
      const data = await response.json();
      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid urgency level');
    });

    it('should validate required fields', async () => {
      const request = new Request('http://localhost:3000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': 'test@example.com'
        },
        body: JSON.stringify({
          eventName: 'Test Event'
          // Missing other required fields
        })
      });

      const response = await POST(request);
      const data = await response.json();
      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing required fields');
    });

    it('should validate event date is not in the past', async () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      
      const request = new Request('http://localhost:3000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': 'test@example.com'
        },
        body: JSON.stringify({
          ...baseEvent,
          eventDate: pastDate.toISOString().split('T')[0]
        })
      });

      const response = await POST(request);
      const data = await response.json();
      expect(response.status).toBe(400);
      expect(data.error).toBe('Event date cannot be in the past');
    });

    it('should validate event date is not too far in future', async () => {
      const farFutureDate = new Date();
      farFutureDate.setFullYear(farFutureDate.getFullYear() + 2);
      
      const request = new Request('http://localhost:3000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': 'test@example.com'
        },
        body: JSON.stringify({
          ...baseEvent,
          eventDate: farFutureDate.toISOString().split('T')[0]
        })
      });

      const response = await POST(request);
      const data = await response.json();
      expect(response.status).toBe(400);
      expect(data.error).toBe('Event date cannot be more than 1 year in the future');
    });

    it('should validate number of required skills', async () => {
      const request = new Request('http://localhost:3000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': 'test@example.com'
        },
        body: JSON.stringify({
          ...baseEvent,
          requiredSkills: ['Leadership', 'Communication', 'Problem-Solving', 'Teaching', 'Cooking', 'Coding']
        })
      });

      const response = await POST(request);
      const data = await response.json();
      expect(response.status).toBe(400);
      expect(data.error).toContain('Number of required skills must be between');
    });

    it('should validate location format', async () => {
      const request = new Request('http://localhost:3000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': 'test@example.com'
        },
        body: JSON.stringify({
          ...baseEvent,
          location: 'Invalid Location @#$%'
        })
      });

      const response = await POST(request);
      const data = await response.json();
      expect(response.status).toBe(400);
      expect(data.error).toBe('Location contains invalid characters');
    });

    it('should validate description word count', async () => {
      const request = new Request('http://localhost:3000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': 'test@example.com'
        },
        body: JSON.stringify({
          ...baseEvent,
          eventDescription: 'Too short description'
        })
      });

      const response = await POST(request);
      const data = await response.json();
      expect(response.status).toBe(400);
      expect(data.error).toBe('Event description must contain at least 5 words');
    });

    it('should successfully create an event with valid data', async () => {
      const request = new Request('http://localhost:3000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': 'test@example.com'
        },
        body: JSON.stringify(baseEvent)
      });

      const response = await POST(request);
      const data = await response.json();
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.event).toMatchObject(baseEvent);
      expect(data.event.id).toBeDefined();
    });
  });

  describe('GET /api/events', () => {
    it('should require authentication', async () => {
      const request = new Request('http://localhost:3000/api/events');
      const response = await GET(request);
      expect(response.status).toBe(401);
    });

    it('should return all events for authenticated user', async () => {
      const request = new Request('http://localhost:3000/api/events', {
        headers: {
          'x-user-email': 'test@example.com'
        }
      });

      const response = await GET(request);
      const data = await response.json();
      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
    });

    it('should return volunteer history when type=history', async () => {
      const request = new Request('http://localhost:3000/api/events?type=history', {
        headers: {
          'x-user-email': 'test@example.com'
        }
      });

      const response = await GET(request);
      const data = await response.json();
      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
    });
  });
});