import { describe, it, expect, beforeEach } from 'vitest';
import { POST, GET } from '../events/route';

describe('Events API', () => {
  beforeEach(() => {
    // Clear test data
    global.events = [];
  });

  it('should validate event creation', async () => {
    const request = new Request('http://localhost:3000/api/events', {
      method: 'POST',
      body: JSON.stringify({
        eventName: 'A'.repeat(101), // Too long
        description: 'Test description',
        location: 'Test location',
        requiredSkills: ['Invalid Skill'],
        urgency: 'Invalid',
        eventDate: '2024-04-01'
      })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBeDefined();
  });
}); 