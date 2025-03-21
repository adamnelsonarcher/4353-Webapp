import { describe, it, expect } from 'vitest';
import { POST as register } from '../auth/register/route';

describe('Register API', () => {
  it('should return 400 for missing required fields', async () => {
    const request = new Request('http://localhost:3000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com' }), // Missing password and userType
    });

    const response = await register(request);
    const data = await response.json();
    expect(response.status).toBe(400);
    expect(data.error).toBe('Missing required fields');
  });

  it('should return 400 for invalid email format', async () => {
    const request = new Request('http://localhost:3000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: 'invalid-email',
        password: 'password123',
        userType: 'volunteer'
      }),
    });

    const response = await register(request);
    const data = await response.json();
    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid email format');
  });

  it('should return 400 for a password that is too short', async () => {
    const request = new Request('http://localhost:3000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: 'valid@example.com',
        password: 'short',
        userType: 'volunteer'
      }),
    });

    const response = await register(request);
    const data = await response.json();
    expect(response.status).toBe(400);
    expect(data.error).toBe('Password must be at least 8 characters long');
  });

  it('should return 409 for duplicate email registration', async () => {
    // First, register a user
    const firstRequest = new Request('http://localhost:3000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: 'duplicate@test.com',
        password: 'password123',
        userType: 'volunteer'
      }),
    });

    await register(firstRequest); // Register the user

    // Try registering with the same email again
    const secondRequest = new Request('http://localhost:3000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: 'duplicate@test.com',
        password: 'password123',
        userType: 'volunteer'
      }),
    });

    const response = await register(secondRequest);
    const data = await response.json();
    expect(response.status).toBe(409);
    expect(data.error).toBe('Email already registered');
  });

  it('should return 200 for successful registration', async () => {
    const request = new Request('http://localhost:3000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: 'newuser@test.com',
        password: 'password123',
        userType: 'volunteer'
      }),
    });

    const response = await register(request);
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toBe('Registration successful');
  });

  it('should return 500 for internal server error', async () => {
    const request = new Request('http://localhost:3000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'invalid-json', // Invalid JSON body to trigger an error
    });

    const response = await register(request);
    const data = await response.json();
    expect(response.status).toBe(500);
    expect(data.error).toBe('Internal server error');
  });
});
