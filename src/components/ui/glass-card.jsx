import { cx } from "@/lib/utils";
import "@/assets/styles/components/GlassCard.scss";

export function GlassCard({ className, variant = "light", children, ...props }) {
    return (<div className={cx("glass-card", `glass-card--${variant}`, className)} {...props}>
      {children}
    </div>);
}
