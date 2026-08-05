import { motion } from "framer-motion";
import { ArrowUpRight, MapPin } from "lucide-react";
import { fadeUp } from "@/components/marketing/motion";
import { STUDIO_ADDRESS } from "@/constants";
import "@/assets/styles/components/ContactLocation.scss";

export function ContactLocation() {
  return (
    <section className="contact-location">
      <div className="contact-location__grid">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeUp}
          className="contact-location__info agara-glass"
        >
          <p className="contact-location__eyebrow">Studio</p>
          <h2 className="contact-location__title">Visit Our Studio</h2>
          <div className="contact-location__address-row">
            <MapPin
              className="contact-location__address-icon"
              strokeWidth={1.5}
            />
            <p className="contact-location__address-text">
              {STUDIO_ADDRESS.lines.map((line) => (
                <span key={line} className="contact-location__address-line">
                  {line}
                </span>
              ))}
            </p>
          </div>
          <a
            href={STUDIO_ADDRESS.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="contact-location__maps-link"
          >
            Open in Google Maps
            <ArrowUpRight
              className="contact-location__maps-icon"
              strokeWidth={1.5}
            />
          </a>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeUp}
          className="contact-location__map-wrap"
        >
          <iframe
            title="AGARA Architects studio location — Hyderabad"
            src={STUDIO_ADDRESS.embedUrl}
            className="contact-location__map"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </motion.div>
      </div>
    </section>
  );
}
