import { motion } from "framer-motion";
import "./ProcessCard.scss";

const stepVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export function ProcessCard({ step, icon: Icon, index, variant }) {
  const isDesktop = variant === "desktop";

  return (
    <motion.div
      key={step.id}
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={stepVariant}
      className={`contact-process__step contact-process__step--${variant}`}
    >
      <div className="contact-process__icon-wrap">
        <Icon
          className="contact-process__icon"
          strokeWidth={1.25}
        />
      </div>
      {isDesktop ? (
        <>
          <p className="contact-process__step-id">{step.id}</p>
          <h3 className="contact-process__step-title">{step.title}</h3>
          <p className="contact-process__step-desc">
            {step.description}
          </p>
        </>
      ) : (
        <div className="contact-process__mobile-content">
          <p className="contact-process__step-id">{step.id}</p>
          <h3 className="contact-process__step-title">{step.title}</h3>
          <p className="contact-process__step-desc">
            {step.description}
          </p>
        </div>
      )}
    </motion.div>
  );
}

export default ProcessCard;
