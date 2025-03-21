'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function OrganizationLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [emailError, setEmailError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setEmailError('Please enter a valid email');
      return;
    }
    if (formData.password.length >= 6) {
      localStorage.setItem('organizationLoggedIn', 'true');
      router.push('/organization/dashboard');
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

          {/* Back Button */}
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

          <h1 className="heading-primary">Organization Login</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                className={`form-input ${emailError ? 'border-red-500' : ''}`}
                placeholder="Enter organization email"
                value={formData.email}
                onChange={handleEmailChange}
              />
              {emailError && (
                <p className="text-red-500 text-sm mt-1">{emailError}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="form-input"
                placeholder="Enter password"
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
              href="/organization/register" 
              variant="accent" 
              size="sm"
              className="hover:opacity-90 transition-opacity"
            >
              Register Organization
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 