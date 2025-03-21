import { describe, it, expect } from 'vitest';
import { POST as login } from '../auth/login/route';

describe('Login API', () => {
  it('should return 401 for invalid credentials', async () => {
    const request = new Request('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: 'invalid@example.com', 
        password: 'wrongpassword',
        userType: 'volunteer'
      }),
    });

    const response = await login(request);
    const data = await response.json();
    expect(response.status).toBe(401);
    expect(data.error).toBe('Invalid credentials');
  });

  it('should return 200 for valid credentials', async () => {
    const request = new Request('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: 'volunteer@test.com', 
        password: 'password123',
        userType: 'volunteer'
      }),
    });

    const response = await login(request);
    const data = await response.json();
    expect(response.status).toBe(200); 
    expect(data.token).toBeDefined(); 
    expect(data.user).toBeDefined(); 
  });

  it('should return 400 for missing required fields', async () => {
    const request = new Request('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com' }), 
    });
  
    const response = await login(request);
    const data = await response.json();
    expect(response.status).toBe(400);
    expect(data.error).toBe('Missing required fields');
  });

  it('should return 400 for invalid email format', async () => {
    const request = new Request('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: 'invalid-email',
        password: 'password123',
        userType: 'volunteer'
      }),
    });
  
    const response = await login(request);
    const data = await response.json();
    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid email format');
  });

  it('should return 500 for internal server error', async () => {
    
    const request = new Request('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'invalid-json', 
    });
  
    const response = await login(request);
    const data = await response.json();
    expect(response.status).toBe(500);
    expect(data.error).toBe('Internal server error');
  });
});