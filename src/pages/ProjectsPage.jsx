import { Link } from "react-router-dom";
import { Plus, MapPin, LayoutGrid, User, DollarSign } from "lucide-react";
import { getAllProjects } from "@/lib/store/project-store";
import { PageHeader } from "@/components/templates/page-header";
import { StatusChip } from "@/components/atoms/status-chip";
import { Card, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/common/Avatar";
import { Badge } from "@/components/common/Badge";
import { SERVICE_TYPE_LABELS } from "@/lib/constants/onboarding";
import { formatCurrency, getInitials } from "@/lib/utils";
import "@/assets/styles/pages/ProjectsPage.scss";

function toTitleCase(value) {
  if (!value) return "";
  return String(value)
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function ProjectsPage() {
  const projects = getAllProjects();
  return (<div className="projects-page">
    <PageHeader title="Projects" description="Manage your architecture and design projects">
      <Button className="projects-page__action-btn" asChild>
        <Link to="/app/projects/new">
          <Plus className="projects-page__action-icon" /> New Project
        </Link>
      </Button>
    </PageHeader>

    <div className="projects-page__grid">
      {projects.map((project) => {
        const projectTypeLabel = toTitleCase(project.type || project.projectType);
        const locationLabel = [project.location, project.city].filter(Boolean).join(", ");
        const plotArea = project.constructionDetails?.plotArea || project.constructionDetails?.builtUpArea;
        const plotLabel = plotArea ? `${plotArea} sq.ft` : null;
        const locationPlot = [locationLabel, plotLabel].filter(Boolean).join(" · ");
        const badges = project.serviceTypes || [];
        const visibleBadges = badges.slice(0, 3);
        const extraBadgeCount = badges.length > 3 ? badges.length - 3 : 0;

        return (<Link key={project.id} to={`/app/projects/${project.id}`} className="projects-page__card-link">
          <Card className="projects-page__card">
            <div className="projects-page__card-banner">
              <div className="projects-page__status-overlay">
                <StatusChip status={project.status} />
              </div>
            </div>
            <CardContent className="projects-page__card-content">
              <div className="projects-page__card-heading">
                <h3 className="projects-page__project-name">{project.name}</h3>
                <p className="projects-page__project-type">{projectTypeLabel}</p>
              </div>

              <div className="projects-page__info-row">
                {locationPlot ? (
                  <p className="projects-page__info-item">
                    <MapPin className="projects-page__info-icon" />
                    <span>{locationPlot}</span>
                  </p>
                ) : null}
              </div>

              <div className="projects-page__info-row">
                <p className="projects-page__info-item">
                  <User className="projects-page__info-icon" />
                  <span>{project.clientName}</span>
                </p>
              </div>

              <div className="projects-page__badge-row">
                {visibleBadges.map((service) => (
                  <Badge key={service} variant="outline" className="projects-page__type-badge">
                    {SERVICE_TYPE_LABELS[service] || toTitleCase(service)}
                  </Badge>
                ))}
                {extraBadgeCount > 0 && (
                  <Badge variant="outline" className="projects-page__type-badge">
                    +{extraBadgeCount}
                  </Badge>
                )}
              </div>

              <div className="projects-page__progress-block">
                <div className="projects-page__progress-label-row">
                  <span>Progress</span>
                  <strong>{project.progress}%</strong>
                </div>
                <Progress value={project.progress} className="projects-page__progress" />
              </div>

              <div className="projects-page__budget-row">
                <div className="projects-page__budget-meta">
                  <DollarSign className="projects-page__budget-icon" />
                  <span>Budget</span>
                </div>
                <span className="projects-page__budget-value">{formatCurrency(project.budget)}</span>
              </div>
            </CardContent>
          </Card>
        </Link>);
      })}
    </div>
  </div>);
}
