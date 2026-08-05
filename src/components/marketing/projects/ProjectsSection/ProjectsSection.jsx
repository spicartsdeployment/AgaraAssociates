import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { project_info } from "@/constants";
import { ProjectsGrid } from "@/components/marketing/projects/ProjectsGrid";
import "./ProjectsSection.scss";

export function ProjectsSection({ variant = "home", limit }) {
  const isPage = variant === "page";
  const items =
    typeof limit === "number" ? project_info.slice(0, limit) : project_info;

  return (
    <section
      id="projects"
      className={`projects-section${isPage ? " projects-section--page" : ""}`}
    >
      <div className="projects-section__container">
        <div className="projects-section__header">
          <div>
            {isPage && (
              <p className="projects-section__eyebrow">Portfolio</p>
            )}
            <h2
              className={`projects-section__title${
                isPage ? " projects-section__title--page" : ""
              }`}
            >
              {isPage ? "All Projects" : "Selected Projects"}
            </h2>
          </div>
          {variant === "home" && (
            <Link to="/projects" className="projects-section__link">
              View All Projects
              <ArrowRight
                className="projects-section__link-icon"
                strokeWidth={1.5}
              />
            </Link>
          )}
        </div>

        <ProjectsGrid projects={items} />
      </div>
    </section>
  );
}

export default ProjectsSection;
