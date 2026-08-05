import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, Mail, Phone, MapPin } from "lucide-react";
import { getClientById } from "@/lib/store/client-store";
import { getProjectsForClient, getQuotationsForClient } from "@/lib/client-workspace";
import { getCommunicationsForClient } from "@/lib/project-modules";
import { PageHeader } from "@/components/templates/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { Avatar, AvatarFallback } from "@/components/common/Avatar";
import { StatusChip } from "@/components/atoms/status-chip";
import { formatCurrency, getInitials } from "@/lib/utils";
import "@/assets/styles/pages/ClientDetailPage.scss";

export function ClientDetailPage() {
    const { id } = useParams();
    const client = getClientById(id);
    if (!client)
        return <Navigate to="/clients" replace/>;
    const projects = getProjectsForClient(id);
    const quotations = getQuotationsForClient(id);
    const communications = getCommunicationsForClient(id);
    return (<div className="client-detail-page">
      <Link to="/clients" className="client-detail-page__back-link">
        <ArrowLeft /> Back to Clients
      </Link>

      <PageHeader title={client.name} description={client.company ?? client.type}>
        <Badge variant="outline">{client.type}</Badge>
      </PageHeader>

      <div className="client-detail-page__layout">
        <Card className="client-detail-page__profile-card">
          <CardContent className="client-detail-page__profile-content">
            <div className="client-detail-page__profile-header">
              <Avatar className="client-detail-page__avatar">
                <AvatarFallback className="client-detail-page__avatar-fallback">{getInitials(client.name)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="client-detail-page__profile-name">{client.name}</p>
                {client.company && <p className="client-detail-page__profile-company">{client.company}</p>}
              </div>
            </div>
            <div className="client-detail-page__contact-list">
              {client.email && <p><Mail />{client.email}</p>}
              {client.phone && <p><Phone />{client.phone}</p>}
              {client.city && <p><MapPin />{client.city}</p>}
            </div>
            <div className="client-detail-page__stats">
              <div><p className="client-detail-page__stat-value">{client.projectCount}</p><p className="client-detail-page__stat-label">Projects</p></div>
              <div><p className="client-detail-page__stat-value">{client.activeProjects}</p><p className="client-detail-page__stat-label">Active</p></div>
              <div><p className="client-detail-page__stat-value client-detail-page__stat-value--sm">{formatCurrency(client.totalRevenue)}</p><p className="client-detail-page__stat-label">Revenue</p></div>
            </div>
            {client.notes && <p className="client-detail-page__notes">{client.notes}</p>}
          </CardContent>
        </Card>

        <div className="client-detail-page__main">
          <Card>
            <CardHeader><CardTitle className="client-detail-page__section-title">Projects</CardTitle></CardHeader>
            <CardContent className="client-detail-page__section-content">
              {projects.length === 0 ? (<p className="client-detail-page__empty">No projects linked.</p>) : projects.map((p) => (<Link key={p.id} to={`/app/projects/${p.id}`} className="client-detail-page__list-link">
                  <div>
                    <p className="client-detail-page__profile-name">{p.name}</p>
                    <p className="client-detail-page__list-link-meta">{p.city} · {p.progress}% complete</p>
                  </div>
                  <StatusChip status={p.status}/>
                </Link>))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="client-detail-page__section-title">Quotations</CardTitle></CardHeader>
            <CardContent className="client-detail-page__section-content">
              {quotations.length === 0 ? (<p className="client-detail-page__empty">No quotations yet.</p>) : quotations.map((q) => (<Link key={q.id} to={`/quotations/${q.id}?client=${id}`} className="client-detail-page__list-link">
                  <div>
                    <p className="client-detail-page__profile-name">{q.title}</p>
                    <p className="client-detail-page__list-link-meta">{q.projectName}</p>
                  </div>
                  <div className="client-detail-page__list-link-right">
                    <p className="client-detail-page__list-link-amount">{formatCurrency(q.amount)}</p>
                    <StatusChip status={q.status} type="quotation"/>
                  </div>
                </Link>))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="client-detail-page__section-title">Communications</CardTitle></CardHeader>
            <CardContent className="client-detail-page__section-content">
              {communications.length === 0 ? (<p className="client-detail-page__empty">No communication log.</p>) : communications.map((c) => (<div key={c.id} className="client-detail-page__comm-item">
                  <div className="client-detail-page__comm-header">
                    <p className="client-detail-page__comm-subject">{c.subject}</p>
                    <Badge variant="outline" className="client-detail-page__comm-badge">{c.type}</Badge>
                  </div>
                  <p className="client-detail-page__comm-summary">{c.summary}</p>
                  <p className="client-detail-page__comm-date">{c.date}</p>
                </div>))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>);
}
