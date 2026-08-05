"use client";
import { useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Users, ChevronRight, ArrowLeft } from "lucide-react";
import { getAllClients } from "@/lib/store/client-store";
import { getClientWorkspaceStats, resolveClientLabel } from "@/lib/client-workspace";
import { PageHeader } from "@/components/templates/page-header";
import { Card, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Badge } from "@/components/common/Badge";
import { Avatar, AvatarFallback } from "@/components/common/Avatar";
import { getInitials } from "@/lib/utils";
import "@/assets/styles/components/ClientWorkspaceShell.scss";

export function ClientWorkspaceShell({ moduleTitle, moduleDescription, basePath, statLabels, headerActions, children, }) {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const clientId = searchParams.get("client") ?? "";
    const clients = getAllClients();
    const selectedClient = useMemo(() => clients.find((c) => c.id === clientId), [clients, clientId]);
    const selectClient = useCallback((id) => {
        navigate(`${basePath}?client=${encodeURIComponent(id)}`);
    }, [navigate, basePath]);
    const clearClient = useCallback(() => {
        navigate(basePath);
    }, [navigate, basePath]);
    if (!selectedClient) {
        return (<div className="client-workspace-shell">
        <PageHeader title={moduleTitle} description={moduleDescription}/>

        <Card className="client-workspace-shell__prompt-card">
          <CardContent className="client-workspace-shell__prompt-content">
            <Users className="client-workspace-shell__prompt-icon"/>
            <div>
              <p className="client-workspace-shell__prompt-title">Select a client to continue</p>
              <p className="client-workspace-shell__prompt-text">
                {moduleTitle} is organized by client. Choose a client to view their projects, files, and records.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="client-workspace-shell__grid">
          {clients.map((client) => {
                const stats = getClientWorkspaceStats(client.id);
                const itemCount = statLabels?.items === "quotations"
                    ? stats.quotationCount
                    : statLabels?.items === "boq"
                        ? stats.boqCount
                        : statLabels?.items === "drawings"
                            ? stats.drawingCount
                            : stats.projectCount;
                return (<button key={client.id} type="button" onClick={() => selectClient(client.id)} className="client-workspace-shell__client-card">
                <div className="client-workspace-shell__client-card-inner">
                  <Avatar className="client-workspace-shell__avatar">
                    <AvatarFallback className="client-workspace-shell__avatar-fallback">
                      {getInitials(client.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="client-workspace-shell__client-info">
                    <p className="client-workspace-shell__client-name">{client.name}</p>
                    {client.company && (<p className="client-workspace-shell__client-company">{client.company}</p>)}
                    <div className="client-workspace-shell__badges">
                      <Badge variant="outline" className="client-workspace-shell__badge">
                        {stats.projectCount} project{stats.projectCount !== 1 ? "s" : ""}
                      </Badge>
                      {itemCount > 0 && (<Badge variant="secondary" className="client-workspace-shell__badge">
                          {itemCount} {statLabels?.itemLabel ?? "items"}
                        </Badge>)}
                    </div>
                  </div>
                  <ChevronRight className="client-workspace-shell__chevron"/>
                </div>
              </button>);
            })}
        </div>
      </div>);
    }
    const clientName = resolveClientLabel(clientId);
    const stats = getClientWorkspaceStats(clientId);
    return (<div className="client-workspace-shell">
      <div className="client-workspace-shell__header-row">
        <div className="client-workspace-shell__header-main">
          <Button variant="ghost" size="sm" className="client-workspace-shell__back-btn" onClick={clearClient}>
            <ArrowLeft className="client-workspace-shell__back-icon"/> Change client
          </Button>
          <PageHeader title={moduleTitle} description={<span>
                <span className="client-workspace-shell__description-name">{clientName}</span>
                <span className="client-workspace-shell__description-meta"> · {stats.projectCount} active project{stats.projectCount !== 1 ? "s" : ""}</span>
              </span>}/>
        </div>
        {headerActions && <div className="client-workspace-shell__header-actions">{headerActions}</div>}
      </div>

      <div className="client-workspace-shell__context-bar">
        <Avatar className="client-workspace-shell__context-avatar">
          <AvatarFallback className="client-workspace-shell__context-avatar-fallback">
            {getInitials(selectedClient.name)}
          </AvatarFallback>
        </Avatar>
        <div className="client-workspace-shell__context-info">
          <p className="client-workspace-shell__context-name">{selectedClient.name}</p>
          <p className="client-workspace-shell__context-meta">
            {selectedClient.city}{selectedClient.type ? ` · ${selectedClient.type}` : ""}
          </p>
        </div>
        <Badge variant="outline" className="client-workspace-shell__context-badge">Client workspace</Badge>
      </div>

      {children({ clientId, clientName: selectedClient.name })}
    </div>);
}
