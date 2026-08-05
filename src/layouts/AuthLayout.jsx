import { Link, Outlet } from "react-router-dom";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";
import { AppLogo } from "@/components/atoms/app-logo";
import "@/assets/styles/layout/AuthLayout.scss";

export function AuthLayout() {
  return (
    <div className="auth-layout">
      <div className="auth-layout__panel">
        <Link to="/">
          <AppLogo size="lg" showName tagline={APP_TAGLINE} variant="light" />
        </Link>
        <div className="auth-layout__hero">
          <h2 className="auth-layout__title">
            Manage projects.
            <br />
            Deliver excellence.
            <br />
            Grow your practice.
          </h2>
          <p className="auth-layout__description">
            The premium business management platform for architecture, interior design, and construction firms.
          </p>
          <div className="auth-layout__stats">
            <div>
              <p className="auth-layout__stat-value">500+</p>
              <p className="auth-layout__stat-label">Projects managed</p>
            </div>
            <div>
              <p className="auth-layout__stat-value">₹120Cr+</p>
              <p className="auth-layout__stat-label">Revenue tracked</p>
            </div>
            <div>
              <p className="auth-layout__stat-value">40%</p>
              <p className="auth-layout__stat-label">Faster delivery</p>
            </div>
          </div>
        </div>
        <p className="auth-layout__footer">
          © 2026 {APP_NAME}. Built for design professionals.
        </p>
      </div>
      <div className="auth-layout__content">
        <div className="auth-layout__form-wrap">
          <div className="auth-layout__mobile-logo">
            <AppLogo size="md" showName />
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
