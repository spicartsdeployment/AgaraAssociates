"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { Button } from "@/components/common/Button";
import { Textarea } from "@/components/common/Textarea";
import { Label } from "@/components/common/Label";
import { importMaterialRecords } from "@/services/materialsService";
import "@/assets/styles/components/MaterialImportDialog.scss";

const SAMPLE = `name,sku,categoryId,subcategoryId,brand,supplier,unit,currentPrice,gst
Sample Tile,AF-TIL-001,interior,flooring_tiles,Kajaria,Kajaria Ceramics,sqft,95,18`;

export function MaterialImportDialog({ open, onOpenChange, onImported }) {
    const [csv, setCsv] = useState("");
    const handleImport = async () => {
        const lines = csv.trim().split("\n").filter(Boolean);
        if (lines.length < 2) {
            toast.error("Paste CSV with header row and at least one material");
            return;
        }
        const headers = lines[0].split(",").map((h) => h.trim());
        const rows = [];
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(",").map((v) => v.trim());
            const row = {};
            headers.forEach((h, idx) => { row[h] = values[idx] ?? ""; });
            if (!row.name || !row.sku)
                continue;
            rows.push({
                name: row.name,
                sku: row.sku,
                categoryId: row.categoryId || "interior",
                subcategoryId: row.subcategoryId || "general",
                brand: row.brand || "Generic",
                supplier: row.supplier || row.brand || "TBD",
                unit: row.unit || "nos",
                currentPrice: Number(row.currentPrice) || 0,
                gst: Number(row.gst) || 18,
                availability: "in_stock",
            });
        }
        if (rows.length === 0) {
            toast.error("No valid rows found");
            return;
        }
        await importMaterialRecords(rows);
        toast.success(`Imported ${rows.length} materials`);
        onImported();
        onOpenChange(false);
        setCsv("");
    };
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="material-import-dialog__content">
                <DialogHeader>
                    <DialogTitle>Import Materials (CSV)</DialogTitle>
                </DialogHeader>
                <div className="material-import-dialog__body">
                    <p className="material-import-dialog__hint">
                        Columns: name, sku, categoryId, subcategoryId, brand, supplier, unit, currentPrice, gst
                    </p>
                    <Label>Paste CSV</Label>
                    <Textarea value={csv} onChange={(e) => setCsv(e.target.value)} rows={8} className="material-import-dialog__textarea" placeholder={SAMPLE} />
                    <div className="material-import-dialog__actions">
                        <Button variant="outline" className="material-import-dialog__btn" onClick={() => { setCsv(SAMPLE); }}>Load Sample</Button>
                        <Button className="material-import-dialog__btn" onClick={handleImport}>Import</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
