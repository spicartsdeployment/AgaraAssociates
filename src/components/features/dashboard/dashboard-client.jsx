"use client";
import { memo } from "react";
import { DashboardWelcomeBar } from "@/components/organisms/dashboard-welcome-bar";
import { DashboardHero } from "@/components/organisms/dashboard-hero";
import { ProjectAlertsPanel } from "@/components/organisms/project-alerts-panel";
import { ImmediateActionsPanel } from "@/components/organisms/immediate-actions-panel";
import { QuickActionsCard } from "@/components/organisms/quick-actions-panel";
import "@/assets/styles/components/DashboardClient.scss";

export const DashboardClient = memo(function DashboardClient({ data }) {
    const progressPills = [
        { label: "Execution", value: 60, fillVariant: "primary" },
        { label: "Design", value: 35, fillVariant: "accent" },
        { label: "Approvals", value: data.kpis.pendingApprovals * 10, fillVariant: "secondary" },
        { label: "On Budget", value: 92, fillVariant: "accent" },
    ];
    return (<div className="dashboard-client">
      <DashboardWelcomeBar userName={data.user.name} studio={data.studio} progressPills={progressPills} stats={{
            runningProjects: data.kpis.runningProjects,
            pendingApprovals: data.kpis.pendingApprovals,
            revenue: data.kpis.revenue,
        }}/>

      <div className="dashboard-client__grid">
        <div className="dashboard-client__hero">
          <DashboardHero userName={data.user.name} studio={data.studio} userRole={data.user.role} weather={data.weather} onTrackPercent={data.kpis.healthScore}/>
        </div>

        <QuickActionsCard className="dashboard-client__quick-actions"/>

        <ProjectAlertsPanel alerts={data.projectAlerts} className="dashboard-client__alerts"/>
        <ImmediateActionsPanel actions={data.immediateActions} className="dashboard-client__actions"/>
      </div>
    </div>);
});
