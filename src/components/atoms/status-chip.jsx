import { Badge } from "@/components/common/Badge";
import {
  PROJECT_STATUS_LABELS,
  QUOTATION_STATUS_LABELS,
} from "@/lib/constants";
import "@/assets/styles/components/StatusChip.scss";

const statusVariants = {
  concept: "outline",
  design_dev: "default",
  execution: "secondary",
  handover: "warning",
  completed: "success",
  draft: "outline",
  sent: "default",
  approved: "success",
  rejected: "destructive",
};

export function StatusChip({ status, type = "project", className }) {
  const labels =
    type === "quotation" ? QUOTATION_STATUS_LABELS : PROJECT_STATUS_LABELS;
  const rootClassName = ["status-chip", className].filter(Boolean).join(" ");

  return (
    <Badge variant={statusVariants[status] || "outline"} className={rootClassName}>
      {labels[status] || status}
    </Badge>
  );
}
