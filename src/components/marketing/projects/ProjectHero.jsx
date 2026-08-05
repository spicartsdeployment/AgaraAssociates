import { memo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "@/assets/styles/components/ProjectHero.scss";

function ProjectHeroComponent({ project }) {
  const category = project.subTittle || project.subTitle || "";

  return (
    <div className="project-hero">
      <Link to="/projects" className="project-hero__back-link">
        <ArrowLeft className="project-hero__back-icon" strokeWidth={1.5} />
        All Projects
      </Link>

      <div className="project-hero__meta">
        <p className="project-hero__category">{category}</p>
        <h1 className="project-hero__title">{project.title}</h1>
      </div>

      <div className="project-hero__image-wrap">
        <img
          src={project.img}
          alt={project.title}
          className="project-hero__image"
        />
      </div>
    </div>
  );
}

export const ProjectHero = memo(ProjectHeroComponent);
