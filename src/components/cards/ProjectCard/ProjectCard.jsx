import { memo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import "./ProjectCard.scss";

function ProjectCardComponent({ project }) {
  const category = project.subTittle || project.subTitle || "Residential";
  const plotArea = project.plotArea || "420 SQ.YD";
  const location = "Hyderabad" || project.location;

  return (
    <article className="project-card">
      <Link to={`/projects/${project.id}`} className="project-card__link">
        <div className="project-card__media">
          <img
            src={project.img}
            alt={project.title}
            loading="lazy"
            className="project-card__image"
          />
          <div className="project-card__gradient" />
          <div className="project-card__caption-wrap">
            <div className="project-card__caption agara-glass">
              <div className="project-card__caption-content">
                <h3 className="project-card__title">{project.title}</h3>
                <div
                  className="project-card__category"
                  aria-label={`${category} • ${plotArea} • ${location}`}
                >
                  <span className="project-card__category-item">{category}</span>
                  <span className="project-card__category-separator" aria-hidden="true">
                    •
                  </span>
                  <span className="project-card__category-item">{plotArea}</span>
                  <span className="project-card__category-separator" aria-hidden="true">
                    •
                  </span>
                  <span className="project-card__category-item">{location}</span>
                </div>
              </div>
              <span className="project-card__arrow">
                <ArrowRight
                  className="project-card__arrow-icon"
                  strokeWidth={1.5}
                />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

export const ProjectCard = memo(ProjectCardComponent);
export default ProjectCard;
