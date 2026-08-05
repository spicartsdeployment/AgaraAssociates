import { BUILDING_SUMMARY_FIELD_IDS, findTakeoffField, getTakeoffTemplate, } from "@/lib/boq/takeoff-templates";
import { buildLineItemFromMaterial, } from "@/lib/boq/material-mapping";
const ROOM_FIELD_MAP = [
    { qtyKey: "flooringQty", fieldId: "vitrified_tiles", label: "Flooring" },
    { qtyKey: "paintQty", fieldId: "internal_paint", label: "Wall Paint" },
    { qtyKey: "falseCeilingQty", fieldId: "false_ceiling", label: "False Ceiling" },
    { qtyKey: "wallTilesQty", fieldId: "wall_tiles", label: "Wall Tiles" },
];
function linesFromQuantities(projectType, quantities, materialOverrides, catalog) {
    const lines = [];
    const template = getTakeoffTemplate(projectType);
    template.sections.forEach((section) => {
        section.fields.forEach((field) => {
            if (BUILDING_SUMMARY_FIELD_IDS.has(field.id))
                return;
            const qty = quantities[field.id] ?? 0;
            if (qty <= 0)
                return;
            const material = catalog.findMaterialForField(field, materialOverrides[field.id]);
            if (!material) {
                lines.push({
                    id: `bl-${field.id}-${Date.now()}`,
                    room: "General",
                    item: field.label,
                    quantity: qty,
                    unit: field.unit,
                    rate: 0,
                    gst: 18,
                    labour: field.labourFlat ?? (field.labourPerUnit ?? 0) * qty,
                    margin: field.defaultMargin ?? 12,
                    tradeId: field.categoryId,
                    sectionId: section.id,
                    takeoffFieldId: field.id,
                    source: "takeoff",
                });
                return;
            }
            lines.push(buildLineItemFromMaterial({
                id: `bl-${field.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                room: "General",
                field,
                quantity: qty,
                material,
                source: "takeoff",
                takeoffFieldId: field.id,
            }));
        });
    });
    return lines;
}
function linesFromRooms(projectType, rooms, materialOverrides, catalog) {
    const lines = [];
    rooms.forEach((room) => {
        if (!room.name.trim())
            return;
        ROOM_FIELD_MAP.forEach(({ qtyKey, fieldId, label }) => {
            const qty = Number(room[qtyKey]) || 0;
            if (qty <= 0)
                return;
            const field = findTakeoffField(projectType, fieldId);
            if (!field)
                return;
            const overrideKey = `room_${room.id}_${fieldId}`;
            const material = catalog.findMaterialForField(field, materialOverrides[overrideKey] ?? materialOverrides[fieldId]);
            if (!material)
                return;
            lines.push(buildLineItemFromMaterial({
                id: `bl-room-${room.id}-${fieldId}`,
                room: `${room.name} (${room.floor})`,
                field,
                quantity: qty,
                material,
                source: "room_schedule",
                takeoffFieldId: fieldId,
                itemLabel: `${label} — ${room.name}`,
            }));
        });
    });
    return lines;
}
export function generateBoqLinesFromTakeoff(snapshot, catalog) {
    const fromQuantities = linesFromQuantities(snapshot.projectType, snapshot.quantities, snapshot.materialOverrides, catalog);
    const fromRooms = linesFromRooms(snapshot.projectType, snapshot.rooms, snapshot.materialOverrides, catalog);
    return [...fromQuantities, ...fromRooms];
}
export function buildTakeoffSnapshot(params) {
    return {
        projectType: params.projectType,
        quantities: params.quantities,
        rooms: params.rooms,
        materialOverrides: params.materialOverrides,
        buildingSummary: {
            plotArea: params.quantities.plot_area ?? 0,
            builtUpArea: params.quantities.built_up_area ?? 0,
            numberOfFloors: params.quantities.number_of_floors ?? 0,
            numberOfRooms: params.quantities.number_of_rooms ?? 0,
            carpetArea: params.quantities.carpet_area ?? 0,
        },
    };
}
