import { motion } from "framer-motion";
import {
  Clock,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { fadeUp } from "@/components/marketing/motion";
import { PinterestIcon } from "@/components/marketing/icons";
import ContactForm from "@/components/forms/ContactForm";
import { STUDIO_ADDRESS } from "@/constants";
import "@/assets/styles/components/ContactMain.scss";

export function ContactMain() {
  return (
    <section id="inquiry" className="contact-main">
      <div className="contact-main__grid">
        <motion.aside
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeUp}
          className="contact-main__aside agara-glass"
        >
          <p className="contact-main__section-label">Contact Information</p>
          <h2 className="contact-main__heading">Reach the studio</h2>

          <ul className="contact-main__info-list">
            <li className="contact-main__info-item">
              <MapPin
                className="contact-main__info-icon"
                strokeWidth={1.5}
              />
              <div>
                <p className="contact-main__label">Visit</p>
                <p className="contact-main__info-text contact-main__info-text--relaxed">
                  {STUDIO_ADDRESS.lines.map((line) => (
                    <span key={line} className="contact-main__info-line">
                      {line}
                    </span>
                  ))}
                </p>
              </div>
            </li>
            <li className="contact-main__info-item">
              <Mail className="contact-main__info-icon" strokeWidth={1.5} />
              <div>
                <p className="contact-main__label">Email</p>
                <a
                  href={`mailto:${STUDIO_ADDRESS.email}`}
                  className="contact-main__info-link"
                >
                  {STUDIO_ADDRESS.email}
                </a>
              </div>
            </li>
            <li className="contact-main__info-item">
              <Phone className="contact-main__info-icon" strokeWidth={1.5} />
              <div>
                <p className="contact-main__label">Phone</p>
                <a
                  href={`tel:${STUDIO_ADDRESS.phone.replace(/\s/g, "")}`}
                  className="contact-main__info-link"
                >
                  {STUDIO_ADDRESS.phone}
                </a>
              </div>
            </li>
            <li className="contact-main__info-item">
              <Clock className="contact-main__info-icon" strokeWidth={1.5} />
              <div>
                <p className="contact-main__label">Office Hours</p>
                <p className="contact-main__info-text">
                  {STUDIO_ADDRESS.hours}
                </p>
              </div>
            </li>
          </ul>

          <div className="contact-main__socials">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="contact-main__social-link"
            >
              <Instagram className="contact-main__social-icon" strokeWidth={1.5} />
            </a>
            <a
              href="https://pinterest.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Pinterest"
              className="contact-main__social-link"
            >
              <PinterestIcon className="contact-main__social-icon" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="contact-main__social-link"
            >
              <Linkedin className="contact-main__social-icon" strokeWidth={1.5} />
            </a>
          </div>
        </motion.aside>

        <ContactForm />
      </div>
    </section>
  );
}
