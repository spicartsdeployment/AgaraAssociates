function f(id, label, unit, categoryId, subcategoryId, opts) {
    return {
        id,
        label,
        unit,
        fieldType: opts?.fieldType ?? (unit === "nos" || unit === "set" || unit === "lot" ? "count" : "area"),
        categoryId,
        subcategoryId,
        defaultMargin: opts?.defaultMargin ?? 12,
        labourPerUnit: opts?.labourPerUnit,
        labourFlat: opts?.labourFlat,
        placeholder: opts?.placeholder,
        helpText: opts?.helpText,
    };
}
const BUILDING_SUMMARY = {
    id: "building_summary",
    label: "Building Summary",
    description: "Overall building dimensions used for validation and civil quantities",
    fields: [
        f("plot_area", "Plot Area", "sqft", "civil_construction", "structural_components", { helpText: "Total plot / site area" }),
        f("built_up_area", "Built-up Area", "sqft", "civil_construction", "structural_components", { helpText: "Total constructed floor area" }),
        f("carpet_area", "Carpet Area", "sqft", "interior", "flooring", { helpText: "Usable carpet area across floors" }),
        f("number_of_floors", "Number of Floors", "nos", "civil_construction", "structural_components", { fieldType: "count" }),
        f("number_of_rooms", "Number of Rooms", "nos", "interior", "flooring", { fieldType: "count" }),
        f("number_of_bathrooms", "Number of Bathrooms", "nos", "plumbing", "sanitary_ware", { fieldType: "count" }),
    ],
};
const CIVIL_STRUCTURE = {
    id: "civil_structure",
    label: "Civil & Structure",
    fields: [
        f("foundation_area", "Foundation / Footing", "sqft", "civil_construction", "concrete", { defaultMargin: 12, labourPerUnit: 35 }),
        f("rcc_slab_area", "RCC Slab / Structure", "sqft", "civil_construction", "concrete", { defaultMargin: 15, labourPerUnit: 120 }),
        f("brickwork_area", "Brick / Block Masonry", "sqft", "civil_construction", "bricks", { labourPerUnit: 48 }),
        f("plaster_area", "Internal & External Plaster", "sqft", "civil_construction", "plaster", { labourPerUnit: 18 }),
        f("waterproofing_area", "Waterproofing", "sqft", "civil_construction", "waterproofing", { labourPerUnit: 22 }),
        f("cement_bags", "Cement (estimated bags)", "bags", "civil_construction", "cement", { fieldType: "count" }),
        f("steel_tons", "TMT Steel", "MT", "civil_construction", "reinforcement", { fieldType: "weight", defaultMargin: 10 }),
    ],
};
const FLOORING = {
    id: "flooring",
    label: "Flooring",
    fields: [
        f("vitrified_tiles", "Vitrified / Ceramic Tiles", "sqft", "interior", "tiles", { labourPerUnit: 35 }),
        f("marble_flooring", "Marble Flooring", "sqft", "architectural", "marble", { labourPerUnit: 85 }),
        f("wooden_flooring", "Engineered / Wooden Flooring", "sqft", "interior", "wooden_flooring", { labourPerUnit: 42 }),
        f("vinyl_flooring", "Vinyl / SPC Flooring", "sqft", "interior", "vinyl_flooring", { labourPerUnit: 28 }),
        f("bathroom_floor_tiles", "Bathroom Floor Tiles", "sqft", "interior", "tiles", { labourPerUnit: 48 }),
        f("anti_skid_tiles", "Anti-skid / Outdoor Tiles", "sqft", "interior", "tiles", { labourPerUnit: 38 }),
        f("carpet_area_flooring", "Carpet Flooring", "sqft", "interior", "carpets", { labourPerUnit: 15 }),
    ],
};
const WALLS_PAINTS = {
    id: "walls_paints",
    label: "Walls & Paints",
    fields: [
        f("internal_paint", "Internal Wall Paint", "sqft", "interior", "paints", { labourPerUnit: 18 }),
        f("external_paint", "External Wall Paint", "sqft", "interior", "paints", { labourPerUnit: 22 }),
        f("texture_paint", "Texture / Designer Paint", "sqft", "interior", "decorative_finishes", { labourPerUnit: 35 }),
        f("wall_tiles", "Wall Tiles (Kitchen/Bath)", "sqft", "interior", "tiles", { labourPerUnit: 48 }),
        f("wallpaper", "Wallpaper", "sqft", "interior", "wallpapers", { labourPerUnit: 25 }),
        f("wall_panels", "Wall Panels / Cladding", "sqft", "interior", "wall_panels", { labourPerUnit: 45 }),
        f("putty_area", "Wall Putty / Primer", "sqft", "interior", "paints", { labourPerUnit: 12 }),
    ],
};
const CEILING = {
    id: "ceiling",
    label: "Ceiling",
    fields: [
        f("false_ceiling", "Gypsum / POP False Ceiling", "sqft", "interior", "false_ceiling", { labourPerUnit: 45 }),
        f("cove_lighting", "Cove Lighting (running ft)", "rft", "electrical", "lighting", { fieldType: "length", labourPerUnit: 35 }),
        f("acoustic_ceiling", "Acoustic Ceiling Tiles", "sqft", "interior", "false_ceiling", { labourPerUnit: 40 }),
    ],
};
const DOORS_WINDOWS = {
    id: "doors_windows",
    label: "Doors & Windows",
    fields: [
        f("main_doors", "Main Entrance Doors", "nos", "doors_windows", "wooden_doors", { fieldType: "count", labourFlat: 2500 }),
        f("internal_doors", "Internal Flush Doors", "nos", "doors_windows", "flush_doors", { fieldType: "count", labourFlat: 1800 }),
        f("bathroom_doors", "Bathroom Doors", "nos", "doors_windows", "flush_doors", { fieldType: "count", labourFlat: 1500 }),
        f("upvc_windows", "UPVC Windows", "sqft", "doors_windows", "upvc_windows", { labourPerUnit: 55 }),
        f("aluminium_windows", "Aluminium Windows", "sqft", "doors_windows", "aluminium_windows", { labourPerUnit: 65 }),
        f("door_hardware_sets", "Door Hardware Sets", "set", "doors_windows", "hardware", { fieldType: "count" }),
    ],
};
const KITCHEN_WARDROBES = {
    id: "kitchen_wardrobes",
    label: "Kitchen & Wardrobes",
    fields: [
        f("modular_kitchen", "Modular Kitchen", "lot", "modular_kitchen", "cabinets", { fieldType: "lot", labourFlat: 25000, defaultMargin: 20 }),
        f("kitchen_countertop", "Kitchen Countertop", "sqft", "modular_kitchen", "kitchen_countertops", { labourPerUnit: 0 }),
        f("wardrobe", "Wardrobe / Storage", "sqft", "interior", "laminates", { labourPerUnit: 120, defaultMargin: 18 }),
        f("vanity_units", "Vanity Units", "nos", "modular_kitchen", "cabinets", { fieldType: "count", labourFlat: 3500 }),
    ],
};
const ELECTRICAL = {
    id: "electrical",
    label: "Electrical",
    fields: [
        f("light_points", "Light Points", "nos", "electrical", "lighting", { fieldType: "count", labourFlat: 450 }),
        f("fan_points", "Fan Points", "nos", "electrical", "switches", { fieldType: "count", labourFlat: 550 }),
        f("power_sockets", "Power Sockets", "nos", "electrical", "switches", { fieldType: "count", labourFlat: 380 }),
        f("ac_points", "AC Points", "nos", "electrical", "wires", { fieldType: "count", labourFlat: 2200 }),
        f("wiring_lot", "Electrical Wiring (lump sum)", "lot", "electrical", "wires", { fieldType: "lot", labourFlat: 45000 }),
        f("mcb_panel", "MCB / Distribution Panel", "nos", "electrical", "mcb", { fieldType: "count", labourFlat: 1200 }),
    ],
};
const PLUMBING = {
    id: "plumbing",
    label: "Plumbing & Sanitary",
    fields: [
        f("bathroom_suites", "Bathroom Sanitary Sets", "set", "plumbing", "sanitary_ware", { fieldType: "count", labourFlat: 8000 }),
        f("kitchen_sink", "Kitchen Sink & Faucet", "nos", "plumbing", "faucets", { fieldType: "count", labourFlat: 1500 }),
        f("geyser", "Geysers / Water Heaters", "nos", "plumbing", "bathroom_accessories", { fieldType: "count", labourFlat: 800 }),
        f("cpvc_piping", "CPVC Plumbing (lump sum)", "lot", "plumbing", "cpvc", { fieldType: "lot", labourFlat: 18000 }),
        f("drainage_lot", "Drainage & Sewerage", "lot", "plumbing", "pipes", { fieldType: "lot", labourFlat: 12000 }),
    ],
};
const HVAC_MISC = {
    id: "hvac_misc",
    label: "HVAC & Miscellaneous",
    fields: [
        f("split_ac", "Split AC Units", "nos", "hvac", "air_conditioning", { fieldType: "count", labourFlat: 3500 }),
        f("exhaust_fans", "Exhaust Fans", "nos", "hvac", "ventilation", { fieldType: "count", labourFlat: 600 }),
        f("fire_extinguishers", "Fire Extinguishers", "nos", "fire_safety", "fire_extinguishers", { fieldType: "count" }),
        f("smoke_detectors", "Smoke Detectors", "nos", "fire_safety", "smoke_detectors", { fieldType: "count", labourFlat: 400 }),
    ],
};
const COMMERCIAL_EXTRA = {
    id: "commercial_finishes",
    label: "Commercial Finishes",
    fields: [
        f("facade_cladding", "Facade / ACP Cladding", "sqft", "architectural", "acp_panels", { labourPerUnit: 75 }),
        f("glass_facade", "Structural Glazing", "sqft", "architectural", "glass", { labourPerUnit: 95 }),
        f("raised_flooring", "Raised Access Flooring", "sqft", "interior", "flooring", { labourPerUnit: 55 }),
        f("partition_walls", "Drywall Partitions", "sqft", "interior", "wall_panels", { labourPerUnit: 42 }),
        f("server_room_flooring", "Server Room Anti-static Floor", "sqft", "interior", "vinyl_flooring", { labourPerUnit: 48 }),
    ],
};
const RETAIL_EXTRA = {
    id: "retail_fitout",
    label: "Retail Fit-out",
    fields: [
        f("display_units", "Display / Gondola Units", "nos", "furniture", "furniture_hardware", { fieldType: "count", labourFlat: 4500 }),
        f("cash_counter", "Cash Counter / POS Unit", "nos", "furniture", "boards", { fieldType: "count", labourFlat: 6000 }),
        f("signage", "Signage & Branding", "lot", "miscellaneous", "consumables", { fieldType: "lot", labourFlat: 15000 }),
        f("trial_rooms", "Trial Room Fit-out", "nos", "interior", "wall_panels", { fieldType: "count", labourFlat: 12000 }),
    ],
};
const OFFICE_EXTRA = {
    id: "office_fitout",
    label: "Office Fit-out",
    fields: [
        f("workstations", "Workstation Modules", "nos", "furniture", "boards", { fieldType: "count", labourFlat: 3500 }),
        f("meeting_room_fitout", "Meeting Room Fit-out", "nos", "interior", "wall_panels", { fieldType: "count", labourFlat: 25000 }),
        f("cafeteria_fitout", "Cafeteria / Pantry", "lot", "modular_kitchen", "cabinets", { fieldType: "lot", labourFlat: 35000 }),
        f("access_control", "Access Control Points", "nos", "smart_home", "security", { fieldType: "count", labourFlat: 2500 }),
    ],
};
const HOSPITALITY_EXTRA = {
    id: "hospitality_ff_e",
    label: "Hospitality FF&E",
    fields: [
        f("guest_room_fitout", "Guest Room Fit-out (per key)", "nos", "furniture", "fabrics", { fieldType: "count", labourFlat: 45000 }),
        f("lobby_flooring", "Lobby Premium Flooring", "sqft", "architectural", "marble", { labourPerUnit: 95 }),
        f("banquet_fitout", "Banquet / Event Space", "sqft", "interior", "decorative_finishes", { labourPerUnit: 120 }),
        f("linen_wardrobe", "Housekeeping / Linen Storage", "sqft", "interior", "laminates", { labourPerUnit: 100 }),
    ],
};
const RESIDENTIAL_SECTIONS = [
    BUILDING_SUMMARY,
    CIVIL_STRUCTURE,
    FLOORING,
    WALLS_PAINTS,
    CEILING,
    DOORS_WINDOWS,
    KITCHEN_WARDROBES,
    ELECTRICAL,
    PLUMBING,
    HVAC_MISC,
];
const TEMPLATE_MAP = {
    residential: RESIDENTIAL_SECTIONS,
    commercial: [...RESIDENTIAL_SECTIONS, COMMERCIAL_EXTRA],
    retail: [...RESIDENTIAL_SECTIONS, RETAIL_EXTRA],
    office: [...RESIDENTIAL_SECTIONS, OFFICE_EXTRA, COMMERCIAL_EXTRA],
    hospitality: [...RESIDENTIAL_SECTIONS, HOSPITALITY_EXTRA],
};
const PROJECT_TYPE_LABELS = {
    residential: "Residential",
    commercial: "Commercial",
    retail: "Retail",
    hospitality: "Hospitality",
    office: "Office",
};
export function getTakeoffTemplate(projectType) {
    return {
        projectType,
        label: PROJECT_TYPE_LABELS[projectType],
        sections: TEMPLATE_MAP[projectType] ?? RESIDENTIAL_SECTIONS,
    };
}
export function getAllTakeoffFields(projectType) {
    return getTakeoffTemplate(projectType).sections.flatMap((s) => s.fields);
}
export function findTakeoffField(projectType, fieldId) {
    return getAllTakeoffFields(projectType).find((f) => f.id === fieldId);
}
export const PROJECT_TYPE_OPTIONS = [
    { value: "residential", label: "Residential" },
    { value: "commercial", label: "Commercial" },
    { value: "retail", label: "Retail" },
    { value: "office", label: "Office" },
    { value: "hospitality", label: "Hospitality" },
];
export const DEFAULT_ROOM_ROW = () => ({
    id: `room-${Date.now()}`,
    name: "",
    floor: "Ground",
    length: 0,
    width: 0,
    height: 9,
    floorArea: 0,
    wallArea: 0,
    ceilingArea: 0,
    flooringQty: 0,
    paintQty: 0,
    falseCeilingQty: 0,
    wallTilesQty: 0,
});
export function computeRoomAreas(length, width, height) {
    const floorArea = Math.round(length * width * 100) / 100;
    const wallArea = Math.round(2 * (length + width) * height * 100) / 100;
    const ceilingArea = floorArea;
    return { floorArea, wallArea, ceilingArea };
}
/** Building summary field IDs — stored in snapshot but not priced as BOQ lines */
export const BUILDING_SUMMARY_FIELD_IDS = new Set(BUILDING_SUMMARY.fields.map((f) => f.id));
