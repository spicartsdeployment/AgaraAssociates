"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Label } from "@/components/common/Label";
import { Textarea } from "@/components/common/Textarea";
import { Select } from "@/components/common/Select";
import { MATERIAL_CATEGORIES } from "@/lib/materials/categories";
import { addMaterialRecord, updateMaterialRecord } from "@/services/materialsService";
import "@/assets/styles/components/MaterialFormDialog.scss";

export function MaterialFormDialog({ open, onOpenChange, material, onSaved }) {
    const isEdit = Boolean(material);
    const [name, setName] = useState(material?.name ?? "");
    const [sku, setSku] = useState(material?.sku ?? "");
    const [categoryId, setCategoryId] = useState(material?.categoryId ?? "interior");
    const [subcategoryId, setSubcategoryId] = useState(material?.subcategoryId ?? "");
    const [brand, setBrand] = useState(material?.brand ?? "");
    const [supplier, setSupplier] = useState(material?.supplier ?? "");
    const [unit, setUnit] = useState(material?.unit ?? "nos");
    const [currentPrice, setCurrentPrice] = useState(String(material?.currentPrice ?? ""));
    const [gst, setGst] = useState(String(material?.gst ?? "18"));
    const [specification, setSpecification] = useState(material?.specification ?? "");
    const [availability, setAvailability] = useState(material?.availability ?? "in_stock");
    const category = MATERIAL_CATEGORIES.find((c) => c.id === categoryId);
    const subcategories = category?.subcategories ?? [];
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim() || !sku.trim() || !subcategoryId) {
            toast.error("Name, SKU, and subcategory are required");
            return;
        }
        const payload = {
            name: name.trim(),
            sku: sku.trim(),
            categoryId,
            subcategoryId,
            brand: brand.trim() || "Generic",
            supplier: supplier.trim() || brand.trim() || "TBD",
            unit: unit.trim() || "nos",
            currentPrice: Number(currentPrice) || 0,
            gst: Number(gst) || 18,
            specification: specification.trim() || undefined,
            availability,
        };
        if (isEdit && material) {
            await updateMaterialRecord(material.id, payload);
            toast.success("Material updated");
        }
        else {
            await addMaterialRecord(payload);
            toast.success("Material added to library");
        }
        onSaved();
        onOpenChange(false);
    };
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="material-form-dialog__content">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Edit Material" : "Add Material"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="material-form-dialog__form">
                    <div className="material-form-dialog__grid">
                        <div className="material-form-dialog__field material-form-dialog__field--full">
                            <Label>Name</Label>
                            <Input value={name} onChange={(e) => setName(e.target.value)} className="material-form-dialog__input" required />
                        </div>
                        <div className="material-form-dialog__field">
                            <Label>SKU</Label>
                            <Input value={sku} onChange={(e) => setSku(e.target.value)} className="material-form-dialog__input" required />
                        </div>
                        <div className="material-form-dialog__field">
                            <Label>Unit</Label>
                            <Input value={unit} onChange={(e) => setUnit(e.target.value)} className="material-form-dialog__input" />
                        </div>
                        <div className="material-form-dialog__field">
                            <Label>Category</Label>
                            <Select value={categoryId} onChange={(e) => { setCategoryId(e.target.value); setSubcategoryId(""); }} className="material-form-dialog__input">
                                {MATERIAL_CATEGORIES.map((c) => (<option key={c.id} value={c.id}>{c.label}</option>))}
                            </Select>
                        </div>
                        <div className="material-form-dialog__field">
                            <Label>Subcategory</Label>
                            <Select value={subcategoryId} onChange={(e) => setSubcategoryId(e.target.value)} className="material-form-dialog__input">
                                <option value="">Select...</option>
                                {subcategories.map((s) => (<option key={s.id} value={s.id}>{s.label}</option>))}
                            </Select>
                        </div>
                        <div className="material-form-dialog__field">
                            <Label>Brand</Label>
                            <Input value={brand} onChange={(e) => setBrand(e.target.value)} className="material-form-dialog__input" />
                        </div>
                        <div className="material-form-dialog__field">
                            <Label>Supplier</Label>
                            <Input value={supplier} onChange={(e) => setSupplier(e.target.value)} className="material-form-dialog__input" />
                        </div>
                        <div className="material-form-dialog__field">
                            <Label>Price (₹)</Label>
                            <Input type="number" value={currentPrice} onChange={(e) => setCurrentPrice(e.target.value)} className="material-form-dialog__input" />
                        </div>
                        <div className="material-form-dialog__field">
                            <Label>GST %</Label>
                            <Input type="number" value={gst} onChange={(e) => setGst(e.target.value)} className="material-form-dialog__input" />
                        </div>
                        <div className="material-form-dialog__field material-form-dialog__field--full">
                            <Label>Availability</Label>
                            <Select value={availability} onChange={(e) => setAvailability(e.target.value)} className="material-form-dialog__input">
                                {["in_stock", "low_stock", "out_of_stock", "made_to_order"].map((a) => (<option key={a} value={a}>{a.replace(/_/g, " ")}</option>))}
                            </Select>
                        </div>
                        <div className="material-form-dialog__field material-form-dialog__field--full">
                            <Label>Specification</Label>
                            <Textarea value={specification} onChange={(e) => setSpecification(e.target.value)} rows={2} className="material-form-dialog__textarea" />
                        </div>
                    </div>
                    <div className="material-form-dialog__actions">
                        <Button type="button" variant="outline" className="material-form-dialog__btn" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" className="material-form-dialog__btn">{isEdit ? "Save" : "Add Material"}</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
