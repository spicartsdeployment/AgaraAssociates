import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { project_info } from "@/constants";
import { ProjectHero } from "@/components/marketing/projects/ProjectHero";
import { ProjectDescription } from "@/components/marketing/projects/ProjectDescription";
import { ProjectGallery } from "@/components/gallery/ProjectGallery";
import "@/assets/styles/pages/MarketingProjectDetailPage.scss";

export default function MarketingProjectDetailPage() {
  const { id } = useParams();
  const project =
    project_info.find((item) => String(item.id) === String(id)) ?? null;

  if (!project) {
    return (
      <section className="marketing-project-detail-page">
        <div className="marketing-project-detail-page__not-found agara-glass">
          <h1 className="marketing-project-detail-page__not-found-title">
            Project not found
          </h1>
          <Link
            to="/projects"
            className="marketing-project-detail-page__not-found-link"
          >
            <ArrowLeft
              className="marketing-project-detail-page__not-found-icon"
              strokeWidth={1.5}
            />
            Back to Projects
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="marketing-project-detail-page">
      <div className="marketing-project-detail-page__container">
        <ProjectHero project={project} />
        <ProjectDescription project={project} />
        <ProjectGallery images={project.images} />
      </div>
    </section>
  );
}
