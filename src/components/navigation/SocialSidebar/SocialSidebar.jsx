import { Instagram, Linkedin } from "lucide-react";
import { PinterestIcon } from "@/components/marketing/icons";
import "./SocialSidebar.scss";

export function SocialSidebar() {
  return (
    <aside className="social-scroll-bar">
      <div className="social-scroll-bar__pill">
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noreferrer"
          aria-label="Instagram"
          className="social-scroll-bar__link"
        >
          <Instagram className="social-scroll-bar__icon" strokeWidth={1.5} />
        </a>
        <a
          href="https://pinterest.com"
          target="_blank"
          rel="noreferrer"
          aria-label="Pinterest"
          className="social-scroll-bar__link"
        >
          <PinterestIcon className="social-scroll-bar__icon" />
        </a>
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn"
          className="social-scroll-bar__link"
        >
          <Linkedin className="social-scroll-bar__icon" strokeWidth={1.5} />
        </a>
        <div className="social-scroll-bar__divider-wrap">
          <span className="social-scroll-bar__divider" />
        </div>
      </div>
    </aside>
  );
}

export default SocialSidebar;
