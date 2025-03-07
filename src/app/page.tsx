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
            <Button href="/volunteer/login" variant="secondary" size="sm" className="hover:opacity-90 transition-opacity">
              Volunteer Login
            </Button>
            <Button href="/organization/login" variant="primary" size="sm" className="hover:opacity-90 transition-opacity">
              Organization Login
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-secondary/30 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-5xl font-bold mb-6">Connect. Volunteer. Make a Difference.</h2>
            <p className="text-xl mb-8 text-secondary-foreground leading-relaxed">
              Join our community of passionate volunteers and organizations making a real impact. 
              Our smart platform matches skills with needs, making volunteering more effective than ever.
            </p>
            <div className="space-x-4">
              <Button href="/register" variant="primary" size="lg" className="hover:opacity-90 transition-opacity">
                Get Started
              </Button>
              <Button href="#how-it-works" variant="secondary" size="lg" className="hover:opacity-90 transition-opacity">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl font-bold text-primary mb-2">Number+</div>
              <div className="text-secondary-foreground">Active Volunteers</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-primary mb-2">Number+</div>
              <div className="text-secondary-foreground">Organizations</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-primary mb-2">Number+</div>
              <div className="text-secondary-foreground">Events Completed</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-secondary/10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl font-bold text-primary mb-4">1</div>
              <h3 className="text-xl font-semibold mb-4">Create Your Profile</h3>
              <p className="text-secondary-foreground">
                Sign up and tell us about your skills, interests, and availability. 
                Our smart system uses this information to find perfect matches.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl font-bold text-primary mb-4">2</div>
              <h3 className="text-xl font-semibold mb-4">Get Matched</h3>
              <p className="text-secondary-foreground">
                Our algorithm matches you with opportunities that fit your profile. 
                Receive notifications for events that match your skills and schedule.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl font-bold text-primary mb-4">3</div>
              <h3 className="text-xl font-semibold mb-4">Make an Impact</h3>
              <p className="text-secondary-foreground">
                Participate in events, track your contributions, and see the real 
                difference you're making in your community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-secondary/10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 bg-background rounded-lg shadow-sm">
              <p className="text-secondary-foreground mb-4">
                "The price of freedom is high, it always has been. 
                And it's a price I'm willing to pay. And if I'm the only one, then so be it. But I'm willing to bet I'm not."
              </p>
              <p className="font-semibold">- Steve R., Volunteer</p>
            </div>
            <div className="p-6 bg-background rounded-lg shadow-sm">
              <p className="text-secondary-foreground mb-4">
                "They say that the best weapon is the one you never have to fire. 
                I respectfully disagree. I prefer the weapon you only have to fire once."
              </p>
              <p className="font-semibold">- Tony S., Food Bank Coordinator</p>
            </div>
            <div className="p-6 bg-background rounded-lg shadow-sm">
              <p className="text-secondary-foreground mb-4">
                "I am inevitable."
              </p>
              <p className="font-semibold">- Thanos, Nonprofit Director</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our community today and start connecting with meaningful volunteer opportunities 
            that match your skills and availability.
          </p>
          <Button href="/register" variant="secondary" size="lg" className="hover:opacity-90 transition-opacity">
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-secondary">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-secondary-foreground">
            <p>Built for Group 1 in Singh's COSC4353. Not a real website.</p>
            <p>© 2025 Volunteer Connect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
