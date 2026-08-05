import { Link, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { MARKETING_NAV_LINKS } from "@/constants";
import "./MobileMenu.scss";

export function MobileMenu({ open, onClose }) {
  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="marketing-navbar__mobile-menu"
    >
      <ul className="marketing-navbar__mobile-list">
        {MARKETING_NAV_LINKS.map((link) => (
          <li key={link.href}>
            <NavLink
              to={link.href}
              end={link.href === "/"}
              onClick={onClose}
              className={({ isActive }) =>
                `marketing-navbar__mobile-link${
                  isActive ? " marketing-navbar__mobile-link--active" : ""
                }`
              }
            >
              {link.label}
            </NavLink>
          </li>
        ))}
        <li>
          <Link
            to="/login"
            className="marketing-navbar__mobile-link"
            onClick={onClose}
          >
            Login
          </Link>
        </li>
      </ul>
    </motion.div>
  );
}

export default MobileMenu;
