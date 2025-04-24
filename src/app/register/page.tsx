'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function RegisterSelection() {
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

          <h1 className="heading-primary text-center">Join Our Community</h1>
          
          <div className="space-y-8 mt-8">
            {/* Volunteer Option */}
            <div className="p-6 rounded-lg border border-secondary hover:border-primary transition-colors">
              <h2 className="text-xl font-semibold mb-4">Join as a Volunteer</h2>
              <p className="text-secondary-foreground mb-6">
                Find meaningful opportunities to contribute your skills and time to causes you care about.
              </p>
              <Button 
                asChild
                variant="primary" 
                className="w-full hover:opacity-90 transition-opacity"
              >
                <Link href="/volunteer/register">Register as Volunteer</Link>
              </Button>
            </div>

            {/* Organization Option */}
            <div className="p-6 rounded-lg border border-secondary hover:border-primary transition-colors">
              <h2 className="text-xl font-semibold mb-4">Register Your Organization</h2>
              <p className="text-secondary-foreground mb-6">
                Connect with passionate volunteers and manage your volunteer programs effectively.
              </p>
              <Button 
                asChild
                variant="primary" 
                className="w-full hover:opacity-90 transition-opacity"
              >
                <Link href="/organization/register">Register Organization</Link>
              </Button>
            </div>
          </div>

          <div className="mt-8 text-center">
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