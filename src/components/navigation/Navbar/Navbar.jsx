import { Link, NavLink } from "react-router-dom";
import { ArrowRight, Menu, X } from "lucide-react";
import { useState } from "react";
import BrandLogo from "@/components/navigation/BrandLogo";
import MobileMenu from "@/components/navigation/MobileMenu";
import { MARKETING_NAV_LINKS } from "@/constants";
import "./Navbar.scss";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="marketing-navbar">
      <nav className="marketing-navbar__nav">
        <BrandLogo />

        <ul className="marketing-navbar__links">
          {MARKETING_NAV_LINKS.map((link) => (
            <li key={link.href}>
              <NavLink
                to={link.href}
                end={link.href === "/"}
                className={({ isActive }) =>
                  `marketing-navbar__link${isActive ? " marketing-navbar__link--active" : ""
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="marketing-navbar__actions">
          <Link to="/login" className="marketing-navbar__login">
            Login
          </Link>
          <Link
            to="/contact"
            className="marketing-navbar__cta"
          >
            Start Your Project
            <ArrowRight className="marketing-navbar__cta-icon" strokeWidth={1.5} />
          </Link>
          <button
            type="button"
            className="marketing-navbar__menu-btn"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? (
              <X className="marketing-navbar__menu-icon" />
            ) : (
              <Menu className="marketing-navbar__menu-icon" />
            )}
          </button>
        </div>
      </nav>

      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </header>
  );
}

export default Navbar;
