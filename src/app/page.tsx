import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-secondary">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Volunteer Connect</h1>
          <div className="space-x-4">
            <Button href="/volunteer/login" variant="secondary" size="sm">
              Volunteer Login
            </Button>
            <Button href="/organization/login" variant="primary" size="sm">
              Organization Login
            </Button>
          </div>
        </div>
      </header>

      {/* "Hero" Section */}
      <section className="bg-secondary/30 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Connect. Volunteer. Make a Difference.</h2>
            <p className="text-lg mb-8 text-secondary-foreground">
              A smart platform connecting volunteers with meaningful opportunities based on skills and availability.
            </p>
            <Button href="/register" variant="primary" size="lg">
              Register with Us
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <main className="container mx-auto px-4 py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-6 rounded-lg border border-secondary bg-background">
            <h3 className="text-xl font-semibold mb-4">For Volunteers</h3>
            <ul className="space-y-3 text-secondary-foreground">
              <li>• Personalized Dashboard</li>
              <li>• Skill-based Event Matching</li>
              <li>• Flexible Schedule Management</li>
              <li>• Performance Tracking</li>
              <li>• Mobile-friendly Interface</li>
            </ul>
          </div>

          <div className="p-6 rounded-lg border border-secondary bg-background">
            <h3 className="text-xl font-semibold mb-4">For Administrators</h3>
            <ul className="space-y-3 text-secondary-foreground">
              <li>• Event Creation & Management</li>
              <li>• Volunteer Assignment Tools</li>
              <li>• Real-time Event Analytics</li>
              <li>• Communication System</li>
              <li>• Performance Reports</li>
            </ul>
          </div>

          <div className="p-6 rounded-lg border border-secondary bg-background">
            <h3 className="text-xl font-semibold mb-4">Smart Features</h3>
            <ul className="space-y-3 text-secondary-foreground">
              <li>• Automated Matching System</li>
              <li>• Location-based Events</li>
              <li>• SMS/Email Notifications</li>
              <li>• Skill Assessment</li>
              <li>• Real-time Updates</li>
            </ul>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-secondary mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-secondary-foreground">
            <p>© 2024 Volunteer Connect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
