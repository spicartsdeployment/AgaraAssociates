"use client";
import { useState } from "react";
import { Button } from "@/components/common/Button";
import { Plus } from "lucide-react";
import { QuotationCreateDialog } from "@/components/organisms/quotation-create-dialog";
import "@/assets/styles/components/QuotationsHeaderActions.scss";

export function QuotationsHeaderActions({ clientId }) {
    const [open, setOpen] = useState(false);
    return (<>
      <Button onClick={() => setOpen(true)}>
        <Plus className="quotations-header-actions__icon"/> New Quotation
      </Button>
      <QuotationCreateDialog open={open} onOpenChange={setOpen} clientId={clientId}/>
    </>);
}
