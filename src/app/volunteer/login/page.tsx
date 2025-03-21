'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function VolunteerLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [emailError, setEmailError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          userType: 'volunteer'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('volunteerLoggedIn', 'true');
        localStorage.setItem('userEmail', formData.email);
        router.push('/volunteer/dashboard');
      } else {
        setEmailError(data.error);
      }
    } catch (error) {
      setEmailError('An error occurred. Please try again.');
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({...formData, email: e.target.value});
    setEmailError(''); // Clear error when user starts typing
  };

  return (
    <div className="container-page">
      <div className="container-centered">
        <div className="form-container">
          {/* Test Notice */}
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
          For assignment 4, we now can create accounts and login.
          </div>

          <div className="mb-8">
            <Button 
              href="/"
              variant="secondary"
              size="sm"
              className="hover:opacity-90 transition-opacity inline-flex items-center gap-2"
            >
              <span>←</span>
              <span>Back to Home</span>
            </Button>
          </div>

          <h1 className="heading-primary">Volunteer Login</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                className={`form-input ${emailError ? 'border-red-500' : ''}`}
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleEmailChange}
              />
              {emailError && (
                <p className="text-red-500 text-sm mt-1">{emailError}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                className="form-input"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
            
            <Button 
              type="submit" 
              variant="primary" 
              className="w-full hover:opacity-90 transition-opacity"
            >
              Login
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-secondary-foreground mb-4">
              Don't have an account?
            </p>
            <Button 
              href="/volunteer/register" 
              variant="accent" 
              size="sm"
              className="hover:opacity-90 transition-opacity"
            >
              Register as Volunteer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 