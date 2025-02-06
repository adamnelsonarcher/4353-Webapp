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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.email.includes('@') && formData.password.length >= 6) {
      localStorage.setItem('organizationLoggedIn', 'true');
      router.push('/organization/dashboard');
    }
  };

  return (
    <div className="container-page">
      <div className="container-centered">
        <div className="form-container">
          {/* Back Button */}
          <div className="mb-8">
            <a 
              href="/"
              className="text-link inline-flex items-center gap-2"
            >
              <span>←</span>
              <span>Back to Home</span>
            </a>
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
                className="form-input"
                placeholder="Enter organization email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
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
            
            <Button type="submit" variant="primary" className="w-full">
              Login
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-secondary-foreground mb-4">
              Don't have an account?
            </p>
            <Button href="/organization/register" variant="accent" size="sm">
              Register Organization
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 