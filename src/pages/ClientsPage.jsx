import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { getAllClients } from "@/lib/store/client-store";
import { PageHeader } from "@/components/templates/page-header";
import { Card, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Badge } from "@/components/common/Badge";
import { Avatar, AvatarFallback } from "@/components/common/Avatar";
import { formatCurrency, getInitials } from "@/lib/utils";
import "@/assets/styles/pages/ClientsPage.scss";

export function ClientsPage() {
    const clients = getAllClients();
    return (<div className="clients-page">
      <PageHeader title="Clients" description="Client relationship management and contact directory">
        <Button className="clients-page__action-btn" asChild>
          <Link to="/app/projects/new"><Plus className="clients-page__action-icon"/> Add via Project</Link>
        </Button>
      </PageHeader>

      <div className="clients-page__grid">
        {clients.map((client) => (<Link key={client.id} to={`/clients/${client.id}`} className="clients-page__card-link">
          <Card className="clients-page__card">
            <CardContent className="clients-page__card-content">
              <div className="clients-page__card-header">
                <Avatar className="clients-page__avatar">
                  <AvatarFallback className="clients-page__avatar-fallback">
                    {getInitials(client.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="clients-page__card-info">
                  <h3 className="clients-page__client-name">{client.name}</h3>
                  {client.company && (<p className="clients-page__client-company">{client.company}</p>)}
                </div>
                <Badge variant="outline">{client.type}</Badge>
              </div>

              <div className="clients-page__contact-list">
                {client.email && <p>{client.email}</p>}
                {client.phone && <p>{client.phone}</p>}
                {client.city && <p>{client.city}</p>}
              </div>

              <div className="clients-page__stats">
                <div>
                  <p className="clients-page__stat-value">{client.projectCount}</p>
                  <p className="clients-page__stat-label">Projects</p>
                </div>
                <div>
                  <p className="clients-page__stat-value">{client.activeProjects}</p>
                  <p className="clients-page__stat-label">Active</p>
                </div>
                <div>
                  <p className="clients-page__stat-value clients-page__stat-value--sm">{formatCurrency(client.totalRevenue)}</p>
                  <p className="clients-page__stat-label">Revenue</p>
                </div>
              </div>

              <p className="clients-page__last-contact">Last contact: {client.lastContact}</p>
            </CardContent>
          </Card>
          </Link>))}
      </div>
    </div>);
}
