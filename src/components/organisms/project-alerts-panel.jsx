"use client";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/common/Badge";
import { GlassCard } from "@/components/ui/glass-card";
import { Calendar, Clock, Package, AlertTriangle, ChevronRight, FolderKanban, FileCheck, HardHat, Activity, TrendingUp, IndianRupee, Users, CircleDot, } from "lucide-react";
import { cx } from "@/lib/utils";
import { format, parseISO, isToday, isTomorrow } from "date-fns";
import "@/assets/styles/components/ProjectAlertsPanel.scss";

const alertTypeStyles = {
  active_project: {
    label: "Active Project",
    short: "Active",
    icon: FolderKanban,
  },
  deadline: {
    label: "Deadline",
    short: "Due",
    icon: Clock,
  },
  approval: {
    label: "Approval",
    short: "Approve",
    icon: FileCheck,
  },
  site_visit: {
    label: "Site Visit",
    short: "Site",
    icon: HardHat,
  },
  activity: {
    label: "Activity",
    short: "Activity",
    icon: Activity,
  },
  project_status: {
    label: "Status",
    short: "Status",
    icon: CircleDot,
  },

  material: {
    label: "Material",
    short: "Stock",
    icon: Package,
  },
  workload: {
    label: "Workload",
    short: "Team",
    icon: Users,
  },

};

const filterTypes = [
  "deadline",
  "approval",
  "site_visit",
  "material",
];

function formatDueLabel(dueAt) {
  const date = parseISO(dueAt);
  if (isToday(date))
    return `Today · ${format(date, "h:mm a")}`;
  if (isTomorrow(date))
    return `Tomorrow · ${format(date, "h:mm a")}`;
  return format(date, "MMM d · h:mm a");
}

function AlertItem({ alert }) {
  const style = alertTypeStyles[alert.type];

  // Skip unknown alert types
  if (!style) {
    console.warn("Unknown alert type:", alert.type);
    return null;
  }

  const Icon = style.icon;

  const row = (
    <div
      className={cx(
        "project-alerts-panel__row",
        `project-alerts-panel__row--${alert.type}`,
        alert.href && "project-alerts-panel__row--clickable",
        alert.severity === "critical" &&
        "project-alerts-panel__row--critical"
      )}
    >
      <span
        className={cx(
          "project-alerts-panel__accent-bar",
          `project-alerts-panel__accent-bar--${alert.type}`
        )}
      />

      <div
        className={cx(
          "project-alerts-panel__icon-box",
          `project-alerts-panel__icon-box--${alert.type}`
        )}
      >
        <Icon className="project-alerts-panel__icon" strokeWidth={1.5} />
      </div>

      <div className="project-alerts-panel__body">
        <div className="project-alerts-panel__body-top">
          <p className="project-alerts-panel__alert-title">
            {alert.title}
          </p>

          <div className="project-alerts-panel__due-wrap">
            {alert.severity === "critical" && (
              <AlertTriangle
                className="project-alerts-panel__critical-icon"
                strokeWidth={1.5}
              />
            )}

            <span className="project-alerts-panel__due-label">
              {formatDueLabel(alert.dueAt)}
            </span>
          </div>
        </div>

        <div className="project-alerts-panel__meta">
          <span className="project-alerts-panel__project-name">
            {alert.projectName}
          </span>

          <Badge
            variant="outline"
            className={cx(
              "project-alerts-panel__type-badge",
              `project-alerts-panel__type-badge--${alert.type}`
            )}
          >
            {style.label}
          </Badge>
        </div>

        {alert.description && (
          <p className="project-alerts-panel__description">
            {alert.description}
          </p>
        )}
      </div>

      {alert.href && (
        <ChevronRight
          className="project-alerts-panel__chevron"
          strokeWidth={1.5}
        />
      )}
    </div>
  );

  return alert.href ? (
    <Link
      to={alert.href}
      className="project-alerts-panel__link"
    >
      {row}
    </Link>
  ) : (
    row
  );
}

export function ProjectAlertsPanel({ alerts, className }) {
  const [filter, setFilter] = useState("all");
  const urgentCount = alerts.filter((a) => a.severity === "critical").length;
  const todayDeadlines = alerts.filter((a) => a.type === "deadline" && isToday(parseISO(a.dueAt)));
  const filtered = filter === "all" ? alerts : alerts.filter((a) => a.type === filter);
  const filters = [
    { id: "all", label: "All", count: alerts.length },
    ...filterTypes.map((type) => ({
      id: type,
      label: alertTypeStyles[type].short,
      count: alerts.filter((a) => a.type === type).length,
    })),
  ];
  return (<GlassCard className={cx("project-alerts-panel", className)}>
    <div className="project-alerts-panel__header">
      <div className="project-alerts-panel__header-text">
        <h2 className="project-alerts-panel__title">Business Alerts</h2>
        <p className="project-alerts-panel__subtitle">
          {todayDeadlines.length > 0
            ? `${todayDeadlines.length} deadline${todayDeadlines.length > 1 ? "s" : ""} today · ${alerts.length} total`
            : `${alerts.length} active alerts across portfolio`}
        </p>
      </div>
      {urgentCount > 0 && (<Badge className="project-alerts-panel__urgent-badge">
        {urgentCount} urgent
      </Badge>)}
    </div>

    <div className="project-alerts-panel__filters">
      {filters.map((f) => {
        const isActive = filter === f.id;
        return (<button key={f.id} type="button" onClick={() => setFilter(f.id)} className={cx("project-alerts-panel__filter", isActive && f.id === "all" && "project-alerts-panel__filter--active-all", isActive && f.id !== "all" && `project-alerts-panel__filter--active-${f.id}`)}>
          {f.label}
          <span className="project-alerts-panel__filter-count">({f.count})</span>
        </button>);
      })}
    </div>

    <div className="project-alerts-panel__list-wrap">
      <div className="project-alerts-panel__list">
        {filtered.length > 0 ? (filtered.map((alert) => <AlertItem key={alert.id} alert={alert} />)) : (<p className="project-alerts-panel__empty">No alerts in this category</p>)}
      </div>
    </div>
  </GlassCard>);
}
