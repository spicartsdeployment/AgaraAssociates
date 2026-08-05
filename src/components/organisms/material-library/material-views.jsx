"use client";
import { memo } from "react";
import { MATERIAL_CATEGORIES, getSubcategoryLabel } from "@/lib/materials/categories";
import { PriceChangeBadge } from "@/components/atoms/price-change-badge";
import { Badge } from "@/components/common/Badge";
import { cx } from "@/lib/utils";
import { Star, GitCompare, Eye, Package } from "lucide-react";
import { Button } from "@/components/common/Button";
import "@/assets/styles/components/MaterialViews.scss";

const MATERIAL_GRADIENT_MAP = {
    "from-stone-300 to-stone-500": "material-thumb--gradient-stone",
    "from-slate-400 to-slate-600": "material-thumb--gradient-slate",
    "from-zinc-400 to-zinc-600": "material-thumb--gradient-zinc",
    "from-amber-300 to-amber-500": "material-thumb--gradient-amber",
    "from-emerald-300 to-emerald-500": "material-thumb--gradient-emerald",
    "from-sky-300 to-sky-500": "material-thumb--gradient-sky",
    "from-rose-300 to-rose-500": "material-thumb--gradient-rose",
    "from-indigo-300 to-indigo-500": "material-thumb--gradient-indigo",
    "from-orange-300 to-orange-500": "material-thumb--gradient-orange",
    "from-teal-300 to-teal-500": "material-thumb--gradient-teal",
};

export function getMaterialGradientClass(imageGradient) {
    return MATERIAL_GRADIENT_MAP[imageGradient] ?? "material-thumb--gradient-stone";
}

function availabilityVariant(a) {
    if (a === "in_stock")
        return "success";
    if (a === "low_stock")
        return "warning";
    if (a === "made_to_order")
        return "outline";
    return "destructive";
}

function MaterialThumb({ material, size = "md" }) {
    return (
        <div
            className={cx(
                "material-thumb",
                `material-thumb--${size}`,
                getMaterialGradientClass(material.imageGradient),
            )}
        >
            <span className="material-thumb__label">
                {material.brand.slice(0, 3)}
            </span>
        </div>
    );
}

export const MaterialCard = memo(function MaterialCard({ material, selected, compareSelected, onSelect, onToggleFavorite, onToggleCompare, }) {
    return (
        <div
            className={cx(
                "material-card",
                selected && "material-card--selected",
                compareSelected && "material-card--compare",
            )}
            onClick={() => onSelect(material)}
        >
            <div className="material-card__body">
                <div className="material-card__top">
                    <MaterialThumb material={material} />
                    <div className="material-card__info">
                        <div className="material-card__title-row">
                            <p className="material-card__name">{material.name}</p>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleFavorite(material.id);
                                }}
                                className="material-card__favorite-btn"
                            >
                                <Star
                                    className={cx(
                                        "material-card__favorite-icon",
                                        material.isFavorite
                                            ? "material-card__favorite-icon--active"
                                            : "material-card__favorite-icon--muted",
                                    )}
                                    strokeWidth={1.5}
                                />
                            </button>
                        </div>
                        <p className="material-card__sku">{material.sku}</p>
                        <p className="material-card__brand">{material.brand}</p>
                    </div>
                </div>

                <div className="material-card__price-row">
                    <div>
                        <span className="material-card__price">
                            ₹{material.currentPrice.toLocaleString("en-IN")}
                        </span>
                        <span className="material-card__unit">/{material.unit}</span>
                    </div>
                    <PriceChangeBadge current={material.currentPrice} previous={material.previousPrice} />
                </div>

                <div className="material-card__footer">
                    <Badge variant={availabilityVariant(material.availability)} className="material-card__availability">
                        {material.availability.replace(/_/g, " ")}
                    </Badge>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleCompare(material.id);
                        }}
                        className={cx(
                            "material-card__compare-btn",
                            compareSelected && "material-card__compare-btn--active",
                        )}
                    >
                        <GitCompare className="material-card__compare-icon" strokeWidth={1.5} />
                    </button>
                </div>
            </div>
        </div>
    );
});

