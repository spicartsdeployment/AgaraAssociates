import { Link } from "react-router-dom";
import { Button } from "@/components/common/Button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GlassCard } from "@/components/ui/glass-card";
import { QuickActionsStrip } from "@/components/organisms/quick-actions-panel";
import { ArrowRight, CheckCircle2, Circle } from "lucide-react";
import { cx } from "@/lib/utils";
import "@/assets/styles/components/ImmediateActionsPanel.scss";

export function ImmediateActionsPanel({ actions, className }) {
    const completedCount = 0;
    return (<GlassCard className={cx("immediate-actions-panel", className)}>
      <div className="immediate-actions-panel__header">
        <div className="immediate-actions-panel__header-text">
          <h2 className="immediate-actions-panel__title">Approval Queue</h2>
          <p className="immediate-actions-panel__subtitle">Pending reviews and action items</p>
        </div>
        <span className="immediate-actions-panel__count">
          {completedCount}/{actions.length}
        </span>
      </div>

      <ScrollArea className="immediate-actions-panel__scroll">
        <div className="immediate-actions-panel__list">
          {actions.map((action, index) => (<div key={action.id} className="immediate-actions-panel__item">
              {index === 0 ? (<CheckCircle2 className="immediate-actions-panel__item-icon immediate-actions-panel__item-icon--active" strokeWidth={1.5}/>) : (<Circle className="immediate-actions-panel__item-icon immediate-actions-panel__item-icon--pending" strokeWidth={1.5}/>)}
              <div className="immediate-actions-panel__item-body">
                <p className="immediate-actions-panel__item-title">{action.title}</p>
                <p className="immediate-actions-panel__item-project">{action.projectName}</p>
              </div>
              <Button size="sm" variant="ghost" className="immediate-actions-panel__item-action" asChild>
                <Link to={action.href} className="immediate-actions-panel__item-action-link">
                  <span className="immediate-actions-panel__item-action-label">{action.actionLabel}</span>
                  <ArrowRight className="immediate-actions-panel__item-action-icon" strokeWidth={1.5}/>
                </Link>
              </Button>
            </div>))}
        </div>
      </ScrollArea>

      <div className="immediate-actions-panel__footer">
        <p className="immediate-actions-panel__footer-title">Quick Actions</p>
        <QuickActionsStrip compact/>
      </div>
    </GlassCard>);
}
