"use client";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ArrowDownLeft, ArrowUpRight, Package2, ShoppingCart, HardHat } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Label } from "@/components/common/Label";
import { Textarea } from "@/components/common/Textarea";
import { Select } from "@/components/common/Select";
import { Separator } from "@/components/ui/separator";
import { CURRENT_USER } from "@/lib/constants";
import "@/assets/styles/components/MaterialUpdateDialog.scss";

function DetailCard({ label, value, icon: Icon }) {
    return (
        <div className="material-update-dialog__detail-card">
            <div className="material-update-dialog__detail-card-head">
                {Icon ? <Icon className="material-update-dialog__detail-icon" /> : null}
                <span className="material-update-dialog__detail-label">{label}</span>
            </div>
            <span className="material-update-dialog__detail-value">{value}</span>
        </div>
    );
}

function formatHistoryDate(value) {
    if (!value) return "-";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

function formatQuantity(value, unit) {
    if (Number(value) <= 0) return "—";
    return `${value} ${unit}`;
}

function formatHistoryQuantity(entry, unit) {
    if (!entry) return "—";

    const quantity = Number(entry.transactionType === "Purchase" ? entry.quantityAdded : entry.quantityConsumed);
    if (!Number.isFinite(quantity) || quantity <= 0) return "—";

    const signedQuantity = entry.transactionType === "Purchase" ? `+${quantity}` : `-${quantity}`;
    return `${signedQuantity} ${unit}`;
}

export function MaterialUpdateDialog({ open, onOpenChange, material, onSaved }) {
    const [transactionType, setTransactionType] = useState("purchase");
    const [quantity, setQuantity] = useState("");
    const [transactionDate, setTransactionDate] = useState("");
    const [vendor, setVendor] = useState(material?.vendor ?? material?.supplier ?? "");
    const [invoiceNumber, setInvoiceNumber] = useState(material?.invoiceNumber ?? "");
    const [remarks, setRemarks] = useState("");
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!material) return;
        const today = new Date().toISOString().split("T")[0];
        setTransactionType("purchase");
        setQuantity("");
        setTransactionDate(material?.purchaseDate ? material.purchaseDate.split("T")[0] : today);
        setVendor(material?.vendor ?? material?.supplier ?? "");
        setInvoiceNumber(material?.invoiceNumber ?? "");
        setRemarks("");
        setErrors({});
    }, [material]);

    const requiredQuantity = Number(material?.requiredQuantity ?? material?.requiredQty ?? 0);
    const unit = material?.unit ?? "Nos";
    const currentPurchasedTotal = Number(material?.purchasedQuantity ?? material?.purchasedTotal ?? 0);
    const currentConsumedTotal = Number(material?.consumedQuantity ?? material?.consumedTotal ?? 0);
    const currentRemainingQuantity = Math.max(0, currentPurchasedTotal - currentConsumedTotal);

    const history = useMemo(() => {
        return Array.isArray(material?.history) ? material.history.slice().reverse() : [];
    }, [material]);

    const handleSave = (event) => {
        event.preventDefault();
        const nextErrors = {};
        const transactionQuantity = Number(quantity);

        if (!Number.isFinite(transactionQuantity) || transactionQuantity <= 0) {
            nextErrors.quantity = "Quantity must be greater than zero.";
        }
        if (!transactionDate) {
            nextErrors.transactionDate = "Transaction date is required.";
        }

        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            toast.error("Please fix validation issues before saving.");
            return;
        }

        const nextPurchasedTotal = transactionType === "purchase"
            ? currentPurchasedTotal + transactionQuantity
            : currentPurchasedTotal;
        const nextConsumedTotal = transactionType === "consumption"
            ? currentConsumedTotal + transactionQuantity
            : currentConsumedTotal;
        const nextRemainingQuantity = Math.max(0, nextPurchasedTotal - nextConsumedTotal);
        const trimmedRemarks = remarks.trim() || (transactionType === "purchase" ? "Material received at site." : "Material issued for execution.");
        const trimmedVendor = vendor.trim();

        const updatedMaterial = {
            ...material,
            purchasedQuantity: nextPurchasedTotal,
            consumedQuantity: nextConsumedTotal,
            remainingQuantity: nextRemainingQuantity,
            purchasedTotal: nextPurchasedTotal,
            consumedTotal: nextConsumedTotal,
            purchaseDate: transactionType === "purchase" ? transactionDate : material?.purchaseDate,
            vendor: trimmedVendor,
            invoiceNumber: invoiceNumber.trim(),
            remarks: trimmedRemarks,
            history: [
                ...(material?.history ?? []),
                {
                    id: `HIST-${material?.id}-${Date.now()}`,
                    date: new Date(`${transactionDate}T12:00:00`).toISOString(),
                    transactionType: transactionType === "purchase" ? "Purchase" : "Consumption",
                    quantityAdded: transactionType === "purchase" ? transactionQuantity : 0,
                    quantityConsumed: transactionType === "consumption" ? transactionQuantity : 0,
                    purchasedTotal: nextPurchasedTotal,
                    consumedTotal: nextConsumedTotal,
                    remainingQuantity: nextRemainingQuantity,
                    updatedBy: CURRENT_USER.name,
                    remarks: trimmedRemarks,
                },
            ],
        };

        onSaved(updatedMaterial);
        toast.success("Transaction recorded successfully.");
    };

    if (!material) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="material-update-dialog__content">
                <DialogHeader>
                    <DialogTitle>Material Transaction</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSave} className="material-update-dialog__form">
                    <section className="material-update-dialog__overview">
                        <div className="material-update-dialog__overview-header">
                            <div>
                                <p className="material-update-dialog__overview-title">{material.name}</p>
                                <p className="material-update-dialog__overview-subtitle">{material.sku || material.category || material.brand}</p>
                            </div>
                            <span className="material-update-dialog__overview-pill">Execution tracking</span>
                        </div>
                        <div className="material-update-dialog__detail-grid">
                            <DetailCard label="BOQ Required" value={`${requiredQuantity} ${unit}`} icon={Package2} />
                            <DetailCard label="Purchased Total" value={formatQuantity(currentPurchasedTotal, unit)} icon={ShoppingCart} />
                            <DetailCard label="Consumed Total" value={formatQuantity(currentConsumedTotal, unit)} icon={HardHat} />
                            <DetailCard label="Available Qty" value={formatQuantity(currentRemainingQuantity, unit)} icon={Package2} />
                        </div>
                    </section>

                    <div className="material-update-dialog__grid">
                        <div className="material-update-dialog__field">
                            <Label>Transaction Type *</Label>
                            <Select value={transactionType} onChange={(event) => setTransactionType(event.target.value)}>
                                <option value="purchase">Purchase</option>
                                <option value="consumption">Consumption</option>
                            </Select>
                        </div>
                        <div className="material-update-dialog__field">
                            <Label>Quantity *</Label>
                            <Input
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(event) => setQuantity(event.target.value)}
                                className={errors.quantity ? "material-update-dialog__input--error" : ""}
                            />
                            {errors.quantity && <p className="material-update-dialog__error">{errors.quantity}</p>}
                        </div>
                        <div className="material-update-dialog__field">
                            <Label>Date *</Label>
                            <Input
                                type="date"
                                value={transactionDate}
                                onChange={(event) => setTransactionDate(event.target.value)}
                                className={errors.transactionDate ? "material-update-dialog__input--error" : ""}
                            />
                            {errors.transactionDate && <p className="material-update-dialog__error">{errors.transactionDate}</p>}
                        </div>
                        <div className="material-update-dialog__field">
                            <Label>Vendor</Label>
                            <Input value={vendor} onChange={(event) => setVendor(event.target.value)} />
                        </div>
                        <div className="material-update-dialog__field">
                            <Label>Invoice Number</Label>
                            <Input value={invoiceNumber} onChange={(event) => setInvoiceNumber(event.target.value)} />
                        </div>
                        <div className="material-update-dialog__field material-update-dialog__field--full">
                            <Label>Remarks</Label>
                            <Textarea value={remarks} onChange={(event) => setRemarks(event.target.value)} rows={3} />
                        </div>
                    </div>

                    <Separator />

                    <div className="material-update-dialog__history">
                        <div className="material-update-dialog__history-heading">
                            <h3 className="material-update-dialog__section-title">Material History</h3>
                            <p className="material-update-dialog__history-caption">Transaction-based running balances for procurement and consumption.</p>
                        </div>
                        {history.length === 0 ? (
                            <p className="material-update-dialog__history-empty">No transactions recorded yet.</p>
                        ) : (
                            <div className="material-update-dialog__table-wrap">
                                <table className="material-update-dialog__history-table">
                                    <thead>
                                        <tr>
                                            <th>Date &amp; Time</th>

                                            <th className="material-update-dialog__numeric">Quantity</th>
                                            <th className="material-update-dialog__numeric">Purchased Total</th>
                                            <th className="material-update-dialog__numeric">Consumed Total</th>
                                            <th className="material-update-dialog__numeric">Remaining Quantity</th>
                                            <th>Updated By</th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {history.map((entry) => {
                                            const isPurchase = entry.transactionType === "Purchase";
                                            const quantityClassName = isPurchase
                                                ? "material-update-dialog__quantity--positive"
                                                : "material-update-dialog__quantity--negative";

                                            return (
                                                <tr key={entry.id}>
                                                    <td>{formatHistoryDate(entry.date)}</td>

                                                    <td className={`material-update-dialog__numeric material-update-dialog__quantity ${quantityClassName}`}>
                                                        {formatHistoryQuantity(entry, unit)}
                                                    </td>
                                                    <td className="material-update-dialog__numeric">{formatQuantity(entry.purchasedTotal, unit)}</td>
                                                    <td className="material-update-dialog__numeric">{formatQuantity(entry.consumedTotal, unit)}</td>
                                                    <td className="material-update-dialog__numeric">{formatQuantity(entry.remainingQuantity, unit)}</td>
                                                    <td>{entry.updatedBy}</td>

                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    <div className="material-update-dialog__actions">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit">Save Transaction</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
