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
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          userType: 'organization'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('organizationLoggedIn', 'true');
        localStorage.setItem('userEmail', formData.email);
        router.push('/organization/dashboard');
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  return (
    <div className="container-page">
      <div className="container-centered">
        <div className="form-container">
          {/* Test Notice */}
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            For assignment 4, we now can create accounts and login. You can create your own account, or use this one []
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
                name="email"
                className={`form-input ${error ? 'border-red-500' : ''}`}
                placeholder="Enter organization email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className={`form-input ${error ? 'border-red-500' : ''}`}
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
            
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