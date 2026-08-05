"use client";
import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { X } from "lucide-react";
import { Sidebar } from "@/components/organisms/sidebar";
import { AppHeader } from "@/components/organisms/app-header";
import { NAV_ITEMS } from "@/lib/constants";
import { AppLogo } from "@/components/atoms/app-logo";
import { Button } from "@/components/common/Button";
import "@/assets/styles/layout/DashboardLayout.scss";

export function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();
  const isDashboard = pathname === "/dashboard";

  return (
    <div
      className={`dashboard-layout${isDashboard ? " dashboard-layout--dashboard-bg" : ""
        }`}
    >
      <div className="dashboard-layout__header">
        <AppHeader onMenuClick={() => setMobileOpen(true)} />
      </div>

      {mobileOpen && (
        <div className="dashboard-layout__mobile-overlay">
          <div
            className="dashboard-layout__mobile-backdrop"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="dashboard-layout__mobile-sidebar">
            <div className="dashboard-layout__mobile-header">
              <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                <AppLogo size="md" showName />
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileOpen(false)}
              >
                <X
                  className="dashboard-layout__mobile-close-icon"
                  strokeWidth={1.5}
                />
              </Button>
            </div>
            <nav className="dashboard-layout__mobile-nav">
              {NAV_ITEMS.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`dashboard-layout__mobile-nav-link${isActive
                      ? " dashboard-layout__mobile-nav-link--active"
                      : ""
                      }`}
                  >
                    <item.icon
                      className="dashboard-layout__mobile-nav-icon"
                      strokeWidth={1.5}
                    />
                    {item.title}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      <div className="dashboard-layout__body">
        <div className="dashboard-layout__sidebar">
          <Sidebar />
        </div>

        <main
          className={`dashboard-layout__content${isDashboard ? " dashboard-layout__content--dashboard" : ""
            }`}
        >
          <Outlet />
        </main>
      </div>

      <Link to="/app/projects/new" className="dashboard-layout__fab">
        <span className="dashboard-layout__fab-icon">+</span>
      </Link>
    </div>
  );
}
