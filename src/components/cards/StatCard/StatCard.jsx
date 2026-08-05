import { Card, CardContent } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import "./StatCard.scss";

/**
 * Compact KPI Card Component
 * Enterprise-grade design for Dashboard, Project Overview, and reports
 * 
 * Props:
 * - title: Main label (e.g., "Overall Progress")
 * - value: Primary metric (e.g., "68%")
 * - icon: Icon component (optional)
 * - badge: Status badge text (optional, e.g., "On Track")
 * - badgeVariant: Badge style (default, secondary, outline)
 * - accentColor: Left border color (default, success, warning, destructive)
 * - subtitle: Small descriptive text (optional)
 */
export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  badge,
  badgeVariant = "outline",
  accentColor = "default",
  className
}) {
  const rootClassName = [
    "stat-card",
    `stat-card--accent-${accentColor}`,
    className
  ].filter(Boolean).join(" ");

  return (
    <Card className={rootClassName}>
      <CardContent className="stat-card__content">
        <div className="stat-card__body">
          {Icon && (
            <div className="stat-card__icon-wrap">
              <Icon className="stat-card__icon" />
            </div>
          )}

          <div className="stat-card__text">
            <p className="stat-card__value">{value}</p>
            <p className="stat-card__title">{title}</p>
            {subtitle && <p className="stat-card__subtitle">{subtitle}</p>}
          </div>

          {badge && (
            <Badge variant={badgeVariant} className="stat-card__badge">
              {badge}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default StatCard;
