import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { fadeUp } from "@/components/marketing/motion";
import { CONTACT_FAQS } from "@/constants";
import "@/assets/styles/components/ContactBottom.scss";

const CTA_IMAGE =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85";

function FaqItem({ item, open, onToggle }) {
  return (
    <div className="contact-bottom__faq-item agara-glass">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="contact-bottom__faq-trigger"
      >
        <span className="contact-bottom__faq-question">{item.q}</span>
        <ChevronDown
          className={`contact-bottom__faq-chevron${
            open ? " contact-bottom__faq-chevron--open" : ""
          }`}
          strokeWidth={1.5}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="contact-bottom__faq-answer-wrap"
          >
            <p className="contact-bottom__faq-answer">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ContactBottom() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="contact-bottom">
      <div className="contact-bottom__grid">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeUp}
        >
          <p className="contact-bottom__eyebrow">FAQ</p>
          <h2 className="contact-bottom__title">Questions, answered</h2>
          <div className="contact-bottom__faq-list">
            {CONTACT_FAQS.map((item, index) => (
              <FaqItem
                key={item.q}
                item={item}
                open={openIndex === index}
                onToggle={() =>
                  setOpenIndex((current) => (current === index ? -1 : index))
                }
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeUp}
          className="contact-bottom__cta-card"
        >
          <img
            src={CTA_IMAGE}
            alt="Architectural interior — ready to begin"
            className="contact-bottom__cta-image"
            loading="lazy"
          />
          <div className="contact-bottom__cta-overlay" />
          <div className="contact-bottom__cta-content">
            <p className="contact-bottom__cta-eyebrow">Ready to Begin?</p>
            <h2 className="contact-bottom__cta-title">
              Let&apos;s create a space that lasts generations.
            </h2>
            <Link to="#inquiry" className="contact-bottom__cta-link">
              Book a Consultation
              <ArrowRight
                className="contact-bottom__cta-link-icon"
                strokeWidth={1.5}
              />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
