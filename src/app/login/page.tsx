import { Button } from "@/components/ui/button";

export default function Login() {
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

          <h1 className="heading-primary">Volunteer Login</h1>
          
          <form className="space-y-4">
            <div>
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="form-input"
                placeholder="Enter your email"
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
                placeholder="Enter your password"
              />
            </div>
            
            <Button type="submit" variant="primary" className="w-full">
              Login
            </Button>
          </form>
          
          <div className="mt-6 text-center space-y-4">
            <Button href="/login/admin" variant="secondary">
              Administrator Login →
            </Button>
            
            <p className="text-sm text-secondary-foreground">
              Don't have an account?
            </p>
            
            <div className="space-x-4">
              <Button href="/register/volunteer" variant="accent" size="sm">
                Register as Volunteer
              </Button>
              <Button href="/register/organization" variant="accent" size="sm">
                Register Organization
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 