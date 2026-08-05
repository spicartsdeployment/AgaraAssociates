import { memo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import "@/assets/styles/components/ProjectDescription.scss";

function ProjectDescriptionComponent({ project }) {
  return (
    <section className="project-description agara-glass">
      <div>
        <div>
          <p className="project-description__text">{project.description}</p>
        </div>

        <div className="project-description__cta-wrap">
          <Link to="/contact" className="project-description__cta">
            Start a Similar Project
            <ArrowRight
              className="project-description__cta-icon"
              strokeWidth={1.5}
            />
          </Link>
        </div>
      </div>
    </section>
  );
}

export const ProjectDescription = memo(ProjectDescriptionComponent);
