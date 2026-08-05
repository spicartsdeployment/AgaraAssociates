import { Infinity as InfinityIcon, Building2, Compass, Users2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fadeUp } from "@/components/marketing/motion";
import { PHILOSOPHY_PILLARS } from "@/constants";
import "./PhilosophySection.scss";

const ICONS = { Building2, Compass, Infinity: InfinityIcon, Users2 };

export function PhilosophySection() {
  return (
    <section className="philosophy-section">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="philosophy-section__layout"
      >
        <div className="philosophy-section__intro">
          <p className="philosophy-section__eyebrow">OUR PHILOSOPHY</p>
          <h2 className="philosophy-section__title">
            No two projects.
            <br />
            No repeated ideas.
          </h2>
          <p className="philosophy-section__description">
            Every site is unique. Every client is unique.
            <br />
            So every design we create is unique.
          </p>
          <Link to="/about" className="philosophy-section__link">
            Discover Our Philosophy
            <ArrowRight
              className="philosophy-section__link-icon"
              strokeWidth={1.5}
            />
          </Link>
        </div>

        <div className="philosophy-section__panel">
          <div className="philosophy-section__grid">
            {PHILOSOPHY_PILLARS.map((pillar, index) => {
              const Icon = ICONS[pillar.icon];
              const modifierClasses = [
                index !== 0 ? "philosophy-section__pillar--border-left" : "",
                index >= 2 ? "philosophy-section__pillar--border-top" : "",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <div
                  key={pillar.title}
                  className={`philosophy-section__pillar${modifierClasses ? ` ${modifierClasses}` : ""}`}
                >
                  <Icon
                    className="philosophy-section__pillar-icon"
                    strokeWidth={1}
                  />
                  <h3 className="philosophy-section__pillar-title">
                    {pillar.title}
                  </h3>
                  <p className="philosophy-section__pillar-desc">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default PhilosophySection;
