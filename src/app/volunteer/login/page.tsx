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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.email.includes('@') && formData.password.length >= 6) {
      localStorage.setItem('volunteerLoggedIn', 'true');
      router.push('/volunteer/dashboard');
    }
  };

  return (
    <div className="container-page">
      <div className="container-centered">
        <div className="form-container">
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
                className="form-input"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
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