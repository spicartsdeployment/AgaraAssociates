import { motion } from "framer-motion";
import { Compass, Eye, Hammer, Lightbulb, PencilRuler } from "lucide-react";
import { fadeUp } from "@/components/marketing/motion";
import { DESIGN_PROCESS_STEPS } from "@/constants";
import { ProcessCard } from "@/components/cards/ProcessCard";
import "@/assets/styles/components/ContactProcess.scss";

const ICONS = [Compass, Eye, Lightbulb, PencilRuler, Hammer];

export function ContactProcess() {
  return (
    <section className="contact-process">
      <div className="contact-process__container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="contact-process__header"
        >
          <p className="contact-process__eyebrow">Our Design Process</p>
          <h2 className="contact-process__title">How We Work</h2>
        </motion.div>

        <div className="contact-process__desktop">
          <div className="contact-process__desktop-track">
            <div className="contact-process__desktop-line" aria-hidden />
            {DESIGN_PROCESS_STEPS.map((step, index) => {
              const Icon = ICONS[index];
              return (
                <ProcessCard
                  key={step.id}
                  step={step}
                  icon={Icon}
                  index={index}
                  variant="desktop"
                />
              );
            })}
          </div>
        </div>

        <div className="contact-process__mobile">
          <div className="contact-process__mobile-line" aria-hidden />
          {DESIGN_PROCESS_STEPS.map((step, index) => {
            const Icon = ICONS[index];
            return (
              <ProcessCard
                key={step.id}
                step={step}
                icon={Icon}
                index={index}
                variant="mobile"
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
