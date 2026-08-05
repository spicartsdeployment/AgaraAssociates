import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { formatPercent } from "@/lib/utils";
import "@/assets/styles/components/PriceChangeBadge.scss";

export function PriceChangeBadge({ current, previous, className }) {
  const change = ((current - previous) / previous) * 100;
  const isUp = change > 0;
  const isDown = change < 0;
  const modifier = isUp ? "up" : isDown ? "down" : "neutral";
  const rootClassName = [
    "price-change-badge",
    `price-change-badge--${modifier}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={rootClassName}>
      {isUp && <TrendingUp className="price-change-badge__icon" />}
      {isDown && <TrendingDown className="price-change-badge__icon" />}
      {!isUp && !isDown && <Minus className="price-change-badge__icon" />}
      {formatPercent(change)}
    </span>
  );
}