export function MaterialViews({ materials, viewMode, selectedId, compareIds, categoryId, subcategoryId, subcategoryCounts, onSelect, onToggleFavorite, onToggleCompare, onSelectSubcategory, }) {
    if (viewMode === "category_grid" && categoryId && !subcategoryId) {
        const cat = MATERIAL_CATEGORIES.find((c) => c.id === categoryId);
        const subCounts = categoryId ? subcategoryCounts[categoryId] ?? {} : {};
        if (cat) {
            return (
                <div className="material-views__subcategory-grid">
                    {cat.subcategories.map((sub) => (
                        <button
                            key={sub.id}
                            type="button"
                            onClick={() => onSelectSubcategory(categoryId, sub.id)}
                            className="material-views__subcategory-btn"
                        >
                            <p className="material-views__subcategory-label">{sub.label}</p>
                            <p className="material-views__subcategory-count">
                                {subCounts[sub.id] ?? 0} material{(subCounts[sub.id] ?? 0) !== 1 ? "s" : ""}
                            </p>
                        </button>
                    ))}
                </div>
            );
        }
    }
    if (materials.length === 0) {
        return (
            <div className="material-views__empty">
                <Package className="material-views__empty-icon" />
                <p className="material-views__empty-title">No materials found</p>
                <p className="material-views__empty-text">Try adjusting filters or search terms</p>
            </div>
        );
    }
    if (viewMode === "table" || viewMode === "price_list") {
        return (
            <div className="material-views__table-wrap">
                <div className="material-views__table-scroll">
                    <table className="material-views__table">
                        <thead>
                            <tr className="material-views__thead-row">
                                {viewMode === "table" && <th className="material-views__th material-views__th--icon" />}
                                <th className="material-views__th">SKU</th>
                                <th className="material-views__th material-views__th--material">Material</th>
                                <th className="material-views__th">Brand</th>
                                {viewMode === "table" && (
                                    <>
                                        <th className="material-views__th">Category</th>
                                        <th className="material-views__th">Unit</th>
                                    </>
                                )}
                                <th className="material-views__th">Price</th>
                                <th className="material-views__th">GST</th>
                                <th className="material-views__th">Stock</th>
                                <th className="material-views__th">Lead</th>
                                <th className="material-views__th material-views__th--actions" />
                            </tr>
                        </thead>
                        <tbody>
                            {materials.map((m) => (
                                <tr
                                    key={m.id}
                                    className={cx(
                                        "material-views__tbody-row",
                                        selectedId === m.id && "material-views__tbody-row--selected",
                                    )}
                                    onClick={() => onSelect(m)}
                                >
                                    {viewMode === "table" && (
                                        <td className="material-views__td">
                                            <Star
                                                className={cx(
                                                    "material-views__star",
                                                    m.isFavorite
                                                        ? "material-views__star--favorite"
                                                        : "material-views__star--muted",
                                                )}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onToggleFavorite(m.id);
                                                }}
                                            />
                                        </td>
                                    )}
                                    <td className="material-views__td material-views__td--mono">{m.sku}</td>
                                    <td className="material-views__td material-views__td--medium">{m.name}</td>
                                    <td className="material-views__td material-views__td--muted">{m.brand}</td>
                                    {viewMode === "table" && (
                                        <>
                                            <td className="material-views__td material-views__td--truncate">
                                                {getSubcategoryLabel(m.categoryId, m.subcategoryId)}
                                            </td>
                                            <td className="material-views__td">{m.unit}</td>
                                        </>
                                    )}
                                    <td className="material-views__td material-views__td--price">
                                        ₹{m.currentPrice.toLocaleString("en-IN")}
                                    </td>
                                    <td className="material-views__td material-views__td--nums">{m.gst}%</td>
                                    <td className="material-views__td">
                                        <Badge variant={availabilityVariant(m.availability)} className="material-card__availability">
                                            {m.availability.replace(/_/g, " ")}
                                        </Badge>
                                    </td>
                                    <td className="material-views__td material-views__td--nums material-views__td--muted">
                                        {m.leadTimeDays}d
                                    </td>
                                    <td className="material-views__td">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="material-views__view-btn"
                                            onClick={(e) => { e.stopPropagation(); onSelect(m); }}
                                        >
                                            <Eye className="material-views__view-btn-icon" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
    if (viewMode === "vendor") {
        const byVendor = materials.reduce((acc, m) => {
            const key = m.supplier;
            acc[key] = acc[key] ?? [];
            acc[key].push(m);
            return acc;
        }, {});
        return (
            <div className="material-views__grouped">
                {Object.entries(byVendor)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([vendor, items]) => (
                        <div key={vendor}>
                            <h3 className="material-views__group-title">
                                {vendor}
                                <Badge variant="outline" className="material-views__group-badge">{items.length}</Badge>
                            </h3>
                            <div className="material-views__card-grid">
                                {items.map((m) => (
                                    <MaterialCard
                                        key={m.id}
                                        material={m}
                                        selected={selectedId === m.id}
                                        compareSelected={compareIds.includes(m.id)}
                                        onSelect={onSelect}
                                        onToggleFavorite={onToggleFavorite}
                                        onToggleCompare={onToggleCompare}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
            </div>
        );
    }
    if (viewMode === "brand") {
        const byBrand = materials.reduce((acc, m) => {
            acc[m.brand] = acc[m.brand] ?? [];
            acc[m.brand].push(m);
            return acc;
        }, {});
        return (
            <div className="material-views__grouped">
                {Object.entries(byBrand)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([brand, items]) => (
                        <div key={brand}>
                            <h3 className="material-views__group-title">
                                {brand}
                                <Badge variant="outline" className="material-views__group-badge">{items.length}</Badge>
                            </h3>
                            <div className="material-views__card-grid">
                                {items.map((m) => (
                                    <MaterialCard
                                        key={m.id}
                                        material={m}
                                        selected={selectedId === m.id}
                                        compareSelected={compareIds.includes(m.id)}
                                        onSelect={onSelect}
                                        onToggleFavorite={onToggleFavorite}
                                        onToggleCompare={onToggleCompare}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
            </div>
        );
    }
    if (viewMode === "gallery") {
        return (
            <div className="material-views__gallery-grid">
                {materials.map((m) => (
                    <div
                        key={m.id}
                        className={cx(
                            "material-views__gallery-item",
                            selectedId === m.id && "material-views__gallery-item--selected",
                        )}
                        onClick={() => onSelect(m)}
                    >
                        <MaterialThumb material={m} size="lg" />
                        <div className="material-views__gallery-body">
                            <p className="material-views__gallery-name">{m.name}</p>
                            <p className="material-views__gallery-meta">
                                {m.brand} · {m.finish ?? m.color ?? m.unit}
                            </p>
                            <p className="material-views__gallery-price">
                                ₹{m.currentPrice.toLocaleString("en-IN")}
                                <span className="material-views__gallery-unit">/{m.unit}</span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        );
    }
    return (
        <div className="material-views__default-grid">
            {materials.map((m) => (
                <MaterialCard
                    key={m.id}
                    material={m}
                    selected={selectedId === m.id}
                    compareSelected={compareIds.includes(m.id)}
                    onSelect={onSelect}
                    onToggleFavorite={onToggleFavorite}
                    onToggleCompare={onToggleCompare}
                />
            ))}
        </div>
    );
}
