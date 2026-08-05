export function createMaterialCatalog(catalog) {
    const byId = new Map(catalog.map((m) => [m.id, m]));
    function findMaterialForField(field, overrideMaterialId) {
        if (overrideMaterialId) {
            return byId.get(overrideMaterialId);
        }
        const exact = catalog.find((m) => m.categoryId === field.categoryId && m.subcategoryId === field.subcategoryId);
        if (exact)
            return exact;
        return catalog.find((m) => m.subcategoryId === field.subcategoryId);
    }
    function getMaterialsForField(field) {
        return catalog.filter((m) => m.categoryId === field.categoryId && m.subcategoryId === field.subcategoryId);
    }
    function getMasterMaterialById(id) {
        return byId.get(id);
    }
    function refreshLineItemRates(line) {
        if (!line.materialId)
            return line;
        const material = byId.get(line.materialId);
        if (!material)
            return line;
        return {
            ...line,
            item: material.name,
            rate: material.currentPrice,
            gst: material.gst,
            sku: material.sku,
        };
    }
    return {
        catalog,
        findMaterialForField,
        getMaterialsForField,
        getMasterMaterialById,
        refreshLineItemRates,
    };
}
export function buildLineItemFromMaterial(params) {
    const { field, quantity, material, source, takeoffFieldId, room, id, itemLabel } = params;
    const labour = field.labourFlat ?? (field.labourPerUnit ?? 0) * quantity;
    return {
        id,
        room,
        item: itemLabel ?? material.name,
        quantity,
        unit: material.unit === "bag" && field.unit === "sqft" ? field.unit : material.unit,
        rate: material.currentPrice,
        gst: material.gst,
        labour: Math.round(labour),
        margin: field.defaultMargin ?? 12,
        materialId: material.id,
        sku: material.sku,
        tradeId: field.categoryId,
        sectionId: field.id.split("_")[0],
        takeoffFieldId: takeoffFieldId ?? field.id,
        source,
    };
}
