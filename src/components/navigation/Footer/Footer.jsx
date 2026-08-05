import { Link } from "react-router-dom";
import { Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import AgaraLogo from "@/components/navigation/AgaraLogo";
import { PinterestIcon } from "@/components/marketing/icons";
import {
  FOOTER_SERVICES,
  MARKETING_NAV_LINKS,
} from "@/constants";
import "./Footer.scss";

export function Footer() {
  return (
    <footer className="marketing-footer">
      <div className="marketing-footer__shell">
        <div className="marketing-footer__grid">
          <div>
            <AgaraLogo />
            <p className="marketing-footer__tagline">
              A multidisciplinary design practice crafting architecture,
              interiors, landscapes, and construction with contextual clarity
              and timeless restraint.
            </p>
            <div className="marketing-footer__social">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="marketing-footer__social-link"
              >
                <Instagram
                  className="marketing-footer__social-icon"
                  strokeWidth={1.5}
                />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="marketing-footer__social-link"
              >
                <Linkedin
                  className="marketing-footer__social-icon"
                  strokeWidth={1.5}
                />
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Pinterest"
                className="marketing-footer__social-link"
              >
                <PinterestIcon className="marketing-footer__social-icon" />
              </a>
            </div>
          </div>

          <div>
            <p className="marketing-footer__heading">Quick Links</p>
            <ul className="marketing-footer__list marketing-footer__list--links">
              {MARKETING_NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="marketing-footer__link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="marketing-footer__heading">Services</p>
            <ul className="marketing-footer__list marketing-footer__list--links">
              {FOOTER_SERVICES.map((service) => (
                <li key={service}>
                  <Link to="/services" className="marketing-footer__link">
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="marketing-footer__heading">Contact</p>
            <ul className="marketing-footer__list marketing-footer__list--contact">
              <li>
                <a
                  href="tel:+919000000000"
                  className="marketing-footer__contact-link"
                >
                  <Phone
                    className="marketing-footer__contact-icon"
                    strokeWidth={1.5}
                  />
                  +91 9XXXXXXXX
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@agara.in"
                  className="marketing-footer__contact-link"
                >
                  <Mail
                    className="marketing-footer__contact-icon"
                    strokeWidth={1.5}
                  />
                  hello@agara.in
                </a>
              </li>
              <li className="marketing-footer__contact-item">
                <MapPin
                  className="marketing-footer__contact-icon"
                  strokeWidth={1.5}
                />
                Hyderabad, India
              </li>
            </ul>
          </div>
        </div>

        <div className="marketing-footer__bar">
          <p className="marketing-footer__bar-text">
            © {new Date().getFullYear()} AGARA Architects. All rights reserved.
          </p>
          <p className="marketing-footer__bar-text">
            Designed &amp; Developed by AGARA Architects
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
