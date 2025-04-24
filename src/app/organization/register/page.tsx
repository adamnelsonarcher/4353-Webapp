'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export default function OrganizationRegistration() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    orgName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
    description: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          userType: 'organization',
          orgName: formData.orgName,
          phone: formData.phone,
          address: formData.address,
          description: formData.description
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('organizationLoggedIn', 'true');
        localStorage.setItem('organizationEmail', formData.email);
        router.push('/organization/dashboard');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-page">
      <div className="container-centered">
        <div className="form-container">
          {/* Back Button */}
          <div className="mb-8">
            <Link href="/organization/login">
              <Button 
                variant="secondary"
                size="sm"
                className="hover:opacity-90 transition-opacity inline-flex items-center gap-2"
              >
                <span>←</span>
                <span>Back to Login</span>
              </Button>
            </Link>
          </div>

          <h1 className="heading-primary">Organization Registration</h1>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="orgName" className="form-label">
                Organization Name
              </label>
              <input
                type="text"
                id="orgName"
                className="form-input"
                placeholder="Enter organization name"
                value={formData.orgName}
                onChange={handleChange}
              />
            </div>

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
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="phone" className="form-label">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                className="form-input"
                placeholder="Enter contact number"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="address" className="form-label">
                Address
              </label>
              <input
                type="text"
                id="address"
                className="form-input"
                placeholder="Enter organization address"
                value={formData.address}
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
                className="form-input"
                placeholder="Choose a password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="form-input"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="description" className="form-label">
                Organization Description
              </label>
              <textarea
                id="description"
                rows={4}
                className="form-input"
                placeholder="Brief description of your organization"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <Button type="submit" variant="primary" className="w-full hover:opacity-90 transition-opacity" disabled={loading}>
              {loading ? 'Registering...' : 'Register Organization'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-secondary-foreground">
              Already have an account?{" "}
              <Button 
                asChild
                variant="secondary" 
                size="sm" 
                className="hover:opacity-90 transition-opacity"
              >
                <Link href="/organization/login">Login</Link>
              </Button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 