import { Button } from "@/components/ui/button";

export default function OrganizationRegistration() {
  return (
    <div className="container-page">
      <div className="container-centered">
        <div className="form-container">
          {/* Back Button */}
          <div className="mb-8">
            <a 
              href="/organization/login"
              className="text-link inline-flex items-center gap-2"
            >
              <span>←</span>
              <span>Back to Login</span>
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
              <label htmlFor="phone" className="form-label">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                className="form-input"
                placeholder="Enter contact number"
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

            <div>
              <label htmlFor="description" className="form-label">
                Organization Description
              </label>
              <textarea
                id="description"
                rows={4}
                className="form-input"
                placeholder="Brief description of your organization"
              />
            </div>

            <Button type="submit" variant="primary" className="w-full">
              Register Organization
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-secondary-foreground">
              Already have an account?{" "}
              <Button href="/organization/login" variant="secondary" size="sm">
                Login
              </Button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 