"use client";
import { HardHat, Building2, Sofa, DoorOpen, ChefHat, Armchair, Zap, Droplets, Wind, Trees, Home, Shield, Package, ChevronRight, ChevronDown, Star, Clock, TrendingUp, LayoutGrid, } from "lucide-react";
import { MATERIAL_CATEGORIES, TOTAL_SUBCATEGORIES } from "@/lib/materials/categories";
import { cx } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import "@/assets/styles/components/MaterialCategorySidebar.scss";

const ICON_MAP = {
    "hard-hat": HardHat,
    "building-2": Building2,
    sofa: Sofa,
    "door-open": DoorOpen,
    "chef-hat": ChefHat,
    armchair: Armchair,
    zap: Zap,
    droplets: Droplets,
    wind: Wind,
    trees: Trees,
    home: Home,
    shield: Shield,
    package: Package,
};

export function MaterialCategorySidebar({ selectedCategoryId, selectedSubcategoryId, expandedCategories, quickFilter, categoryCounts, subcategoryCounts, onSelectCategory, onToggleExpand, onQuickFilter, }) {
    const quickLinks = [
        { id: "all", label: "All Materials", icon: LayoutGrid },
        { id: "favorites", label: "Favorites", icon: Star },
        { id: "recent", label: "Recently Used", icon: Clock },
        { id: "frequent", label: "Frequently Used", icon: TrendingUp },
    ];
    return (
        <aside className="material-category-sidebar">
            <div className="material-category-sidebar__header">
                <h2 className="material-category-sidebar__title">Categories</h2>
                <p className="material-category-sidebar__subtitle">
                    {MATERIAL_CATEGORIES.length} main · {TOTAL_SUBCATEGORIES}+ sub
                </p>
            </div>

            <ScrollArea className="material-category-sidebar__scroll">
                <div className="material-category-sidebar__list">
                    {quickLinks.map((link) => (
                        <button
                            key={link.id}
                            type="button"
                            onClick={() => {
                                onQuickFilter(link.id);
                                onSelectCategory(null, null);
                            }}
                            className={cx(
                                "material-category-sidebar__quick-link",
                                quickFilter === link.id && !selectedCategoryId && "material-category-sidebar__quick-link--active",
                            )}
                        >
                            <link.icon className="material-category-sidebar__quick-icon" strokeWidth={1.5} />
                            {link.label}
                        </button>
                    ))}

                    <div className="material-category-sidebar__divider" />

                    {MATERIAL_CATEGORIES.map((cat) => {
                        const Icon = ICON_MAP[cat.icon] ?? Package;
                        const isExpanded = expandedCategories.has(cat.id);
                        const isSelected = selectedCategoryId === cat.id && !selectedSubcategoryId;
                        const count = categoryCounts[cat.id] ?? 0;
                        const subCounts = subcategoryCounts[cat.id] ?? {};
                        return (
                            <div key={cat.id}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        onQuickFilter("all");
                                        onToggleExpand(cat.id);
                                        onSelectCategory(cat.id, null);
                                    }}
                                    className={cx(
                                        "material-category-sidebar__category-btn",
                                        isSelected && "material-category-sidebar__category-btn--active",
                                    )}
                                >
                                    <span
                                        className="material-category-sidebar__expand-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onToggleExpand(cat.id);
                                        }}
                                    >
                                        {isExpanded ? (
                                            <ChevronDown className="material-category-sidebar__expand-icon" />
                                        ) : (
                                            <ChevronRight className="material-category-sidebar__expand-icon" />
                                        )}
                                    </span>
                                    <Icon className="material-category-sidebar__category-icon" strokeWidth={1.5} />
                                    <span className="material-category-sidebar__category-label">{cat.label}</span>
                                    {count > 0 && (
                                        <span className="material-category-sidebar__category-count">{count}</span>
                                    )}
                                </button>

                                {isExpanded && (
                                    <div className="material-category-sidebar__sub-list">
                                        {cat.subcategories.map((sub) => {
                                            const subCount = subCounts[sub.id] ?? 0;
                                            const isSubSelected = selectedCategoryId === cat.id && selectedSubcategoryId === sub.id;
                                            return (
                                                <button
                                                    key={sub.id}
                                                    type="button"
                                                    onClick={() => {
                                                        onQuickFilter("all");
                                                        onSelectCategory(cat.id, sub.id);
                                                    }}
                                                    className={cx(
                                                        "material-category-sidebar__sub-btn",
                                                        isSubSelected && "material-category-sidebar__sub-btn--active",
                                                    )}
                                                >
                                                    <span className="material-category-sidebar__sub-label">{sub.label}</span>
                                                    {subCount > 0 && (
                                                        <span className="material-category-sidebar__sub-count">{subCount}</span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </ScrollArea>
        </aside>
    );
}
