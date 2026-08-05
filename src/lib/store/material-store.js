let materials = null;
export function isMaterialStoreInitialized() {
    return materials !== null;
}
export function initializeMaterialStore(seed) {
    if (!materials) {
        materials = seed.map((m) => ({ ...m }));
    }
}
function requireMaterials() {
    if (!materials) {
        throw new Error("Material store not initialized. Call ensureMaterialStoreLoaded() on the server first.");
    }
    return materials;
}
export function getAllMasterMaterials(includeArchived = false) {
    const list = requireMaterials();
    return includeArchived ? list : list.filter((m) => !m.archived);
}
export function getMasterMaterialById(id) {
    return requireMaterials().find((m) => m.id === id);
}
export function getMasterMaterialBySku(sku) {
    return requireMaterials().find((m) => m.sku.toLowerCase() === sku.toLowerCase());
}
export function toggleMaterialFavorite(id) {
    materials = requireMaterials().map((m) => m.id === id ? { ...m, isFavorite: !m.isFavorite } : m);
    return getMasterMaterialById(id);
}
export function archiveMaterial(id) {
    materials = requireMaterials().map((m) => (m.id === id ? { ...m, archived: true } : m));
}
export function incrementMaterialUsage(id) {
    materials = requireMaterials().map((m) => m.id === id
        ? {
            ...m,
            usageCount: m.usageCount + 1,
            lastUsedAt: new Date().toISOString().split("T")[0],
        }
        : m);
}
export function getUniqueBrands() {
    return [...new Set(getAllMasterMaterials().map((m) => m.brand))].sort();
}
export function getUniqueVendors() {
    const names = new Set();
    getAllMasterMaterials().forEach((m) => {
        m.vendors.forEach((v) => names.add(v.name));
        names.add(m.supplier);
    });
    return [...names].sort();
}
export function filterMasterMaterials(filters) {
    let result = getAllMasterMaterials();
    if (filters.quickFilter === "favorites") {
        result = result.filter((m) => m.isFavorite);
    }
    else if (filters.quickFilter === "recent") {
        result = result
            .filter((m) => m.lastUsedAt)
            .sort((a, b) => (b.lastUsedAt ?? "").localeCompare(a.lastUsedAt ?? ""));
    }
    else if (filters.quickFilter === "frequent") {
        result = [...result].sort((a, b) => b.usageCount - a.usageCount);
    }
    if (filters.categoryId) {
        result = result.filter((m) => m.categoryId === filters.categoryId);
    }
    if (filters.subcategoryId) {
        result = result.filter((m) => m.subcategoryId === filters.subcategoryId);
    }
    if (filters.brands.length > 0) {
        result = result.filter((m) => filters.brands.includes(m.brand));
    }
    if (filters.vendors.length > 0) {
        result = result.filter((m) => filters.vendors.some((v) => m.supplier === v || m.vendors.some((mv) => mv.name === v)));
    }
    if (filters.availability.length > 0) {
        result = result.filter((m) => filters.availability.includes(m.availability));
    }
    if (filters.priceMin != null) {
        result = result.filter((m) => m.currentPrice >= filters.priceMin);
    }
    if (filters.priceMax != null) {
        result = result.filter((m) => m.currentPrice <= filters.priceMax);
    }
    if (filters.search.trim()) {
        const q = filters.search.toLowerCase();
        result = result.filter((m) => m.name.toLowerCase().includes(q) ||
            m.sku.toLowerCase().includes(q) ||
            m.brand.toLowerCase().includes(q) ||
            m.supplier.toLowerCase().includes(q) ||
            m.specification?.toLowerCase().includes(q));
    }
    return result;
}
export function getMaterialStats() {
    const active = getAllMasterMaterials();
    return {
        total: active.length,
        inStock: active.filter((m) => m.availability === "in_stock").length,
        lowStock: active.filter((m) => m.availability === "low_stock").length,
        favorites: active.filter((m) => m.isFavorite).length,
        brands: getUniqueBrands().length,
        vendors: getUniqueVendors().length,
    };
}
export function getMaterialsByCategory(categoryId) {
    return getAllMasterMaterials().filter((m) => m.categoryId === categoryId);
}
export function getMaterialsBySubcategory(categoryId, subcategoryId) {
    return getAllMasterMaterials().filter((m) => m.categoryId === categoryId && m.subcategoryId === subcategoryId);
}
export function getCategoryMaterialCounts() {
    const counts = {};
    getAllMasterMaterials().forEach((m) => {
        counts[m.categoryId] = (counts[m.categoryId] ?? 0) + 1;
    });
    return counts;
}
export function getSubcategoryMaterialCounts(categoryId) {
    const counts = {};
    getMaterialsByCategory(categoryId).forEach((m) => {
        counts[m.subcategoryId] = (counts[m.subcategoryId] ?? 0) + 1;
    });
    return counts;
}
export function addMaterial(input) {
    const id = `ml-${Date.now()}`;
    const material = {
        id,
        sku: input.sku,
        name: input.name,
        categoryId: input.categoryId,
        subcategoryId: input.subcategoryId,
        brand: input.brand,
        manufacturer: input.brand,
        supplier: input.supplier,
        unit: input.unit,
        specification: input.specification,
        imageGradient: "from-stone-300 to-stone-500",
        currentPrice: input.currentPrice,
        previousPrice: input.previousPrice ?? input.currentPrice,
        gst: input.gst,
        moq: 1,
        leadTimeDays: 7,
        availability: input.availability ?? "in_stock",
        stockQuantity: 0,
        vendors: [
            {
                id: `v-${id}`,
                name: input.supplier,
                price: input.currentPrice,
                leadTimeDays: 7,
                isPreferred: true,
            },
        ],
        preferredVendorId: `v-${id}`,
        alternateMaterialIds: [],
        compatibleMaterialIds: [],
        isFavorite: false,
        usageCount: 0,
        archived: false,
        legacyCategory: "tiles",
    };
    materials = [material, ...requireMaterials()];
    return material;
}
export function updateMaterial(id, patch) {
    materials = requireMaterials().map((m) => {
        if (m.id !== id)
            return m;
        const updated = { ...m, ...patch };
        if (patch.currentPrice != null && patch.currentPrice !== m.currentPrice) {
            updated.previousPrice = m.currentPrice;
        }
        return updated;
    });
    return getMasterMaterialById(id);
}
export function importMaterials(rows) {
    rows.forEach((row) => addMaterial(row));
    return rows.length;
}
export function getAllSubcategoryMaterialCounts() {
    const result = {};
    getAllMasterMaterials().forEach((m) => {
        result[m.categoryId] ??= {};
        result[m.categoryId][m.subcategoryId] = (result[m.categoryId][m.subcategoryId] ?? 0) + 1;
    });
    return result;
}
export function paginateMaterials(items, page, limit) {
    const total = items.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const safePage = Math.min(Math.max(1, page), totalPages);
    const start = (safePage - 1) * limit;
    return {
        items: items.slice(start, start + limit),
        page: safePage,
        limit,
        total,
        totalPages,
    };
}
