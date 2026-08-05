"use client";

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Badge } from "@/components/common/Badge";
import { formatCurrency } from "@/lib/utils";
import { getCategoryLabel } from "@/lib/materials/categories";
import { getProjectPurchaseOrders, getProjectInvoices, getProjectApprovals, getProjectDocuments, getProjectActivities, getProjectSitePhotos, } from "@/lib/project-modules";
import { MaterialUpdateDialog } from "@/components/organisms/material-library/material-update-dialog";
import { Plus, Package2, ShoppingCart, HardHat } from "lucide-react";
import "@/assets/styles/components/ProjectTabPanels.scss";

function normalizeMaterialStatus(value, fallbackIndex, availability) {
  const normalized = (value || "").toString().toLowerCase().replace(/\s+/g, "_");
  if (normalized === "approved" || normalized === "ordered" || normalized === "delivered" || normalized === "pending" || normalized === "partially_delivered" || normalized === "cancelled") {
    return normalized;
  }

  if (availability === "in_stock") {
    return fallbackIndex % 2 === 0 ? "approved" : "ordered";
  }
  if (availability === "low_stock") {
    return fallbackIndex % 2 === 0 ? "pending" : "partially_delivered";
  }
  return fallbackIndex % 3 === 0 ? "pending" : fallbackIndex % 3 === 1 ? "ordered" : "delivered";
}

function getMaterialPresentation(material, index) {
  const category = getCategoryLabel(material.categoryId) || material.category || "General";
  const brand = material.brand || material.manufacturer || "Studio Selected";
  const vendor = material.supplier || material.vendors?.[0]?.name || "Pending vendor";
  const requiredQty = Number(material.requiredQuantity ?? material.stockQuantity ?? material.quantity ?? material.usageCount ?? (20 + index * 4)) || 0;
  const approvedQty = Number(material.approvedQuantity ?? Math.max(0, Math.round(requiredQty * 0.82))) || 0;
  const purchasedQty = Number(material.purchasedQuantity ?? Math.min(requiredQty, approvedQty + (index % 2) + 1)) || 0;
  const consumedQty = Number(material.consumedQuantity ?? Math.min(purchasedQty, Math.max(0, Math.round(purchasedQty * 0.72)))) || 0;
  const remainingQty = Number(material.remainingQuantity ?? Math.max(0, requiredQty - consumedQty)) || 0;
  const unitRate = Number(material.currentPrice ?? material.unitRate ?? material.vendors?.[0]?.price ?? 0) || 0;
  const estimatedCost = Number(material.estimatedCost ?? requiredQty * unitRate) || 0;
  const purchasedCost = Number(material.purchasedCost ?? purchasedQty * unitRate) || purchasedQty * unitRate;
  const procurementStatus = normalizeMaterialStatus(material.procurementStatus || material.status, index, material.availability);
  const deliveryDate = material.deliveryDate || material.expectedDeliveryDate || `${Math.max(3, 7 + (index % 4))} days`;
  const remarks = material.remarks || "Preferred for this phase of procurement and aligned with the current specification.";

  return {
    category,
    brand,
    vendor,
    requiredQty,
    approvedQty,
    purchasedQty,
    consumedQty,
    remainingQty,
    unitRate,
    estimatedCost,
    purchasedCost,
    procurementStatus,
    deliveryDate,
    remarks,
  };
}

function getAvailabilityTone(availableQty, requiredQty) {
  if (availableQty <= 0) return "critical";
  if (availableQty <= Math.max(1, Math.round(requiredQty * 0.2))) return "warning";
  return "success";
}

function getAvailabilityLabel(availableQty, requiredQty) {
  if (availableQty <= 0) return "Out of Stock";
  if (availableQty <= Math.max(1, Math.round(requiredQty * 0.2))) return "Low Stock";
  return "Normal";
}

