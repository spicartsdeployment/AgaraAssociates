"use client";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Search, Plus, Upload, Download, LayoutGrid, Table2, Truck, Tag, List, ImageIcon, SlidersHorizontal, GitCompare, X, Check, } from "lucide-react";
import { MaterialCategorySidebar } from "@/components/organisms/material-library/material-category-sidebar";
import { MaterialViews } from "@/components/organisms/material-library/material-views";
import { MaterialDetailSheet } from "@/components/organisms/material-library/material-detail-sheet";
import { PageHeader } from "@/components/templates/page-header";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Badge } from "@/components/common/Badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { DEFAULT_MATERIAL_FILTERS } from "@/lib/materials/default-filters";
import { getCategoryLabel, getSubcategoryLabel } from "@/lib/materials/categories";
import { cx } from "@/lib/utils";
import { MaterialFormDialog } from "@/components/organisms/material-library/material-form-dialog";
import { MaterialImportDialog } from "@/components/organisms/material-library/material-import-dialog";
import { archiveMaterialRecord } from "@/services/materialsService";
import { useMaterialMeta, useMaterialsPage } from "@/lib/hooks/use-materials";
import "@/assets/styles/components/MaterialLibrary.scss";

const VIEW_MODES = [
    { id: "category_grid", label: "Categories", icon: LayoutGrid },
    { id: "table", label: "Table", icon: Table2 },
    { id: "vendor", label: "Vendor", icon: Truck },
    { id: "brand", label: "Brand", icon: Tag },
    { id: "price_list", label: "Price List", icon: List },
    { id: "gallery", label: "Gallery", icon: ImageIcon },
];

