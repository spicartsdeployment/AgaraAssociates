import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { getAllApprovals, updateApprovalStatus } from "@/lib/store/approval-store";
import { PageHeader } from "@/components/templates/page-header";
import { Card, CardContent } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { Check, X } from "lucide-react";
import "@/assets/styles/pages/ApprovalsPage.scss";

export function ApprovalsPage() {
    const [version, setVersion] = useState(0);
    void version;
    const approvals = getAllApprovals();
    const handleAction = (id, status) => {
        updateApprovalStatus(id, status);
        setVersion((value) => value + 1);
        toast.success(status === "approved" ? "Approved" : "Rejected");
    };
    const pending = approvals.filter((approval) => approval.status === "pending");
    const completed = approvals.filter((approval) => approval.status !== "pending");
    return (<div className="approvals-page">
      <PageHeader title="Approvals" description="Drawings, quotations, payments, and sign-offs awaiting action"/>

      <section className="approvals-page__section">
        <h2 className="approvals-page__section-title">
          Pending ({pending.length})
        </h2>
        {pending.map((approval) => (<ApprovalCard key={approval.id} approval={approval} onAction={handleAction}/>))}
        {pending.length === 0 && <p className="approvals-page__empty">All caught up.</p>}
      </section>

      {completed.length > 0 && (<section className="approvals-page__section">
          <h2 className="approvals-page__section-title">Completed</h2>
          {completed.map((approval) => (<ApprovalCard key={approval.id} approval={approval}/>))}
        </section>)}
    </div>);
}
function ApprovalCard({ approval, onAction, }) {
    return (<Card className="approval-card">
      <CardContent className="approval-card__content">
        <div className="approval-card__main">
          <div className="approval-card__title-row">
            <p className="approval-card__title">{approval.title}</p>
            <Badge variant="outline" className="approval-card__type-badge">
              {approval.type}
            </Badge>
            <Badge variant={approval.priority === "high" ? "destructive" : approval.priority === "medium" ? "warning" : "outline"}>
              {approval.priority}
            </Badge>
          </div>
          <p className="approval-card__description">{approval.description}</p>
          <p className="approval-card__meta">
            {approval.projectName} · Due {approval.dueDate}
          </p>
        </div>
        <div className="approval-card__actions">
          {approval.status === "pending" && onAction ? (<>
              <Button size="sm" className="approval-card__action-btn" onClick={() => onAction(approval.id, "approved")}>
                <Check className="approval-card__action-icon"/> Approve
              </Button>
              <Button size="sm" variant="outline" className="approval-card__action-btn" onClick={() => onAction(approval.id, "rejected")}>
                <X className="approval-card__action-icon"/> Reject
              </Button>
            </>) : (<Badge variant={approval.status === "approved" ? "success" : "destructive"}>{approval.status}</Badge>)}
          {approval.href && (<Button size="sm" variant="ghost" className="approval-card__view-btn" asChild>
              <Link to={approval.href}>View</Link>
            </Button>)}
        </div>
      </CardContent>
    </Card>);
}
