'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from "next/link";

export default function OrganizationLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
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
      console.log('Login response:', data);

      if (response.ok) {
        localStorage.setItem('organizationLoggedIn', 'true');
        localStorage.setItem('organizationEmail', formData.email);
        router.push('/organization/dashboard');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
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
            You can create your own account, or use this one [seedorg123@test.com, Test123!]
          </div>

          {/* Back Button */}
          <div className="mb-8">
            <Button 
              asChild
              variant="secondary"
              size="sm"
              className="hover:opacity-90 transition-opacity inline-flex items-center gap-2"
            >
              <Link href="/">
                <span>←</span>
                <span>Back to Home</span>
              </Link>
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
              asChild
              variant="accent" 
              size="sm"
              className="hover:opacity-90 transition-opacity"
            >
              <Link href="/organization/register">
                Register Organization
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 