"use client";
import { useLayoutEffect, useRef } from "react";
import { FolderKanban, IndianRupee, Building2 } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { cx } from "@/lib/utils";
import "@/assets/styles/components/DashboardWelcomeBar.scss";

function formatRevenue(amount) {
    return `₹${(amount / 100000).toFixed(1)}L`;
}

function ProgressPill({ label, value, fillVariant }) {
    const fillRef = useRef(null);
    useLayoutEffect(() => {
        if (fillRef.current) {
            fillRef.current.style.setProperty("--progress-width", `${Math.min(value, 100)}%`);
        }
    }, [value]);
    return (<div className="dashboard-welcome-bar__pill glass-pill">
      <span className="dashboard-welcome-bar__pill-label">{label}</span>
      <div className="dashboard-welcome-bar__progress-track">
        <div ref={fillRef} className={cx("dashboard-welcome-bar__progress-fill", `dashboard-welcome-bar__progress-fill--${fillVariant}`)}/>
      </div>
      <span className="dashboard-welcome-bar__pill-value">{value}%</span>
    </div>);
}

export function DashboardWelcomeBar({ userName, studio, progressPills, stats, }) {
    const displayName = userName.includes(" ")
        ? userName.split(" ")[0]
        : userName;
    return (<div className="dashboard-welcome-bar">
      <div className="dashboard-welcome-bar__main">
        <div>
          <p className="dashboard-welcome-bar__studio">{studio}</p>
          <h1 className="dashboard-welcome-bar__title">
            Welcome in, {displayName}
          </h1>
        </div>

        <div className="dashboard-welcome-bar__pills">
          {progressPills.map((pill) => (<ProgressPill key={pill.label} label={pill.label} value={pill.value} fillVariant={pill.fillVariant}/>))}
        </div>
      </div>

      <div className="dashboard-welcome-bar__stats">
        {[
            { icon: Building2, value: stats.runningProjects, label: "Active" },
            { icon: FolderKanban, value: stats.pendingApprovals, label: "Pending" },
            { icon: IndianRupee, value: formatRevenue(stats.revenue), label: "Revenue" },
        ].map((stat) => (<GlassCard key={stat.label} variant="subtle" className="dashboard-welcome-bar__stat-card">
            <stat.icon className="dashboard-welcome-bar__stat-icon" strokeWidth={1.5}/>
            <div className="dashboard-welcome-bar__stat-text">
              <p className="dashboard-welcome-bar__stat-value">{stat.value}</p>
              <p className="dashboard-welcome-bar__stat-label">{stat.label}</p>
            </div>
          </GlassCard>))}
      </div>
    </div>);
}
