"use client";
import { Link } from "react-router-dom";
import { getQuotationsForClient } from "@/lib/client-workspace";
import { StatusChip } from "@/components/atoms/status-chip";
import { Card, CardContent } from "@/components/common/Card";
import { formatCurrency } from "@/lib/utils";
import "@/assets/styles/components/QuotationsClientView.scss";

export function QuotationsClientView({ clientId }) {
    const quotations = getQuotationsForClient(clientId);
    if (quotations.length === 0) {
        return (<Card className="quotations-client-view__empty-card">
        <CardContent className="quotations-client-view__empty-content">
          <p className="quotations-client-view__empty-title">No quotations for this client</p>
          <p className="quotations-client-view__empty-subtitle">Create a new quotation to send pricing for their projects.</p>
        </CardContent>
      </Card>);
    }
    return (<div className="quotations-client-view">
      {quotations.map((q) => (<Link key={q.id} to={`/quotations/${q.id}?client=${clientId}`}>
          <Card>
            <CardContent className="quotations-client-view__card-content">
              <div className="quotations-client-view__info">
                <h3 className="quotations-client-view__title">{q.title}</h3>
                <p className="quotations-client-view__project">{q.projectName}</p>
                <p className="quotations-client-view__meta">
                  Valid until {q.validUntil} · {q.versions.length} versions
                </p>
              </div>
              <div className="quotations-client-view__aside">
                <span className="quotations-client-view__amount">{formatCurrency(q.amount)}</span>
                <StatusChip status={q.status} type="quotation"/>
              </div>
            </CardContent>
          </Card>
        </Link>))}
    </div>);
}
