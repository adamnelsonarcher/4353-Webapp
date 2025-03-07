import { describe, it, expect, beforeEach, vi } from 'vitest';
import { POST, GET, PUT } from '../profile/route';
import { profileStore } from '../profile/route'; // Import the profileStore


declare global {
  var profiles: Record<string, any>;
}

describe('Profile API', () => {
  beforeEach(() => {
    // Clear the profileStore before each test
    for (const key in profileStore) {
      delete profileStore[key];
    }

    // Populate the profileStore with test data
    profileStore['test@example.com'] = {
        email: 'test@example.com',
        fullName: 'John Doe',
        address1: '123 Main St',
        city: 'Houston',
        state: 'TX',
        zipCode: '77001',
        skills: ['Leadership', 'Communication'],
        preferences: 'Some preferences',
        availability: [],
    };
  });

  it('should return 401 for unauthenticated user', async () => {
    const request = new Request('http://localhost:3000/api/profile');
    const response = await GET(request);
    expect(response.status).toBe(401);
  });

  it('should return user profile for authenticated user', async () => {
    const request = new Request('http://localhost:3000/api/profile', {
      headers: { 'x-user-email': 'test@example.com' },
    });

    const response = await GET(request);
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.email).toBe('test@example.com');
  });

  it('should update user profile', async () => {
    const request = new Request('http://localhost:3000/api/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-user-email': 'test@example.com',
      },
      body: JSON.stringify({
        fullName: 'John Doe',
        address1: '123 Main St',
        city: 'Dallas',
        state: 'TX',
        zipCode: '75201',
        skills: ['Leadership', 'Communication'],
        location: 'Dallas, TX',
      }),
    });

    const response = await PUT(request);
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.message).toBe('Profile updated successfully');
  });

  it('should return 400 for invalid zip code format', async () => {
    const request = new Request('http://localhost:3000/api/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-email': 'test@example.com',
      },
      body: JSON.stringify({
        fullName: 'John Doe',
        address1: '123 Main St',
        city: 'Houston',
        state: 'TX',
        zipCode: 'invalid', // Invalid ZIP code
        skills: ['Leadership', 'Communication'],
      }),
    });
  
    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it('should return 400 for missing required fields', async () => {
    const request = new Request('http://localhost:3000/api/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-email': 'test@example.com',
      },
      body: JSON.stringify({
        // Missing required fields like fullName, address1, etc.
        email: 'test@example.com',
      }),
    });
  
    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  //Get handler test
  it('should return 401 for unauthenticated user in GET', async () => {
    const request = new Request('http://localhost:3000/api/profile');
    const response = await GET(request);
    expect(response.status).toBe(401);
  });
  
  it('should return 404 for profile not found in GET', async () => {
    const request = new Request('http://localhost:3000/api/profile', {
      headers: { 'x-user-email': 'nonexistent@example.com' },
    });
  
    const response = await GET(request);
    expect(response.status).toBe(404);
  });
  
  it('should return 200 and profile data for authenticated user in GET', async () => {
    const request = new Request('http://localhost:3000/api/profile', {
      headers: { 'x-user-email': 'test@example.com' },
    });
  
    const response = await GET(request);
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.fullName).toBe('John Doe');
  });

  it('should create a profile successfully', async () => {
    const request = new Request('http://localhost:3000/api/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-email': 'test@example.com',
      },
      body: JSON.stringify({
        fullName: 'John Doe',
        address1: '123 Main St',
        city: 'Houston',
        state: 'TX',
        zipCode: '77001',
        skills: ['Leadership', 'Communication'],
        preferences: 'Some preferences',
        availability: [],
      }),
    });
  
    const response = await POST(request);
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.message).toBe('Profile updated successfully');
    expect(profileStore['test@example.com']).toBeDefined();
  });

  it('should return 400 for missing required fields in POST', async () => {
    const request = new Request('http://localhost:3000/api/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-email': 'test@example.com',
      },
      body: JSON.stringify({
        // Missing required fields like fullName, address1, etc.
        email: 'test@example.com',
      }),
    });
  
    const response = await POST(request);
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'Missing required fields' });
  });

  it('should return 404 for profile not found in GET', async () => {
    const request = new Request('http://localhost:3000/api/profile', {
      headers: { 'x-user-email': 'nonexistent@example.com' },
    });
  
    const response = await GET(request);
    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: 'Profile not found' });
  });

  it('should return 400 for missing required fields in PUT', async () => {
    const request = new Request('http://localhost:3000/api/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-user-email': 'test@example.com',
      },
      body: JSON.stringify({
        // Missing required fields like fullName, address1, etc.
        email: 'test@example.com',
      }),
    });
  
    const response = await PUT(request);
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'Missing required fields' });
  });

  it('should return 400 for invalid ZIP code format in POST', async () => {
    const request = new Request('http://localhost:3000/api/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-email': 'test@example.com',
      },
      body: JSON.stringify({
        fullName: 'John Doe',
        address1: '123 Main St',
        city: 'Houston',
        state: 'TX',
        zipCode: 'invalid', // Invalid ZIP code
        skills: ['Leadership', 'Communication'],
      }),
    });
  
    const response = await POST(request);
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'Invalid ZIP code format' });
  });

  
});