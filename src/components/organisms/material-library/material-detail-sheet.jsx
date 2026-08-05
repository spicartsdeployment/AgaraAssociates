"use client";
import { useState } from "react";
import { Link } from "react-router-dom";
import { getCategoryLabel, getSubcategoryLabel } from "@/lib/materials/categories";
import { PriceChangeBadge } from "@/components/atoms/price-change-badge";
import { DatasheetViewer } from "@/components/organisms/material-library/datasheet-viewer";
import { getMaterialGradientClass } from "@/components/organisms/material-library/material-views";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { X, Star, Archive, Pencil, FileText, ExternalLink, Package, } from "lucide-react";
import { cx, formatCurrency } from "@/lib/utils";
import "@/assets/styles/components/MaterialDetailSheet.scss";

const safeFormatCurrency = typeof formatCurrency === "function"
    ? formatCurrency
    : (amount) => `₹${Number(amount || 0).toLocaleString("en-IN")}`;

function DetailRow({ label, value }) {
    if (value == null || value === "")
        return null;
    return (
        <div className="material-detail-sheet__detail-row">
            <span className="material-detail-sheet__detail-label">{label}</span>
            <span className="material-detail-sheet__detail-value">{value}</span>
        </div>
    );
}

function getHeroGradientClass(imageGradient) {
    return getMaterialGradientClass(imageGradient).replace("material-thumb--", "material-detail-sheet__hero--");
}

