import { describe, it, expect, beforeEach } from 'vitest';
import { POST, GET } from '../events/route';

describe('Events API', () => {
  let events: any[] = [];

  beforeEach(() => {
    // Clear test data
    events = [];
  });

  it('should validate event creation', async () => {
    const request = new Request('http://localhost:3000/api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-email': 'testuser@example.com' // Add a fake user email for authentication
      },
      body: JSON.stringify({
        eventName: 'A'.repeat(101), // Too long
        description: 'Test description',
        location: 'Test location',
        requiredSkills: ['Invalid Skill'],
        urgency: 'Invalid',
        eventDate: '2024-04-01'
      })
    });

    // Ensure async is correctly used inside the test case
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBeDefined();
  });
});
