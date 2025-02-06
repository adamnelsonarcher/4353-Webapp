import { Button } from "@/components/ui/button";

export default function RegisterSelection() {
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

          <h1 className="heading-primary text-center">Join Our Community</h1>
          
          <div className="space-y-8 mt-8">
            {/* Volunteer Option */}
            <div className="p-6 rounded-lg border border-secondary hover:border-primary transition-colors">
              <h2 className="text-xl font-semibold mb-4">Join as a Volunteer</h2>
              <p className="text-secondary-foreground mb-6">
                Find meaningful opportunities to contribute your skills and time to causes you care about.
              </p>
              <Button href="/volunteer/register" variant="primary" className="w-full">
                Register as Volunteer
              </Button>
            </div>

            {/* Organization Option */}
            <div className="p-6 rounded-lg border border-secondary hover:border-primary transition-colors">
              <h2 className="text-xl font-semibold mb-4">Register Your Organization</h2>
              <p className="text-secondary-foreground mb-6">
                Connect with passionate volunteers and manage your volunteer programs effectively.
              </p>
              <Button href="/organization/register" variant="primary" className="w-full">
                Register Organization
              </Button>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-secondary-foreground">
              Already have an account?{" "}
              <Button href="/volunteer/login" variant="secondary" size="sm">
                Login
              </Button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 