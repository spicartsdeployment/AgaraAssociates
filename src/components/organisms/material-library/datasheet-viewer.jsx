"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { Button } from "@/components/common/Button";
import { ExternalLink } from "lucide-react";
import "@/assets/styles/components/DatasheetViewer.scss";

export function DatasheetViewer({ open, onOpenChange, materialName, datasheetUrl, sku, brand }) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="datasheet-viewer__content">
                <DialogHeader>
                    <DialogTitle>Product Datasheet — {materialName}</DialogTitle>
                </DialogHeader>
                <div className="datasheet-viewer__body">
                    <div className="datasheet-viewer__meta">
                        <p><span className="datasheet-viewer__meta-label">SKU:</span> {sku}</p>
                        <p><span className="datasheet-viewer__meta-label">Brand:</span> {brand}</p>
                        <p className="datasheet-viewer__meta-desc">
                            Technical datasheet with specifications, installation guidelines, and warranty terms.
                            {datasheetUrl ? " Linked document available below." : " Preview generated from library metadata."}
                        </p>
                    </div>
                    <div className="datasheet-viewer__preview">
                        PDF preview — {materialName}
                    </div>
                    {datasheetUrl && (
                        <Button variant="outline" className="datasheet-viewer__link-btn" asChild>
                            <a href={datasheetUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="datasheet-viewer__link-icon" /> Open full datasheet
                            </a>
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
