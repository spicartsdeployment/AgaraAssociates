import importedCategoryExtensions from "@/lib/materials/imported-category-extensions.json";
const BASE_MATERIAL_CATEGORIES = [
    {
        id: "civil_construction",
        label: "Civil & Construction Materials",
        icon: "hard-hat",
        subcategories: [
            { id: "cement", label: "Cement" },
            { id: "sand", label: "Sand" },
            { id: "aggregates", label: "Aggregates" },
            { id: "bricks", label: "Bricks" },
            { id: "blocks", label: "Blocks" },
            { id: "concrete", label: "Concrete" },
            { id: "steel", label: "Steel" },
            { id: "reinforcement", label: "Reinforcement" },
            { id: "waterproofing", label: "Waterproofing" },
            { id: "chemicals", label: "Chemicals" },
            { id: "mortar", label: "Mortar" },
            { id: "plaster", label: "Plaster" },
            { id: "tile_adhesives", label: "Tiles Adhesives" },
            { id: "scaffolding", label: "Scaffolding" },
            { id: "roofing", label: "Roofing" },
            { id: "structural_components", label: "Structural Components" },
        ],
    },
    {
        id: "architectural",
        label: "Architectural Materials",
        icon: "building-2",
        subcategories: [
            { id: "stone", label: "Stone" },
            { id: "granite", label: "Granite" },
            { id: "marble", label: "Marble" },
            { id: "quartz", label: "Quartz" },
            { id: "slate", label: "Slate" },
            { id: "cladding", label: "Cladding" },
            { id: "facade_systems", label: "Facade Systems" },
            { id: "glass", label: "Glass" },
            { id: "aluminium", label: "Aluminium" },
            { id: "acp_panels", label: "ACP Panels" },
            { id: "wooden_elements", label: "Wooden Elements" },
            { id: "metal_finishes", label: "Metal Finishes" },
        ],
    },
    {
        id: "interior",
        label: "Interior Materials",
        icon: "sofa",
        subcategories: [
            { id: "flooring", label: "Flooring" },
            { id: "tiles", label: "Tiles" },
            { id: "wooden_flooring", label: "Wooden Flooring" },
            { id: "vinyl_flooring", label: "Vinyl Flooring" },
            { id: "carpets", label: "Carpets" },
            { id: "wall_panels", label: "Wall Panels" },
            { id: "wallpapers", label: "Wallpapers" },
            { id: "laminates", label: "Laminates" },
            { id: "veneers", label: "Veneers" },
            { id: "plywood", label: "Plywood" },
            { id: "mdf", label: "MDF" },
            { id: "particle_board", label: "Particle Board" },
            { id: "acrylic_sheets", label: "Acrylic Sheets" },
            { id: "solid_surface", label: "Solid Surface" },
            { id: "countertops", label: "Countertops" },
            { id: "false_ceiling", label: "False Ceiling Materials" },
            { id: "paints", label: "Paints" },
            { id: "decorative_finishes", label: "Decorative Finishes" },
        ],
    },
    {
        id: "doors_windows",
        label: "Doors & Windows",
        icon: "door-open",
        subcategories: [
            { id: "wooden_doors", label: "Wooden Doors" },
            { id: "flush_doors", label: "Flush Doors" },
            { id: "upvc_windows", label: "UPVC Windows" },
            { id: "aluminium_windows", label: "Aluminium Windows" },
            { id: "hardware", label: "Hardware" },
            { id: "locks", label: "Locks" },
            { id: "hinges", label: "Hinges" },
            { id: "handles", label: "Handles" },
            { id: "door_closers", label: "Door Closers" },
        ],
    },
    {
        id: "modular_kitchen",
        label: "Modular Kitchen",
        icon: "chef-hat",
        subcategories: [
            { id: "cabinets", label: "Cabinets" },
            { id: "shutters", label: "Shutters" },
            { id: "kitchen_countertops", label: "Countertops" },
            { id: "accessories", label: "Accessories" },
            { id: "appliances", label: "Appliances" },
            { id: "kitchen_hardware", label: "Kitchen Hardware" },
        ],
    },
    {
        id: "furniture",
        label: "Furniture Materials",
        icon: "armchair",
        subcategories: [
            { id: "boards", label: "Boards" },
            { id: "upholstery", label: "Upholstery" },
            { id: "foam", label: "Foam" },
            { id: "fabrics", label: "Fabrics" },
            { id: "leather", label: "Leather" },
            { id: "furniture_glass", label: "Glass" },
            { id: "furniture_metal", label: "Metal" },
            { id: "furniture_hardware", label: "Hardware" },
        ],
    },
    {
        id: "electrical",
        label: "Electrical",
        icon: "zap",
        subcategories: [
            { id: "wires", label: "Wires" },
            { id: "cables", label: "Cables" },
            { id: "switches", label: "Switches" },
            { id: "sockets", label: "Sockets" },
            { id: "distribution_boards", label: "Distribution Boards" },
            { id: "mcb", label: "MCB" },
            { id: "lighting", label: "Lighting" },
            { id: "fans", label: "Fans" },
            { id: "sensors", label: "Sensors" },
            { id: "smart_devices", label: "Smart Devices" },
            { id: "conduits", label: "Conduits" },
        ],
    },
    {
        id: "plumbing",
        label: "Plumbing",
        icon: "droplets",
        subcategories: [
            { id: "pipes", label: "Pipes" },
            { id: "cpvc", label: "CPVC" },
            { id: "upvc", label: "UPVC" },
            { id: "gi", label: "GI" },
            { id: "valves", label: "Valves" },
            { id: "pumps", label: "Pumps" },
            { id: "tanks", label: "Tanks" },
            { id: "fittings", label: "Fittings" },
            { id: "faucets", label: "Faucets" },
            { id: "sanitary_ware", label: "Sanitary Ware" },
            { id: "bathroom_accessories", label: "Bathroom Accessories" },
        ],
    },
    {
        id: "hvac",
        label: "HVAC",
        icon: "wind",
        subcategories: [
            { id: "air_conditioning", label: "Air Conditioning" },
            { id: "ducts", label: "Ducts" },
            { id: "diffusers", label: "Diffusers" },
            { id: "exhaust_systems", label: "Exhaust Systems" },
            { id: "ventilation", label: "Ventilation" },
        ],
    },
    {
        id: "landscape",
        label: "Landscape",
        icon: "trees",
        subcategories: [
            { id: "plants", label: "Plants" },
            { id: "trees", label: "Trees" },
            { id: "lawn", label: "Lawn" },
            { id: "irrigation", label: "Irrigation" },
            { id: "outdoor_lighting", label: "Outdoor Lighting" },
            { id: "pavers", label: "Pavers" },
            { id: "decking", label: "Decking" },
            { id: "water_features", label: "Water Features" },
            { id: "outdoor_furniture", label: "Outdoor Furniture" },
        ],
    },
    {
        id: "smart_home",
        label: "Smart Home & Automation",
        icon: "home",
        subcategories: [
            { id: "security", label: "Security" },
            { id: "cctv", label: "CCTV" },
            { id: "smart_locks", label: "Smart Locks" },
            { id: "smart_lighting", label: "Smart Lighting" },
            { id: "home_automation", label: "Home Automation" },
            { id: "audio_systems", label: "Audio Systems" },
        ],
    },
    {
        id: "fire_safety",
        label: "Fire & Safety",
        icon: "shield",
        subcategories: [
            { id: "fire_extinguishers", label: "Fire Extinguishers" },
            { id: "sprinklers", label: "Sprinklers" },
            { id: "smoke_detectors", label: "Smoke Detectors" },
            { id: "emergency_lights", label: "Emergency Lights" },
            { id: "safety_equipment", label: "Safety Equipment" },
        ],
    },
    {
        id: "miscellaneous",
        label: "Miscellaneous",
        icon: "package",
        subcategories: [
            { id: "fasteners", label: "Fasteners" },
            { id: "adhesives", label: "Adhesives" },
            { id: "sealants", label: "Sealants" },
            { id: "packaging", label: "Packaging" },
            { id: "consumables", label: "Consumables" },
            { id: "cleaning_materials", label: "Cleaning Materials" },
        ],
    },
];
function mergeImportedSubcategories() {
    const extensions = importedCategoryExtensions;
    return BASE_MATERIAL_CATEGORIES.map((cat) => {
        const extra = extensions[cat.id] ?? [];
        const existingIds = new Set(cat.subcategories.map((s) => s.id));
        const merged = [...cat.subcategories];
        for (const sub of extra) {
            if (!existingIds.has(sub.id)) {
                merged.push(sub);
                existingIds.add(sub.id);
            }
        }
        merged.sort((a, b) => a.label.localeCompare(b.label));
        return { ...cat, subcategories: merged };
    });
}
export const MATERIAL_CATEGORIES = mergeImportedSubcategories();
export function getCategoryById(id) {
    return MATERIAL_CATEGORIES.find((c) => c.id === id);
}
export function getSubcategoryLabel(categoryId, subcategoryId) {
    const cat = getCategoryById(categoryId);
    return cat?.subcategories.find((s) => s.id === subcategoryId)?.label ?? subcategoryId;
}
export function getCategoryLabel(categoryId) {
    return getCategoryById(categoryId)?.label ?? categoryId;
}
export const TOTAL_SUBCATEGORIES = MATERIAL_CATEGORIES.reduce((sum, c) => sum + c.subcategories.length, 0);
