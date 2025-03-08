import { describe, it, expect, beforeEach } from 'vitest';
import { POST, GET } from '../notifications/route';

describe('Notifications API', () => {
  let notifications: any[] = []; // Mock notifications storage

  beforeEach(() => {
    notifications = [];
  });

  describe('GET /api/notifications', () => {
    it('should require authentication', async () => {
      const request = new Request('http://localhost:3000/api/notifications');
      const response = await GET(request);
      expect(response.status).toBe(401);
    });

    it('should return notifications for an authenticated user', async () => {
      const request = new Request('http://localhost:3000/api/notifications', {
        headers: {
          'x-user-email': 'volunteer@test.com',
        },
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
    });
  });

  describe('POST /api/notifications', () => {
    it('should require all fields to be present', async () => {
      const request = new Request('http://localhost:3000/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Test Notification' }), // Missing userEmail and type
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing required fields');
    });

    it('should create a new notification successfully', async () => {
      const request = new Request('http://localhost:3000/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'New event available',
          userEmail: 'volunteer@test.com',
          type: 'event_update',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.notification).toMatchObject({
        message: 'New event available',
        userEmail: 'volunteer@test.com',
        type: 'event_update',
      });
      expect(data.notification.id).toBeDefined();
    });
  });
});
