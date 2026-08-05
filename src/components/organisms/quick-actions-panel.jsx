import { Link } from "react-router-dom";
import { Plus, FileText, Users, Calendar, ClipboardList, HardHat, Package, Palette, } from "lucide-react";
import { cx } from "@/lib/utils";
import "@/assets/styles/components/QuickActionsPanel.scss";

export const quickActions = [
    { label: "Project", icon: Plus, href: "/app/projects/new", colorVariant: "primary" },
    { label: "Client", icon: Users, href: "/clients", colorVariant: "surface" },
    { label: "Design", icon: Palette, href: "/design-studio", colorVariant: "accent" },
    { label: "Quote", icon: FileText, href: "/quotations", colorVariant: "surface" },
    { label: "BOQ", icon: ClipboardList, href: "/boq", colorVariant: "surface" },
    { label: "Site", icon: HardHat, href: "/site-progress", colorVariant: "surface" },
    { label: "Materials", icon: Package, href: "/materials", colorVariant: "accent" },
    { label: "Calendar", icon: Calendar, href: "/calendar", colorVariant: "primary" },
];

export function QuickActionsStrip({ compact = false, className }) {
    if (compact) {
        return (<div className={cx("quick-actions-panel__compact", className)}>
        {quickActions.map((action) => (<Link key={action.label} to={action.href} title={action.label} className="quick-actions-panel__compact-item">
            <div className={cx("quick-actions-panel__compact-icon-wrap", `quick-actions-panel__compact-icon-wrap--${action.colorVariant}`)}>
              <action.icon className="quick-actions-panel__compact-icon" strokeWidth={1.5}/>
            </div>
            <span className="quick-actions-panel__compact-label">{action.label}</span>
          </Link>))}
      </div>);
    }
    return (<div className={cx("quick-actions-panel__strip", className)}>
      {quickActions.map((action) => (<Link key={action.label} to={action.href} title={action.label} className="quick-actions-panel__strip-item">
          <div className={cx("quick-actions-panel__strip-icon-wrap", `quick-actions-panel__strip-icon-wrap--${action.colorVariant}`)}>
            <action.icon className="quick-actions-panel__strip-icon" strokeWidth={1.5}/>
          </div>
          <span className="quick-actions-panel__strip-label">{action.label}</span>
        </Link>))}
    </div>);
}

export function QuickActionsCard({ className }) {
    return (<div className={cx("quick-actions-panel__card", className)}>
      <p className="quick-actions-panel__card-title">Quick Actions</p>
      <QuickActionsStrip compact/>
    </div>);
}

export function QuickActionsPanel() {
    return (<div className="quick-actions-panel__panel">
      <div className="quick-actions-panel__panel-inner">
        <span className="quick-actions-panel__panel-title">Quick Actions</span>
        <div className="quick-actions-panel__panel-divider"/>
        <QuickActionsStrip />
      </div>
    </div>);
}
