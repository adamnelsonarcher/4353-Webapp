import { Button } from "@/components/ui/button";

export default function OrganizationRegistration() {
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

          <h1 className="heading-primary">Organization Registration</h1>
          <form className="space-y-4">
            <div>
              <label htmlFor="orgName" className="form-label">
                Organization Name
              </label>
              <input
                type="text"
                id="orgName"
                className="form-input"
                placeholder="Enter organization name"
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
              />
            </div>
            <Button type="submit" variant="primary" className="w-full">
              Register
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
} 