import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Calculator, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Badge } from "@/components/common/Badge";
import { formatCurrency } from "@/lib/utils";
import { calculateBoqEstimate } from "@/lib/boq/estimate-calculator";
import { useMaterialCatalog } from "@/lib/hooks/use-material-catalog";
import { updateBoqItems } from "@/lib/store/project-store";
import { generateQuotationFromBoq } from "@/lib/boq/generate-quotation-from-boq";
import { getBoqById } from "@/services/boqService";
import "@/assets/styles/pages/BoqDetailPage.scss";

export function BoqDetailPage() {
    const { id = "" } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const clientId = searchParams.get("client") ?? "";
    const [boq, setBoq] = useState(undefined);
    const { catalog } = useMaterialCatalog();
    useEffect(() => {
        setBoq(getBoqById(id) ?? null);
    }, [id]);
    if (boq === undefined) {
        return <div className="boq-detail-page__loading">Loading...</div>;
    }
    if (!boq) {
        return <Navigate to="/boq" replace/>;
    }
    const lineEstimates = boq.items.map((item) => ({
        item,
        ...calculateBoqEstimate([item]).lineEstimates[0],
    }));
    const summary = calculateBoqEstimate(boq.items);
    const handleRecalculate = () => {
        if (!catalog)
            return;
        const refreshed = boq.items.map((item) => catalog.refreshLineItemRates(item));
        updateBoqItems(boq.id, refreshed);
        setBoq({ ...boq, items: refreshed });
        const variances = refreshed.filter((line, index) => line.rate !== boq.items[index]?.rate).length;
        toast.success("Estimate recalculated from Material Library", {
            description: `${refreshed.length} lines updated · ${variances} rate changes applied`,
        });
    };
    const handleCreateQuotation = () => {
        const quote = generateQuotationFromBoq(boq, "by_trade");
        toast.success("Quotation created from BOQ");
        navigate(`/quotations/${quote.id}${clientId ? `?client=${clientId}` : ""}`);
    };
    return (<div className="boq-detail-page">
      <Link to={clientId ? `/boq?client=${clientId}` : "/boq"} className="boq-detail-page__back-link">
        <ArrowLeft /> Back to BOQ
      </Link>

      <div className="boq-detail-page__layout">
        <div className="boq-detail-page__main">
          <div className="boq-detail-page__header">
            <div>
              <h1 className="boq-detail-page__title">{boq.title}</h1>
              <p className="boq-detail-page__subtitle">{boq.projectName}</p>
              {boq.projectType && (<Badge variant="outline" className="boq-detail-page__type-badge">
                  {boq.projectType}
                </Badge>)}
            </div>
            <div className="boq-detail-page__actions">
              <Button variant="outline" className="boq-detail-page__action-btn" onClick={handleRecalculate}>
                <Calculator className="boq-detail-page__action-icon"/> Recalculate from Library
              </Button>
              <Button className="boq-detail-page__action-btn" onClick={handleCreateQuotation}>
                <FileText className="boq-detail-page__action-icon"/> Create Quotation
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="boq-detail-page__table-content">
              <table className="boq-detail-page__table">
                <thead>
                  <tr>
                    <th>Room</th>
                    <th>Material / Item</th>
                    <th>Qty</th>
                    <th>Rate</th>
                    <th>GST</th>
                    <th>Labour</th>
                    <th>Margin</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {lineEstimates.map(({ item, total, gstAmount, labourAmount, marginAmount }) => (<tr key={item.id}>
                      <td>{item.room}</td>
                      <td>
                        <p className="boq-detail-page__item-name">{item.item}</p>
                        {item.sku && <p className="boq-detail-page__item-sku">{item.sku}</p>}
                      </td>
                      <td>
                        {item.quantity} {item.unit}
                      </td>
                      <td>₹{item.rate}</td>
                      <td>{formatCurrency(gstAmount)}</td>
                      <td>{formatCurrency(labourAmount)}</td>
                      <td>{formatCurrency(marginAmount)}</td>
                      <td className="boq-detail-page__total-cell">{formatCurrency(total)}</td>
                    </tr>))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        <Card className="boq-detail-page__summary-card">
          <CardHeader>
            <CardTitle>Estimate Summary</CardTitle>
          </CardHeader>
          <CardContent className="boq-detail-page__summary-content">
            <div className="boq-detail-page__summary-row">
              <span>Subtotal</span>
              <span>{formatCurrency(summary.subtotal)}</span>
            </div>
            <div className="boq-detail-page__summary-row">
              <span>GST</span>
              <span>{formatCurrency(summary.gst)}</span>
            </div>
            <div className="boq-detail-page__summary-row">
              <span>Labour</span>
              <span>{formatCurrency(summary.labour)}</span>
            </div>
            <div className="boq-detail-page__summary-row">
              <span>Margin</span>
              <span>{formatCurrency(summary.margin)}</span>
            </div>
            <div className="boq-detail-page__summary-total">
              <span>Grand Total</span>
              <span>{formatCurrency(summary.grandTotal)}</span>
            </div>
            {boq.takeoffSnapshot && (<p className="boq-detail-page__summary-note">
                Built from quantity takeoff · {boq.items.length} priced lines
              </p>)}
          </CardContent>
        </Card>
      </div>
    </div>);
}
