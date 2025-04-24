'use client';

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Building2, Calendar, ChevronDown } from "lucide-react";

export default function Home() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-secondary sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold">VC</span>
            </div>
            <h1 className="text-2xl font-bold text-primary">Volunteer Connect</h1>
          </Link>
          <div className="space-x-4">
            <Button asChild variant="secondary" size="sm" className="hover:opacity-90 transition-opacity">
              <Link href="/volunteer/login">Volunteer Login</Link>
            </Button>
            <Button asChild variant="primary" size="sm" className="hover:opacity-90 transition-opacity">
              <Link href="/organization/login">Organization Login</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-secondary/30 to-background py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-primary [text-wrap:balance]">
              Connect. Volunteer. Make a Difference.
            </h2>
            <p className="text-lg sm:text-xl mb-8 text-secondary-foreground leading-relaxed">
              Join our community of passionate volunteers and organizations making a real impact. 
              Our smart platform matches skills with needs, making volunteering more effective than ever.
            </p>
            <div className="space-x-4">
              <Button asChild variant="primary" size="lg" className="hover:opacity-90 transition-opacity">
                <Link href="/register">Get Started</Link>
              </Button>
              <Button 
                variant="secondary" 
                size="lg" 
                className="hover:opacity-90 transition-opacity"
                onClick={() => scrollToSection('how-it-works')}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 text-center hover:bg-secondary/5 rounded-lg transition-colors">
              <Users className="h-8 w-8 mx-auto mb-4 text-primary" />
              <div className="text-4xl font-bold text-primary mb-2">Number+</div>
              <div className="text-secondary-foreground">Active Volunteers</div>
            </div>
            <div className="p-6 text-center hover:bg-secondary/5 rounded-lg transition-colors">
              <Building2 className="h-8 w-8 mx-auto mb-4 text-primary" />
              <div className="text-4xl font-bold text-primary mb-2">Number+</div>
              <div className="text-secondary-foreground">Organizations</div>
            </div>
            <div className="p-6 text-center hover:bg-secondary/5 rounded-lg transition-colors">
              <Calendar className="h-8 w-8 mx-auto mb-4 text-primary" />
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
            {[
              {
                step: 1,
                title: "Create Your Profile",
                description: "Sign up and tell us about your skills, interests, and availability. Our smart system uses this information to find perfect matches."
              },
              {
                step: 2,
                title: "Get Matched",
                description: "Our algorithm matches you with opportunities that fit your profile. Receive notifications for events that match your skills and schedule."
              },
              {
                step: 3,
                title: "Make an Impact",
                description: "Participate in events, track your contributions, and see the real difference you're making in your community."
              }
            ].map((item) => (
              <div key={item.step} className="text-center p-6 rounded-lg hover:bg-background transition-colors">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
                <p className="text-secondary-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                quote: "The price of freedom is high, it always has been. And it's a price I'm willing to pay. And if I'm the only one, then so be it. But I'm willing to bet I'm not.",
                author: "Steve R., Volunteer"
              },
              {
                quote: "They say that the best weapon is the one you never have to fire. I respectfully disagree. I prefer the weapon you only have to fire once.",
                author: "Tony S., Food Bank Coordinator"
              },
              {
                quote: "I am inevitable.",
                author: "Thanos, Nonprofit Director"
              }
            ].map((testimonial, index) => (
              <div 
                key={index} 
                className="p-6 bg-secondary/5 rounded-lg hover:bg-secondary/10 transition-colors"
              >
                <p className="text-secondary-foreground mb-4 italic">"{testimonial.quote}"</p>
                <p className="font-semibold text-primary">{testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-primary to-primary/90 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join our community today and start connecting with meaningful volunteer opportunities 
            that match your skills and availability.
          </p>
          <Button asChild variant="secondary" size="lg" className="hover:opacity-90 transition-opacity group">
            <Link href="/register">
              Get Started Now
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-secondary">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-secondary-foreground">
            <p className="mb-2">Built for Group 1 in Singh's COSC4353. Not a real website.</p>
            <p>© {new Date().getFullYear()} Volunteer Connect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
