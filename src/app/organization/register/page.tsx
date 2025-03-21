"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function OrganizationRegistration() {
  const [formData, setFormData] = useState({
    userType: "organization",
    orgName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
    description: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const validateForm = () => {
    let newErrors: Record<string, string> = {};
    let isValid = true;

    // Organization Name validation
    if (!formData.orgName.trim()) {
      newErrors.orgName = "Organization name is required";
      isValid = false;
    } else if (formData.orgName.length < 3) {
      newErrors.orgName = "Organization name must be at least 3 characters";
      isValid = false;
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
      isValid = false;
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
      isValid = false;
    } else if (formData.address.length < 5) {
      newErrors.address = "Address must be at least 5 characters";
      isValid = false;
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one uppercase letter";
      isValid = false;
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one lowercase letter";
      isValid = false;
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one number";
      isValid = false;
    }

    // Confirm Password validation
    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to register.");
      }

      setSuccess("Organization registered successfully!");
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="container-page">
      <div className="container-centered">
        <div className="form-container">
          <div className="mb-8">
            <Button 
              href="/organization/login"
              variant="secondary"
              size="sm"
              className="hover:opacity-90 transition-opacity inline-flex items-center gap-2"
            >
              <span>←</span>
              <span>Back to Login</span>
            </Button>
          </div>

          <h1 className="heading-primary">Organization Registration</h1>
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <input type="text" id="orgName" className="form-input" placeholder="Enter organization name" value={formData.orgName} onChange={handleChange} />
              {errors.orgName && <p className="text-red-500">{errors.orgName}</p>}
            </div>

            <div>
              <input type="email" id="email" className="form-input" placeholder="Enter organization email" value={formData.email} onChange={handleChange} />
              {errors.email && <p className="text-red-500">{errors.email}</p>}
            </div>

            <div>
              <input type="tel" id="phone" className="form-input" placeholder="Enter contact number" value={formData.phone} onChange={handleChange} />
              {errors.phone && <p className="text-red-500">{errors.phone}</p>}
            </div>

            <div>
              <input type="text" id="address" className="form-input" placeholder="Enter organization address" value={formData.address} onChange={handleChange} />
              {errors.address && <p className="text-red-500">{errors.address}</p>}
            </div>

            <div>
              <input type="password" id="password" className="form-input" placeholder="Choose a password" value={formData.password} onChange={handleChange} />
              {errors.password && <p className="text-red-500">{errors.password}</p>}
            </div>

            <div>
              <input type="password" id="confirmPassword" className="form-input" placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleChange} />
              {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword}</p>}
            </div>

            <textarea id="description" rows={4} className="form-input" placeholder="Brief description of your organization" value={formData.description} onChange={handleChange} />

            <Button type="submit" variant="primary" className="w-full hover:opacity-90 transition-opacity">
              Register Organization
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-secondary-foreground">
              Already have an account?{" "}
              <Button href="/organization/login" variant="secondary" size="sm" className="hover:opacity-90 transition-opacity">
                Login
              </Button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
