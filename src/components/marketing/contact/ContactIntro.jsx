import { motion } from "framer-motion";
import { fadeUp } from "@/components/marketing/motion";
import "@/assets/styles/components/ContactIntro.scss";

export function ContactIntro() {
  return (
    <section className="contact-intro">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={fadeUp}
        className="contact-intro__inner"
      >
        <h2 className="contact-intro__title">
          Every project begins
          <br />
          with a conversation.
        </h2>

        <p className="contact-intro__text">
          At AGARA, we believe architecture is an act of listening. We begin by
          understanding how you live, work, and gather — then respond with
          spaces that are contextually rooted, functionally clear, and
          aesthetically timeless. From the first call to the final detail, we
          hold a quiet commitment to craft, integrity, and lasting relationships.
        </p>

        <div className="contact-intro__illustration-wrap" aria-hidden>
          <svg
            viewBox="0 0 180 220"
            className="contact-intro__illustration"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          >
            <path d="M30 200 L30 40 L150 40 L150 200" />
            <path d="M30 40 L90 10 L150 40" />
            <path d="M55 200 L55 90 L125 90 L125 200" />
            <path d="M55 90 L90 65 L125 90" />
            <path d="M70 200 L70 130 L110 130 L110 200" />
            <circle cx="90" cy="160" r="3" fill="currentColor" stroke="none" />
            <path d="M20 200 H160" />
          </svg>
        </div>
      </motion.div>
    </section>
  );
}
