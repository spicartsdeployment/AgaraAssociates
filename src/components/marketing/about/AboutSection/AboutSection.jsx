import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Flag, Globe, Users } from "lucide-react";
import { fadeUp } from "@/components/marketing/motion";
import { ABOUT_PILLARS } from "@/constants";
import { PhilosophySection } from "@/components/marketing/philosophy/PhilosophySection";
import "./AboutSection.scss";

const ICONS = { Globe, Users, Flag };

export function AboutSection({ variant = "home" }) {
  const isPage = variant === "page";

  return (
    <>
      <section
        id="about"
        className={`about-section${isPage ? " about-section--page" : ""}`}
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="about-section__card"
        >
          <div className="about-section__layout">
            <div className="about-section__image-wrap">
              <img
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=85"
                alt="AGARA Architects — interior corridor with natural light"
                loading="lazy"
                className="about-section__image"
              />
              <div className="about-section__image-gradient-r" />
              <div className="about-section__image-gradient-t" />
            </div>

            <div className="about-section__content">
              <h2 className="about-section__title">About AGARA</h2>
              <span className="about-section__divider" aria-hidden />
              <p className="about-section__description">
                AGARA Architects is a multidisciplinary design practice based in
                Hyderabad, creating architecture, interiors, landscapes and
                construction solutions that are contextually rooted, functionally
                driven and aesthetically timeless.
              </p>
              {/* <Link
                to={isPage ? "/contact" : "/about"}
                className="about-section__link"
              >

                <ArrowRight
                  className="about-section__link-icon"
                  strokeWidth={1.5}
                />
              </Link>*/}
            </div>

            <div className="about-section__pillars">
              {ABOUT_PILLARS.map((pillar, index) => {
                const Icon = ICONS[pillar.icon];
                return (
                  <div
                    key={pillar.title}
                    className={`about-section__pillar${index > 0 ? " about-section__pillar--bordered" : ""
                      }`}
                  >
                    <Icon
                      className="about-section__pillar-icon"
                      strokeWidth={1}
                      aria-hidden
                    />
                    <h3 className="about-section__pillar-title">
                      {pillar.title}
                    </h3>
                    <p className="about-section__pillar-desc">
                      {pillar.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </section>

      {isPage && <PhilosophySection />}
    </>
  );
}

export default AboutSection;
