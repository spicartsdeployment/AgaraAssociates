import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getQuotationById } from "@/lib/store/quotation-store";
import { QuotationDetailActions } from "@/components/organisms/quotation-detail-actions";
import { StatusChip } from "@/components/atoms/status-chip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/Card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import "@/assets/styles/pages/QuotationDetailPage.scss";

export function QuotationDetailPage() {
    const { id } = useParams();
    const quote = getQuotationById(id);
    if (!quote)
        return <Navigate to="/quotations" replace/>;
    return (<div className="quotation-detail-page">
      <Link to="/quotations" className="quotation-detail-page__back-link">
        <ArrowLeft /> Back to Quotations
      </Link>

      <div className="quotation-detail-page__layout">
        <div className="quotation-detail-page__sidebar">
          <h3 className="quotation-detail-page__sidebar-title">Version History</h3>
          {quote.versions.map((v) => (<Card key={v.version} className={v.version === quote.versions.length ? "quotation-detail-page__version-card quotation-detail-page__version-card--active" : "quotation-detail-page__version-card"}>
              <CardContent className="quotation-detail-page__version-content">
                <p className="quotation-detail-page__version-label">Version {v.version}</p>
                <p className="quotation-detail-page__version-amount">{formatCurrency(v.amount)}</p>
                <p className="quotation-detail-page__version-meta">{v.changes}</p>
                <p className="quotation-detail-page__version-meta">{v.createdAt}</p>
              </CardContent>
            </Card>))}
        </div>

        <Card className="quotation-detail-page__main-card">
          <CardHeader className="quotation-detail-page__main-header">
            <div className="quotation-detail-page__main-heading">
              <CardTitle className="quotation-detail-page__main-title">{quote.title}</CardTitle>
              <p className="quotation-detail-page__main-subtitle">{quote.clientName} · {quote.projectName}</p>
            </div>
            <div className="quotation-detail-page__main-status">
              <StatusChip status={quote.status} type="quotation"/>
            </div>
          </CardHeader>
          <CardContent className="quotation-detail-page__main-content">
            <QuotationDetailActions quoteId={quote.id} status={quote.status}/>
            <Separator />
            <div className="quotation-detail-page__line-items">
              {quote.items.map((item, i) => (<div key={i} className="quotation-detail-page__line-item">
                  <span>{item.description}</span>
                  <span className="quotation-detail-page__line-amount">{formatCurrency(item.amount)}</span>
                </div>))}
            </div>
            <div className="quotation-detail-page__total-row">
              <span>Total</span>
              <span>{formatCurrency(quote.amount)}</span>
            </div>
            <Card className="quotation-detail-page__signature-card">
              <CardContent className="quotation-detail-page__signature-content">
                Client approval workflow — electronic signature placeholder
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>);
}
