import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import ContactSectionImage from "@/assets/images/maps/ContactSectionImage.png";
import { fadeUp } from "@/components/marketing/motion";
import { CONTACT_DETAILS } from "@/constants";
import "./ContactSection.scss";

const ICONS = { Phone, Mail, MapPin };

/** Compact contact strip for the Home page only. Full page lives at /contact. */
export function ContactSection() {
  return (
    <section id="contact" className="contact-section">
      <div className="contact-section__container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="contact-section__card"
        >
          <div className="contact-section__layout">
            <div className="contact-section__intro">
              <h2 className="contact-section__title">
                Let&apos;s create something timeless together.
              </h2>
              <Link to="/contact" className="contact-section__link">
                Get In Touch
                <ArrowRight
                  className="contact-section__link-icon"
                  strokeWidth={1.5}
                />
              </Link>
            </div>

            <div className="contact-section__details">
              {CONTACT_DETAILS.map((item) => {
                const Icon = ICONS[item.icon];
                const content = (
                  <>
                    <span className="contact-section__detail-icon-wrap">
                      <Icon
                        className="contact-section__detail-icon"
                        strokeWidth={1.5}
                        aria-hidden
                      />
                    </span>
                    <span className="contact-section__detail-label">
                      {item.label}
                    </span>
                  </>
                );
                return item.href ? (
                  <a
                    key={item.label}
                    href={item.href}
                    className="contact-section__detail-link"
                  >
                    {content}
                  </a>
                ) : (
                  <div key={item.label} className="contact-section__detail">
                    {content}
                  </div>
                );
              })}
            </div>

            <div className="contact-section__image-wrap">
              <img
                src={ContactSectionImage}
                alt="Architectural blueprint"
                loading="lazy"
                className="contact-section__image"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default ContactSection;
