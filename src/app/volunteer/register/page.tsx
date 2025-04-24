'use client';
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function VolunteerRegistration() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      email: '',
      password: '',
      confirmPassword: ''
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        const response = await fetch('/api/auth/register', {
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
          localStorage.setItem('pendingRegistration', formData.email);
          router.push('/volunteer/profile');
        } else {
          setErrors(prev => ({
            ...prev,
            email: data.error
          }));
        }
      } catch (error) {
        setErrors(prev => ({
          ...prev,
          email: 'An error occurred. Please try again.'
        }));
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="container-page">
      <div className="container-centered">
        <div className="form-container">
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

          <h1 className="heading-primary">Volunteer Registration</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={`form-input ${errors.email ? 'border-red-500' : ''}`}
                placeholder="Enter your email"
                required
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className={`form-input ${errors.password ? 'border-red-500' : ''}`}
                placeholder="Choose a password"
                required
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className={`form-input ${errors.confirmPassword ? 'border-red-500' : ''}`}
                placeholder="Confirm your password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            <Button type="submit" variant="primary" className="w-full hover:opacity-90 transition-opacity">
              Continue to Profile Setup
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
                <Link href="/volunteer/login">Login</Link>
              </Button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 