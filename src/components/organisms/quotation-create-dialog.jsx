"use client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Label } from "@/components/common/Label";
import { Select } from "@/components/common/Select";
import { getProjectsForClient } from "@/lib/client-workspace";
import { getClientById } from "@/lib/store/client-store";
import { createQuotation } from "@/lib/store/quotation-store";
import "@/assets/styles/components/QuotationCreateDialog.scss";

export function QuotationCreateDialog({ open, onOpenChange, clientId }) {
    const navigate = useNavigate();
    const projects = getProjectsForClient(clientId);
    const client = getClientById(clientId);
    const [projectId, setProjectId] = useState(projects[0]?.id ?? "");
    const [title, setTitle] = useState("");
    const [validUntil, setValidUntil] = useState("2026-08-31");
    const [line1, setLine1] = useState("");
    const [amount1, setAmount1] = useState("");
    const handleSubmit = (e) => {
        e.preventDefault();
        const project = projects.find((p) => p.id === projectId);
        if (!project || !title.trim() || !line1.trim()) {
            toast.error("Project, title, and at least one line item required");
            return;
        }
        const quote = createQuotation({
            projectId,
            title: title.trim(),
            validUntil,
            items: [{ description: line1.trim(), amount: Number(amount1) || 0 }],
        }, {
            projectName: project.name,
            clientId,
            clientName: client?.company || client?.name || "Client",
        });
        toast.success("Quotation created as draft");
        onOpenChange(false);
        navigate(`/quotations/${quote.id}?client=${clientId}`);
    };
    return (<Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="quotation-create-dialog__content">
        <DialogHeader>
          <DialogTitle>New Quotation</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="quotation-create-dialog__form">
          <div className="quotation-create-dialog__field">
            <Label>Project</Label>
            <Select value={projectId} onChange={(e) => setProjectId(e.target.value)}>
              {projects.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
            </Select>
          </div>
          <div className="quotation-create-dialog__field">
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Interior Finishes Package"/>
          </div>
          <div className="quotation-create-dialog__field">
            <Label>Valid until</Label>
            <Input type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)}/>
          </div>
          <div className="quotation-create-dialog__grid">
            <div className="quotation-create-dialog__field quotation-create-dialog__field-span-2">
              <Label>Line item</Label>
              <Input value={line1} onChange={(e) => setLine1(e.target.value)} placeholder="Living room finishes"/>
            </div>
            <div className="quotation-create-dialog__field">
              <Label>Amount (₹)</Label>
              <Input type="number" value={amount1} onChange={(e) => setAmount1(e.target.value)}/>
            </div>
          </div>
          <div className="quotation-create-dialog__actions">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">Create Draft</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>);
}