function EmptyMaterials({ message, href, linkLabel }) {
  return (
    <Card>
      <CardContent className="project-tab-panels__empty-content project-materials__empty-state">
        <p className="project-materials__empty-title">{message}</p>
        <p className="project-materials__empty-text">Import materials from the BOQ or add them manually to build a purchase-ready workspace.</p>
        <div className="project-materials__empty-actions">
          <Button asChild variant="outline" size="sm">
            <Link to={href}>{linkLabel}</Link>
          </Button>
          <Button variant="default" size="sm">
            <Plus className="project-materials__toolbar-icon" /> Add Material
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function ProjectMaterialsTab({ materials: initialMaterials }) {
  const [materials, setMaterials] = useState(() => initialMaterials ?? []);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [updateOpen, setUpdateOpen] = useState(false);

  useEffect(() => {
    setMaterials(initialMaterials ?? []);
    setSelectedMaterial(null);
  }, [initialMaterials]);

  const materialStats = useMemo(() => {
    const items = materials.map((material, index) => getMaterialPresentation(material, index));
    const total = items.length;
    const estimatedCost = items.reduce((sum, item) => sum + item.estimatedCost, 0);
    const purchasedCount = items.filter((item) => item.purchasedQty > 0).length;
    const purchasedCost = items.reduce((sum, item) => sum + item.purchasedQty * item.unitRate, 0);
    const consumedCount = items.filter((item) => item.consumedQty > 0).length;
    const consumedCost = items.reduce((sum, item) => sum + item.consumedQty * item.unitRate, 0);

    return { total, estimatedCost, purchasedCount, purchasedCost, consumedCount, consumedCost };
  }, [materials]);

  const displayMaterials = useMemo(() => {
    return materials
      .map((material, index) => ({ ...material, ...getMaterialPresentation(material, index), index }))
      .sort((a, b) => String(a.name).localeCompare(String(b.name)));
  }, [materials]);

  const openUpdateDrawer = (material) => {
    setSelectedMaterial(material);
    setUpdateOpen(true);
  };

  const handleSaveMaterialUpdate = (updatedMaterial) => {
    setMaterials((prev) => prev.map((m) => (m.id === updatedMaterial.id ? updatedMaterial : m)));
    setSelectedMaterial(updatedMaterial);
    setUpdateOpen(false);
  };

  if (!materials || materials.length === 0) {
    return <EmptyMaterials message="No materials added yet." href="/materials" linkLabel="Import from BOQ" />;
  }

  return (
    <div className="project-materials__root">
      <div className="project-materials__summary-grid">
        <Card className="project-materials__summary-card">
          <CardContent>
            <div className="project-materials__summary-top">
              <Package2 className="project-materials__summary-icon" />
              <span className="project-materials__summary-label">Total Materials</span>
            </div>
            <p className="project-materials__summary-value">{materialStats.total} Materials</p>
            <p className="project-materials__summary-note">{formatCurrency(materialStats.estimatedCost)}</p>
          </CardContent>
        </Card>
        <Card className="project-materials__summary-card">
          <CardContent>
            <div className="project-materials__summary-top">
              <ShoppingCart className="project-materials__summary-icon" />
              <span className="project-materials__summary-label">Purchased</span>
            </div>
            <p className="project-materials__summary-value">{materialStats.purchasedCount} Materials</p>
            <p className="project-materials__summary-note">{formatCurrency(materialStats.purchasedCost)}</p>
          </CardContent>
        </Card>
        <Card className="project-materials__summary-card">
          <CardContent>
            <div className="project-materials__summary-top">
              <HardHat className="project-materials__summary-icon" />
              <span className="project-materials__summary-label">Consumed</span>
            </div>
            <p className="project-materials__summary-value">{materialStats.consumedCount} Materials</p>
            <p className="project-materials__summary-note">{formatCurrency(materialStats.consumedCost)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="project-materials__content">
        <div className="project-materials__table-wrap">
          <table className="project-materials__table">
            <thead>
              <tr>
                <th>Material Name</th>
                <th className="project-materials__table-cell--numeric">BOQ Qty</th>
                <th className="project-materials__table-cell--numeric">Purchased</th>
                <th className="project-materials__table-cell--numeric">Consumed</th>
                <th className="project-materials__table-cell--numeric">Available</th>
                <th>Unit</th>
                <th className="project-materials__table-cell--numeric">Unit Rate</th>
                <th className="project-materials__table-cell--numeric">Estimated Cost</th>
              </tr>
            </thead>
            <tbody>
              {displayMaterials.map((material) => {
                const availabilityTone = getAvailabilityTone(material.remainingQty, material.requiredQty);
                const availabilityLabel = getAvailabilityLabel(material.remainingQty, material.requiredQty);

                return (
                  <tr key={material.id} onClick={() => openUpdateDrawer(material)}>
                    <td>
                      <div className="project-materials__table-name">
                        <strong>{material.name}</strong>
                        <span>{material.sku}</span>
                      </div>
                    </td>
                    <td className="project-materials__table-cell--numeric">{material.requiredQty}</td>
                    <td className="project-materials__table-cell--numeric">{material.purchasedQty}</td>
                    <td className="project-materials__table-cell--numeric">{material.consumedQty}</td>
                    <td className="project-materials__table-cell--numeric">
                      <span className={`project-materials__table-availability project-materials__table-availability--${availabilityTone}`}>
                        {availabilityLabel}
                      </span>
                    </td>
                    <td>{material.unit}</td>
                    <td className="project-materials__table-cell--numeric">{formatCurrency(material.unitRate)}</td>
                    <td className="project-materials__table-cell--numeric">{formatCurrency(material.estimatedCost)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selectedMaterial && (
        <MaterialUpdateDialog
          open={updateOpen}
          onOpenChange={(value) => {
            if (!value) {
              setUpdateOpen(false);
              setSelectedMaterial(null);
            }
          }}
          material={selectedMaterial}
          onSaved={handleSaveMaterialUpdate}
        />
      )}
    </div>
  );
}

export function ProjectProcurementTab({ projectId }) {
  const orders = getProjectPurchaseOrders(projectId);
  if (orders.length === 0) {
    return <EmptyTab message="No purchase orders yet." href="/procurement" linkLabel="Open Procurement" />;
  }
  return (<div className="project-tab-panels__list">
    {orders.map((po) => (<Card key={po.id}>
      <CardContent className="project-tab-panels__card-content project-tab-panels__card-content--row">
        <div>
          <p className="project-tab-panels__card-title">{po.vendor}</p>
          <p className="project-tab-panels__card-meta">{po.items} items · Delivery {po.deliveryDate}</p>
        </div>
        <div className="project-tab-panels__actions">
          <span className="project-tab-panels__amount">{formatCurrency(po.amount)}</span>
          <Badge variant={po.status === "delivered" ? "success" : po.status === "cancelled" ? "destructive" : "outline"}>{po.status}</Badge>
        </div>
      </CardContent>
    </Card>))}
  </div>);
}

export function ProjectPaymentsTab({ projectId }) {
  const invoices = getProjectInvoices(projectId);
  if (invoices.length === 0) {
    return <EmptyTab message="No invoices for this project." href="/finance" linkLabel="Open Finance" />;
  }
  return (<div className="project-tab-panels__list">
    {invoices.map((inv) => (<Card key={inv.id}>
      <CardContent className="project-tab-panels__card-content project-tab-panels__card-content--row">
        <div>
          <p className="project-tab-panels__card-title">{inv.clientName}</p>
          <p className="project-tab-panels__card-meta">Issued {inv.issuedDate} · Due {inv.dueDate}</p>
        </div>
        <div className="project-tab-panels__actions">
          <span className="project-tab-panels__amount">{formatCurrency(inv.amount)}</span>
          <Badge variant={inv.status === "paid" ? "success" : inv.status === "overdue" ? "destructive" : "warning"}>{inv.status}</Badge>
        </div>
      </CardContent>
    </Card>))}
  </div>);
}

export function ProjectApprovalsTab({ projectId }) {
  const approvals = getProjectApprovals(projectId);
  if (approvals.length === 0) {
    return <EmptyTab message="No approvals tracked." href="/approvals" linkLabel="Open Approvals" />;
  }
  return (<div className="project-tab-panels__list">
    {approvals.map((a) => (<Card key={a.id}>
      <CardContent className="project-tab-panels__card-content project-tab-panels__card-content--row">
        <div>
          <p className="project-tab-panels__card-title">{a.title}</p>
          <p className="project-tab-panels__card-meta">{a.description}</p>
        </div>
        <div className="project-tab-panels__actions project-tab-panels__actions--badges">
          <Badge variant={a.priority === "high" ? "destructive" : a.priority === "medium" ? "warning" : "outline"}>{a.priority}</Badge>
          <Badge variant={a.status === "approved" ? "success" : a.status === "rejected" ? "destructive" : "secondary"}>{a.status}</Badge>
        </div>
      </CardContent>
    </Card>))}
  </div>);
}

export function ProjectDocumentsTab({ projectId }) {
  const docs = getProjectDocuments(projectId);
  if (docs.length === 0) {
    return <EmptyTab message="No documents uploaded." href="/documents" linkLabel="Open Documents" />;
  }
  return (<div className="project-tab-panels__list">
    {docs.map((d) => (<Card key={d.id}>
      <CardContent className="project-tab-panels__card-content">
        <div>
          <p className="project-tab-panels__card-title">{d.name}</p>
          <p className="project-tab-panels__card-meta">{d.type} · {d.updatedAt}</p>
        </div>
        {d.size && <span className="project-tab-panels__card-meta">{d.size}</span>}
      </CardContent>
    </Card>))}
  </div>);
}

export function ProjectActivityTab({ projectId }) {
  const acts = getProjectActivities(projectId);
  if (acts.length === 0) {
    return <p className="project-tab-panels__empty-message">No activity recorded yet.</p>;
  }
  return (<div className="project-tab-panels__list">
    {acts.map((a) => (<Card key={a.id}>
      <CardContent className="project-tab-panels__activity-content">
        <div className="project-tab-panels__activity-header">
          <p className="project-tab-panels__activity-title">{a.title}</p>
          <span className="project-tab-panels__activity-date">{a.timestamp.split("T")[0]}</span>
        </div>
        <p className="project-tab-panels__activity-desc">{a.description}</p>
        <p className="project-tab-panels__activity-user">{a.userName}</p>
      </CardContent>
    </Card>))}
  </div>);
}

export function ProjectSitePhotosTab({ projectId }) {
  const photos = getProjectSitePhotos(projectId);
  if (photos.length === 0) {
    return <EmptyTab message="No site photos yet." href="/site-progress" linkLabel="Open Site Execution" />;
  }
  return (<div className="project-tab-panels__grid-photos">
    {photos.map((photo) => (<Card key={photo.id} className="project-tab-panels__photo-card">
      <div className="project-tab-panels__photo-preview" />
      <CardContent className="project-tab-panels__photo-body">
        <p className="project-tab-panels__photo-caption">{photo.caption}</p>
        <p className="project-tab-panels__photo-date">{photo.date}</p>
      </CardContent>
    </Card>))}
  </div>);
}

function EmptyTab({ message, href, linkLabel }) {
  return (<Card>
    <CardContent className="project-tab-panels__empty-content">
      <p>{message}</p>
      <Link to={href} className="project-tab-panels__empty-link">{linkLabel} →</Link>
    </CardContent>
  </Card>);
}