export function MaterialLibrary() {
    const [filters, setFilters] = useState(DEFAULT_MATERIAL_FILTERS);
    const [page, setPage] = useState(1);
    const [viewMode, setViewMode] = useState("table");
    const [expandedCategories, setExpandedCategories] = useState(new Set(["interior", "civil_construction"]));
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [compareIds, setCompareIds] = useState([]);
    const [compareCache, setCompareCache] = useState({});
    const [showCompare, setShowCompare] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    const [importOpen, setImportOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const refresh = () => setRefreshKey((v) => v + 1);
    const { meta } = useMaterialMeta();
    const { result, loading, toggleFavorite } = useMaterialsPage(filters, page, 50);
    useEffect(() => {
        setPage(1);
    }, [filters, refreshKey]);
    const stats = meta?.stats ?? { total: 0, inStock: 0, lowStock: 0, favorites: 0, brands: 0, vendors: 0 };
    const brands = meta?.brands ?? [];
    const vendors = meta?.vendors ?? [];
    const filteredMaterials = result?.materials ?? [];
    const totalCount = result?.meta.total ?? 0;
    const totalPages = result?.meta.totalPages ?? 1;
    const updateFilters = useCallback((patch) => {
        setFilters((prev) => ({ ...prev, ...patch }));
    }, []);
    const handleSelectCategory = (categoryId, subcategoryId) => {
        updateFilters({ categoryId, subcategoryId });
        if (subcategoryId)
            setViewMode("table");
    };
    const handleToggleExpand = (categoryId) => {
        setExpandedCategories((prev) => {
            const next = new Set(prev);
            if (next.has(categoryId))
                next.delete(categoryId);
            else
                next.add(categoryId);
            return next;
        });
    };
    const handleToggleFavorite = async (id) => {
        await toggleFavorite(id);
        if (selectedMaterial?.id === id) {
            setSelectedMaterial((prev) => (prev ? { ...prev, isFavorite: !prev.isFavorite } : null));
        }
        refresh();
    };
    const handleToggleCompare = (id) => {
        const material = filteredMaterials.find((m) => m.id === id);
        setCompareIds((prev) => {
            if (prev.includes(id))
                return prev.filter((x) => x !== id);
            if (prev.length >= 4) {
                toast.error("Compare up to 4 materials at a time");
                return prev;
            }
            if (material) {
                setCompareCache((cache) => ({ ...cache, [id]: material }));
            }
            return [...prev, id];
        });
    };
    const compareMaterials = compareIds
        .map((id) => compareCache[id] ?? filteredMaterials.find((m) => m.id === id))
        .filter(Boolean);
    const breadcrumb = filters.categoryId && filters.subcategoryId
        ? `${getCategoryLabel(filters.categoryId)} › ${getSubcategoryLabel(filters.categoryId, filters.subcategoryId)}`
        : filters.categoryId
            ? getCategoryLabel(filters.categoryId)
            : filters.quickFilter === "favorites"
                ? "Favorites"
                : filters.quickFilter === "recent"
                    ? "Recently Used"
                    : filters.quickFilter === "frequent"
                        ? "Frequently Used"
                        : "All Materials";
    const activeFilterCount = filters.brands.length + filters.vendors.length + filters.availability.length + (filters.priceMin != null ? 1 : 0) + (filters.priceMax != null ? 1 : 0);

    return (
        <div className="material-library">
            <PageHeader title="Master Material Library" description="Single source of truth for materials across BOQ, quotations, procurement, and site execution — 1,700+ Agara library items">
                <Button variant="outline" className="material-library__header-btn" onClick={() => setImportOpen(true)}>
                    <Upload className="material-library__header-btn-icon" /> Import
                </Button>
                <Button variant="outline" className="material-library__header-btn" onClick={() => toast.success("Export started", { description: `${totalCount} materials exported to CSV` })}>
                    <Download className="material-library__header-btn-icon" /> Export
                </Button>
                <Button className="material-library__header-btn" onClick={() => { setSelectedMaterial(null); setAddOpen(true); }}>
                    <Plus className="material-library__header-btn-icon" /> Add Material
                </Button>
            </PageHeader>

            <div className="material-library__stats">
                {[
                    { label: "Total Materials", value: stats.total },
                    { label: "In Stock", value: stats.inStock },
                    { label: "Low Stock", value: stats.lowStock },
                    { label: "Favorites", value: stats.favorites },
                    { label: "Brands", value: stats.brands },
                    { label: "Vendors", value: stats.vendors },
                ].map((s) => (
                    <div key={s.label} className="material-library__stat">
                        <p className="material-library__stat-value">{s.value}</p>
                        <p className="material-library__stat-label">{s.label}</p>
                    </div>
                ))}
            </div>

            <div className="material-library__layout">
                <div className="material-library__sidebar-wrap">
                    <MaterialCategorySidebar
                        selectedCategoryId={filters.categoryId}
                        selectedSubcategoryId={filters.subcategoryId}
                        expandedCategories={expandedCategories}
                        quickFilter={filters.quickFilter}
                        categoryCounts={meta?.categoryCounts ?? {}}
                        subcategoryCounts={meta?.subcategoryCounts ?? {}}
                        onSelectCategory={handleSelectCategory}
                        onToggleExpand={handleToggleExpand}
                        onQuickFilter={(qf) => updateFilters({ quickFilter: qf, categoryId: null, subcategoryId: null })}
                    />
                </div>

                <div className="material-library__main">
                    <div className="material-library__toolbar">
                        <div className="material-library__toolbar-row">
                            <div className="material-library__search-wrap">
                                <Search className="material-library__search-icon" />
                                <Input
                                    placeholder="Search by name, SKU, brand, supplier, specification..."
                                    className="material-library__search-input"
                                    value={filters.search}
                                    onChange={(e) => updateFilters({ search: e.target.value })}
                                />
                            </div>
                            <div className="material-library__actions">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" className="material-library__filter-btn">
                                            <SlidersHorizontal className="material-library__filter-icon" /> Filters
                                            {activeFilterCount > 0 && (
                                                <Badge className="material-library__filter-badge">{activeFilterCount}</Badge>
                                            )}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="material-library__filter-menu">
                                        <DropdownMenuLabel>Availability</DropdownMenuLabel>
                                        {["in_stock", "low_stock", "out_of_stock", "made_to_order"].map((a) => (
                                            <DropdownMenuItem
                                                key={a}
                                                onSelect={(e) => {
                                                    e.preventDefault();
                                                    const checked = !filters.availability.includes(a);
                                                    updateFilters({
                                                        availability: checked
                                                            ? [...filters.availability, a]
                                                            : filters.availability.filter((x) => x !== a),
                                                    });
                                                }}
                                            >
                                                <Check
                                                    className={cx(
                                                        "material-library__filter-check",
                                                        filters.availability.includes(a)
                                                            ? "material-library__filter-check--visible"
                                                            : "material-library__filter-check--hidden",
                                                    )}
                                                />
                                                {a.replace(/_/g, " ")}
                                            </DropdownMenuItem>
                                        ))}
                                        <DropdownMenuSeparator />
                                        <DropdownMenuLabel>Price range (₹)</DropdownMenuLabel>
                                        <div className="material-library__filter-price" onClick={(e) => e.stopPropagation()}>
                                            <Input
                                                type="number"
                                                placeholder="Min"
                                                className="material-library__filter-price-input"
                                                value={filters.priceMin ?? ""}
                                                onChange={(e) => updateFilters({ priceMin: e.target.value ? Number(e.target.value) : null })}
                                            />
                                            <Input
                                                type="number"
                                                placeholder="Max"
                                                className="material-library__filter-price-input"
                                                value={filters.priceMax ?? ""}
                                                onChange={(e) => updateFilters({ priceMax: e.target.value ? Number(e.target.value) : null })}
                                            />
                                        </div>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuLabel>Brand</DropdownMenuLabel>
                                        {brands.slice(0, 12).map((b) => (
                                            <DropdownMenuItem
                                                key={b}
                                                onSelect={(e) => {
                                                    e.preventDefault();
                                                    const checked = !filters.brands.includes(b);
                                                    updateFilters({
                                                        brands: checked
                                                            ? [...filters.brands, b]
                                                            : filters.brands.filter((x) => x !== b),
                                                    });
                                                }}
                                            >
                                                <Check
                                                    className={cx(
                                                        "material-library__filter-check",
                                                        filters.brands.includes(b)
                                                            ? "material-library__filter-check--visible"
                                                            : "material-library__filter-check--hidden",
                                                    )}
                                                />
                                                {b}
                                            </DropdownMenuItem>
                                        ))}
                                        <DropdownMenuSeparator />
                                        <DropdownMenuLabel>Vendor</DropdownMenuLabel>
                                        {vendors.slice(0, 10).map((v) => (
                                            <DropdownMenuItem
                                                key={v}
                                                onSelect={(e) => {
                                                    e.preventDefault();
                                                    const checked = !filters.vendors.includes(v);
                                                    updateFilters({
                                                        vendors: checked
                                                            ? [...filters.vendors, v]
                                                            : filters.vendors.filter((x) => x !== v),
                                                    });
                                                }}
                                            >
                                                <Check
                                                    className={cx(
                                                        "material-library__filter-check",
                                                        filters.vendors.includes(v)
                                                            ? "material-library__filter-check--visible"
                                                            : "material-library__filter-check--hidden",
                                                    )}
                                                />
                                                {v}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                {compareIds.length > 0 && (
                                    <Button variant="secondary" size="sm" className="material-library__compare-btn" onClick={() => setShowCompare(true)}>
                                        <GitCompare className="material-library__filter-icon" /> Compare ({compareIds.length})
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="material-library__breadcrumb-row">
                            <div>
                                <h2 className="material-library__breadcrumb-title">{breadcrumb}</h2>
                                <p className="material-library__breadcrumb-count">{totalCount} materials</p>
                            </div>
                            <div className="material-library__view-modes scrollbar-thin">
                                {VIEW_MODES.map((mode) => (
                                    <button
                                        key={mode.id}
                                        type="button"
                                        onClick={() => setViewMode(mode.id)}
                                        className={cx(
                                            "material-library__view-mode",
                                            viewMode === mode.id && "material-library__view-mode--active",
                                        )}
                                    >
                                        <mode.icon className="material-library__view-mode-icon" strokeWidth={1.5} />
                                        {mode.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="material-library__content scrollbar-thin">
                        {loading ? (
                            <div className="material-library__loading">
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <div key={i} className="material-library__skeleton" />
                                ))}
                            </div>
                        ) : (
                            <>
                                <MaterialViews
                                    materials={filteredMaterials}
                                    viewMode={viewMode}
                                    selectedId={selectedMaterial?.id ?? null}
                                    compareIds={compareIds}
                                    categoryId={filters.categoryId}
                                    subcategoryId={filters.subcategoryId}
                                    subcategoryCounts={meta?.subcategoryCounts ?? {}}
                                    onSelect={setSelectedMaterial}
                                    onToggleFavorite={handleToggleFavorite}
                                    onToggleCompare={handleToggleCompare}
                                    onSelectSubcategory={(catId, subId) => {
                                        handleSelectCategory(catId, subId);
                                        setViewMode("table");
                                    }}
                                />
                                {totalPages > 1 && (viewMode === "table" || viewMode === "price_list" || viewMode === "gallery") && (
                                    <div className="material-library__pagination">
                                        <p className="material-library__pagination-text">
                                            Page {page} of {totalPages}
                                        </p>
                                        <div className="material-library__pagination-actions">
                                            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                                                Previous
                                            </Button>
                                            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                                                Next
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {selectedMaterial && (
                <>
                    <div className="material-library__overlay" onClick={() => setSelectedMaterial(null)} />
                    <MaterialDetailSheet
                        material={selectedMaterial}
                        onClose={() => setSelectedMaterial(null)}
                        onToggleFavorite={handleToggleFavorite}
                        onArchive={async (id) => {
                            await archiveMaterialRecord(id);
                            setSelectedMaterial(null);
                            refresh();
                            toast.success("Material archived");
                        }}
                        onEdit={(m) => {
                            setSelectedMaterial(m);
                            setAddOpen(true);
                        }}
                        onRefresh={refresh}
                    />
                </>
            )}

            {showCompare && compareMaterials.length > 0 && (
                <div className="material-library__compare-bar">
                    <div className="material-library__compare-panel">
                        <div className="material-library__compare-header">
                            <h3 className="material-library__compare-title">
                                <GitCompare className="material-library__compare-title-icon" /> Material Comparison
                            </h3>
                            <Button variant="ghost" size="icon" className="material-library__compare-close" onClick={() => setShowCompare(false)}>
                                <X className="material-library__compare-close-icon" />
                            </Button>
                        </div>
                        <div className="material-library__compare-grid">
                            {compareMaterials.map((m) => (
                                <div key={m.id} className="material-library__compare-item">
                                    <p className="material-library__compare-item-name">{m.name}</p>
                                    <p className="material-library__compare-item-brand">{m.brand}</p>
                                    <p className="material-library__compare-item-price">
                                        ₹{m.currentPrice.toLocaleString("en-IN")}/{m.unit}
                                    </p>
                                    <p className="material-library__compare-item-meta">
                                        {m.availability.replace(/_/g, " ")} · {m.leadTimeDays}d
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <MaterialFormDialog open={addOpen} onOpenChange={setAddOpen} material={selectedMaterial} onSaved={refresh} />
            <MaterialImportDialog open={importOpen} onOpenChange={setImportOpen} onImported={refresh} />
        </div>
    );
}
