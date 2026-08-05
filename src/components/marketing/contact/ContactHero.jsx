import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { fadeUp } from "@/components/marketing/motion";
import "@/assets/styles/components/ContactHero.scss";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1800&q=85";

export function ContactHero() {
  return (
    <section className="contact-hero">
      <div className="contact-hero__bg">
        <img
          src={HERO_IMAGE}
          alt="Luxury modern villa — AGARA Architects"
          className="contact-hero__bg-image"
        />
        <div className="contact-hero__gradient-r" />
        <div className="contact-hero__gradient-t" />
      </div>

      <div className="contact-hero__content-wrap">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="contact-hero__panel agara-glass"
        >
          <p className="contact-hero__eyebrow">Contact</p>
          <h1 className="contact-hero__title">
            Let&apos;s Build
            <br />
            Something Meaningful
          </h1>
          <p className="contact-hero__description">
            A conversation is where every enduring space begins — with clarity,
            context, and shared ambition.
          </p>
          <Link to="#inquiry" className="contact-hero__cta">
            Start Your Project
            <ArrowRight
              className="contact-hero__cta-icon"
              strokeWidth={1.5}
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
