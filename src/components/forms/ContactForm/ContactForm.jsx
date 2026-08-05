import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import {
  BUDGET_OPTIONS,
  PROJECT_TYPE_OPTIONS,
  TIMELINE_OPTIONS,
} from "@/constants";
import "./ContactForm.scss";

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
};

const itemFade = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={stagger}
      className="contact-main__form-panel agara-glass"
    >
      <motion.p variants={itemFade} className="contact-main__section-label">
        Inquiry
      </motion.p>
      <motion.h2 variants={itemFade} className="contact-main__heading">
        Tell us about your project
      </motion.h2>

      {submitted ? (
        <motion.p variants={itemFade} className="contact-main__success">
          Thank you. We&apos;ve received your inquiry and will respond shortly.
        </motion.p>
      ) : (
        <form onSubmit={handleSubmit} className="contact-main__form">
          <motion.label
            variants={itemFade}
            className="contact-main__field contact-main__field--half"
          >
            <span className="contact-main__label">Full Name</span>
            <input
              required
              name="fullName"
              className="contact-main__input"
              placeholder="Your name"
            />
          </motion.label>
          <motion.label
            variants={itemFade}
            className="contact-main__field contact-main__field--half"
          >
            <span className="contact-main__label">Email</span>
            <input
              required
              type="email"
              name="email"
              className="contact-main__input"
              placeholder="you@example.com"
            />
          </motion.label>
          <motion.label
            variants={itemFade}
            className="contact-main__field contact-main__field--half"
          >
            <span className="contact-main__label">Phone</span>
            <input
              name="phone"
              className="contact-main__input"
              placeholder="+91 …"
            />
          </motion.label>
          <motion.label
            variants={itemFade}
            className="contact-main__field contact-main__field--half"
          >
            <span className="contact-main__label">Project Type</span>
            <select
              name="projectType"
              className="contact-main__input"
              defaultValue=""
            >
              <option value="" disabled>
                Select type
              </option>
              {PROJECT_TYPE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </motion.label>
          <motion.label
            variants={itemFade}
            className="contact-main__field contact-main__field--half"
          >
            <span className="contact-main__label">Budget</span>
            <select name="budget" className="contact-main__input" defaultValue="">
              <option value="" disabled>
                Select range
              </option>
              {BUDGET_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </motion.label>
          <motion.label
            variants={itemFade}
            className="contact-main__field contact-main__field--half"
          >
            <span className="contact-main__label">Timeline</span>
            <select
              name="timeline"
              className="contact-main__input"
              defaultValue=""
            >
              <option value="" disabled>
                Select timeline
              </option>
              {TIMELINE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </motion.label>
          <motion.label
            variants={itemFade}
            className="contact-main__field contact-main__field--full"
          >
            <span className="contact-main__label">Project Details</span>
            <textarea
              name="details"
              rows={5}
              className="contact-main__input contact-main__input--textarea"
              placeholder="Share site context, program, and what success looks like…"
            />
          </motion.label>
          <motion.div variants={itemFade} className="contact-main__submit-wrap">
            <button type="submit" className="contact-main__submit">
              Send Inquiry
              <ArrowRight
                className="contact-main__submit-icon"
                strokeWidth={1.5}
              />
            </button>
          </motion.div>
        </form>
      )}
    </motion.div>
  );
}

export default ContactForm;
