import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Armchair, ArrowRight, Box, Grid3x3, Trees } from "lucide-react";
import { fadeUp } from "@/components/marketing/motion";
import { SERVICE_ITEMS } from "@/constants";
import "./ServicesSection.scss";

const ICONS = { Box, Armchair, Trees, Grid3x3 };

export function ServicesSection({ variant = "home" }) {
  const isPage = variant === "page";

  return (
    <section
      id="services"
      className={`services-section${
        isPage ? " services-section--page" : " services-section--home"
      }`}
    >
      <div className="services-section__container">
        {isPage && (
          <div className="services-section__header">
            <div>
              <p className="services-section__eyebrow">What We Do</p>
              <h1 className="services-section__title">Services</h1>
            </div>
            <Link to="/contact" className="services-section__cta">
              Get In Touch
              <ArrowRight
                className="services-section__cta-icon"
                strokeWidth={1.5}
              />
            </Link>
          </div>
        )}

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="services-section__panel"
        >
          <div className="services-section__grid">
            {SERVICE_ITEMS.map((item) => {
              const Icon = ICONS[item.icon];
              return (
                <div key={item.title} className="services-section__item">
                  <Icon
                    className="services-section__item-icon"
                    strokeWidth={1}
                    aria-hidden
                  />
                  <h3 className="services-section__item-title">{item.title}</h3>
                  <p className="services-section__item-desc">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default ServicesSection;
