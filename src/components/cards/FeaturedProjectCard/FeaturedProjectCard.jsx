import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { project_info } from "@/constants";
import "./FeaturedProjectCard.scss";

const featuredProject = project_info?.[0] ?? null;

export function FeaturedProjectCard({ onPlayClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="featured-project-card"
    >
      <div className="featured-project-card__inner">
        <button
          type="button"
          className="featured-project-card__play-btn"
          aria-label="Play project film"
          onClick={onPlayClick}
        >
          <Play className="featured-project-card__play-icon" />
        </button>
        <div className="featured-project-card__content">
          <p className="featured-project-card__label">Featured Project</p>
          <p className="featured-project-card__title">
            {featuredProject?.title || "Featured Project"}
          </p>
          <p className="featured-project-card__location">
            {featuredProject?.subTittle || "Hyderabad, India"}
          </p>
        </div>
      </div>
      <Link
        to={featuredProject ? `/projects/${featuredProject.id}` : "/projects"}
        className="featured-project-card__link"
      >
        View Project
        <ArrowRight className="featured-project-card__link-icon" strokeWidth={1.5} />
      </Link>
    </motion.div>
  );
}

export default FeaturedProjectCard;
