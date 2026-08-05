"use client";
import { toast } from "sonner";
import { Button } from "@/components/common/Button";
import { Download, PenLine } from "lucide-react";
import { updateQuotationStatus } from "@/lib/store/quotation-store";
import "@/assets/styles/components/QuotationDetailActions.scss";

export function QuotationDetailActions({ quoteId, status }) {
    return (<div className="quotation-detail-actions">
      <Button variant="outline" onClick={() => toast.success("PDF generated", { description: "Quotation PDF downloaded to your device" })}>
        <Download className="quotation-detail-actions__icon"/> Generate PDF
      </Button>
      <Button variant="outline" onClick={() => toast.info("E-signature link sent", { description: "Client will receive a secure signing link via email" })}>
        <PenLine className="quotation-detail-actions__icon"/> E-Signature
      </Button>
      <Button onClick={() => {
            updateQuotationStatus(quoteId, "sent");
            toast.success("Sent for approval", { description: "Quotation status updated to Sent" });
        }} disabled={status === "sent" || status === "approved"}>
        Send for Approval
      </Button>
    </div>);
}