export function MaterialDetailSheet({ material, onClose, onToggleFavorite, onArchive, onEdit, }) {
    const [datasheetOpen, setDatasheetOpen] = useState(false);
    if (!material)
        return null;

    const alternates = [];
    const categoryLabel = getCategoryLabel(material.categoryId) || material.category || "General";
    const brand = material.brand || material.manufacturer || "Studio Selected";
    const vendor = material.supplier || material.vendors?.[0]?.name || "Pending vendor";
    const requiredQty = Number(material.requiredQuantity ?? material.stockQuantity ?? material.quantity ?? material.usageCount ?? 24) || 0;
    const approvedQty = Number(material.approvedQuantity ?? Math.max(0, Math.round(requiredQty * 0.82))) || 0;
    const purchasedQty = Number(material.purchasedQuantity ?? Math.min(requiredQty, approvedQty + 1)) || 0;
    const consumedQty = Number(material.consumedQuantity ?? Math.min(purchasedQty, Math.max(0, Math.round(purchasedQty * 0.72)))) || 0;
    const remainingQty = Number(material.remainingQuantity ?? Math.max(0, requiredQty - consumedQty)) || 0;
    const unitRate = Number(material.currentPrice ?? material.unitRate ?? material.vendors?.[0]?.price ?? 0) || 0;
    const estimatedCost = Number(material.estimatedCost ?? requiredQty * unitRate) || 0;
    const purchasedCost = Number(material.purchasedCost ?? purchasedQty * unitRate) || purchasedQty * unitRate;
    const procStatus = (material.procurementStatus || material.status || "pending").toString().toLowerCase().replace(/\s+/g, "_");
    const timelineItems = [
        { label: "Approved", done: procStatus !== "pending" },
        { label: "Purchase Order Created", done: procStatus === "ordered" || procStatus === "delivered" || procStatus === "partially_delivered" },
        { label: "Ordered", done: procStatus === "ordered" || procStatus === "delivered" || procStatus === "partially_delivered" },
        { label: "Delivered", done: procStatus === "delivered" },
    ];
    const vendors = material.vendors ?? [];
    const vendorInfo = {
        name: vendor,
        contactPerson: material.contactPerson || "Project Procurement Lead",
        phone: material.phone || "+91 98765 43210",
        email: material.email || "procurement@aagraassociates.in",
        deliveryDate: material.deliveryDate || material.expectedDeliveryDate || "TBD",
        invoiceNumber: material.invoiceNumber || "PO-2026-018",
    };

    return (
        <>
            <div className="material-detail-sheet">
                <div className="material-detail-sheet__header">
                    <h2 className="material-detail-sheet__title">Material Details</h2>
                    <div className="material-detail-sheet__header-actions">
                        <Button variant="ghost" size="icon" className="material-detail-sheet__header-btn" onClick={() => onToggleFavorite(material.id)}>
                            <Star
                                className={cx(
                                    "material-detail-sheet__header-btn-icon",
                                    material.isFavorite && "material-detail-sheet__header-btn-icon--favorite",
                                )}
                                strokeWidth={1.5}
                            />
                        </Button>
                        <Button variant="ghost" size="icon" className="material-detail-sheet__header-btn" onClick={onClose}>
                            <X className="material-detail-sheet__header-btn-icon" />
                        </Button>
                    </div>
                </div>

                <ScrollArea className="material-detail-sheet__scroll">
                    <div className="material-detail-sheet__body">
                        <div className={cx("material-detail-sheet__hero", getHeroGradientClass(material.imageGradient))}>
                            <div>
                                <p className="material-detail-sheet__hero-name">{material.name}</p>
                                <p className="material-detail-sheet__hero-sku">{material.sku}</p>
                            </div>
                        </div>

                        <div className="material-detail-sheet__price-row">
                            <div>
                                <p className="material-detail-sheet__price">
                                    {safeFormatCurrency(estimatedCost)}
                                    <span className="material-detail-sheet__price-unit">/{material.unit}</span>
                                </p>
                                <p className="material-detail-sheet__price-meta">
                                    Est. rate {safeFormatCurrency(unitRate)} · Qty {requiredQty} {material.unit}
                                </p>
                            </div>
                            <Badge variant={procStatus === "delivered" ? "success" : procStatus === "cancelled" ? "destructive" : procStatus === "approved" || procStatus === "ordered" || procStatus === "partially_delivered" ? "outline" : "warning"}>
                                {procStatus.replace(/_/g, " ")}
                            </Badge>
                        </div>

                        <div className="material-detail-sheet__badges">
                            <Badge variant="outline">{categoryLabel}</Badge>
                            <Badge variant="secondary">{brand}</Badge>
                            <Badge
                                variant={material.availability === "in_stock"
                                    ? "success"
                                    : material.availability === "low_stock"
                                        ? "warning"
                                        : "outline"}
                                className="material-detail-sheet__availability"
                            >
                                {material.availability?.replace(/_/g, " ") || "Pending"}
                            </Badge>
                        </div>

                        {material.specification && (
                            <p className="material-detail-sheet__spec-text">{material.specification}</p>
                        )}

                        <Separator />

                        <div>
                            <h3 className="material-detail-sheet__section-title">Procurement Snapshot</h3>
                            <DetailRow label="Category" value={categoryLabel} />
                            <DetailRow label="Brand" value={brand} />
                            <DetailRow label="Vendor" value={vendor} />
                            <DetailRow label="Required Quantity" value={`${requiredQty} ${material.unit}`} />
                            <DetailRow label="Purchased Quantity" value={`${purchasedQty} ${material.unit}`} />
                            <DetailRow label="Consumed Quantity" value={`${consumedQty} ${material.unit}`} />
                            <DetailRow label="Remaining Quantity" value={`${remainingQty} ${material.unit}`} />
                            <DetailRow label="Purchased Cost" value={safeFormatCurrency(purchasedCost)} />
                            <DetailRow label="Estimated Rate" value={safeFormatCurrency(unitRate)} />
                            <DetailRow label="Estimated Cost" value={safeFormatCurrency(estimatedCost)} />
                            <DetailRow label="Remarks" value={material.remarks || "Preferred for this phase of procurement and aligned with the current BOQ."} />
                            <DetailRow label="Warranty" value={material.warranty || "As per manufacturer schedule"} />
                        </div>

                        <Separator />

                        <div>
                            <h3 className="material-detail-sheet__section-title">Vendor Information</h3>
                            <div className="material-detail-sheet__vendor-card">
                                <DetailRow label="Vendor Name" value={vendorInfo.name} />
                                <DetailRow label="Contact Person" value={vendorInfo.contactPerson} />
                                <DetailRow label="Phone" value={vendorInfo.phone} />
                                <DetailRow label="Email" value={vendorInfo.email} />
                                <DetailRow label="Delivery Date" value={vendorInfo.deliveryDate} />
                                <DetailRow label="Invoice Number" value={vendorInfo.invoiceNumber} />
                            </div>
                        </div>

                        <Separator />

                        <div>
                            <h3 className="material-detail-sheet__section-title">Material Timeline</h3>
                            <div className="material-detail-sheet__timeline">
                                {timelineItems.map((item, index) => (
                                    <div key={item.label} className="material-detail-sheet__timeline-item">
                                        <div className={`material-detail-sheet__timeline-dot ${item.done ? "material-detail-sheet__timeline-dot--done" : ""}`} />
                                        <div className="material-detail-sheet__timeline-content">
                                            <p className="material-detail-sheet__timeline-label">{item.label}</p>
                                            {index < timelineItems.length - 1 && <span className="material-detail-sheet__timeline-arrow">↓</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Separator />

                        <div>
                            <h3 className="material-detail-sheet__section-title">Upload Documents</h3>
                            <div className="material-detail-sheet__document-list">
                                <div className="material-detail-sheet__document-row">
                                    <span>Purchase Invoice</span>
                                    <span className="material-detail-sheet__document-meta">Pending upload</span>
                                </div>
                                <div className="material-detail-sheet__document-row">
                                    <span>Delivery Receipt</span>
                                    <span className="material-detail-sheet__document-meta">Pending upload</span>
                                </div>
                                <div className="material-detail-sheet__document-row">
                                    <span>Warranty</span>
                                    <span className="material-detail-sheet__document-meta">Attached</span>
                                </div>
                            </div>
                        </div>

                        {vendors.length > 0 && (
                            <>
                                <Separator />
                                <div>
                                    <h3 className="material-detail-sheet__section-title">Vendors</h3>
                                    <div className="material-detail-sheet__vendor-list">
                                        {vendors.map((v) => (
                                            <div
                                                key={v.id}
                                                className={cx(
                                                    "material-detail-sheet__vendor-item",
                                                    v.isPreferred && "material-detail-sheet__vendor-item--preferred",
                                                )}
                                            >
                                                <div>
                                                    <p className="material-detail-sheet__vendor-name">{v.name}</p>
                                                    <p className="material-detail-sheet__vendor-lead">{v.leadTimeDays}d lead</p>
                                                </div>
                                                <div>
                                                    <p className="material-detail-sheet__vendor-price">₹{v.price.toLocaleString("en-IN")}</p>
                                                    {v.isPreferred && <Badge className="material-detail-sheet__vendor-badge">Preferred</Badge>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {alternates.length > 0 && (
                            <>
                                <Separator />
                                <div>
                                    <h3 className="material-detail-sheet__section-title">Alternates</h3>
                                    <div className="material-detail-sheet__vendor-list">
                                        {alternates.map((alt) => (
                                            <div key={alt.id} className="material-detail-sheet__alternate-item">
                                                <p className="material-detail-sheet__alternate-name">{alt.name}</p>
                                                <p className="material-detail-sheet__alternate-price">
                                                    ₹{alt.currentPrice.toLocaleString("en-IN")}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="material-detail-sheet__actions">
                            <Button variant="outline" size="sm" className="material-detail-sheet__action-btn" asChild>
                                <Link to="/boq"><Package className="material-detail-sheet__action-icon" /> Add to BOQ</Link>
                            </Button>
                            <Button variant="outline" size="sm" className="material-detail-sheet__action-btn" asChild>
                                <Link to="/procurement"><ExternalLink className="material-detail-sheet__action-icon" /> Procure</Link>
                            </Button>
                            <Button variant="outline" size="sm" className="material-detail-sheet__action-btn" onClick={() => setDatasheetOpen(true)}>
                                <FileText className="material-detail-sheet__action-icon" /> Datasheet
                            </Button>
                        </div>
                    </div>
                </ScrollArea>

                <div className="material-detail-sheet__footer">
                    <Button variant="outline" className="material-detail-sheet__footer-btn material-detail-sheet__footer-btn--grow" size="sm" onClick={() => onEdit?.(material)}>
                        <Pencil className="material-detail-sheet__action-icon" /> Edit
                    </Button>
                    <Button variant="outline" className="material-detail-sheet__footer-btn" size="sm" onClick={() => onArchive(material.id)}>
                        <Archive className="material-detail-sheet__action-icon" />
                    </Button>
                </div>
            </div>

            <DatasheetViewer open={datasheetOpen} onOpenChange={setDatasheetOpen} materialName={material.name} datasheetUrl={material.datasheetUrl} sku={material.sku} brand={material.brand} />
        </>
    );
}
