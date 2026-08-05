import { Building2, Sofa, Key, Hammer, ClipboardCheck, Layers, Compass, Palette, HardHat, Construction, } from "lucide-react";
export const SERVICE_TYPE_OPTIONS = [
    { id: "architecture", label: "Architecture", description: "Full architectural design services", icon: Building2 },
    { id: "interior_design", label: "Interior Design", description: "Interior planning and styling", icon: Sofa },
    { id: "turnkey", label: "Turnkey", description: "End-to-end design and execution", icon: Key },
    { id: "renovation", label: "Renovation", description: "Remodeling and refurbishment", icon: Hammer },
    { id: "project_management", label: "Project Management", description: "Schedule, cost, and coordination", icon: ClipboardCheck },
    { id: "design_build", label: "Design & Build", description: "Integrated design and construction", icon: Layers },
    { id: "architectural_consultancy", label: "Architectural Consultancy", description: "Expert advisory and review", icon: Compass },
    { id: "interior_consultancy", label: "Interior Consultancy", description: "Interior advisory services", icon: Palette },
    { id: "construction_supervision", label: "Construction Supervision", description: "On-site quality oversight", icon: HardHat },
    { id: "construction", label: "Construction", description: "Full construction execution", icon: Construction },
];
export const CONSTRUCTION_TYPE_OPTIONS = [
    { value: "residential", label: "Residential" },
    { value: "commercial", label: "Commercial" },
    { value: "industrial", label: "Industrial" },
    { value: "villa", label: "Villa" },
    { value: "apartment", label: "Apartment" },
    { value: "office", label: "Office" },
    { value: "retail", label: "Retail" },
    { value: "institutional", label: "Institutional" },
];
export const FOUNDATION_TYPE_OPTIONS = [
    { value: "isolated_footing", label: "Isolated Footing" },
    { value: "combined_footing", label: "Combined Footing" },
    { value: "raft", label: "Raft Foundation" },
    { value: "pile", label: "Pile Foundation" },
    { value: "strip", label: "Strip Foundation" },
];
export const STRUCTURAL_SYSTEM_OPTIONS = [
    { value: "rcc_frame", label: "RCC Frame" },
    { value: "steel_frame", label: "Steel Frame" },
    { value: "load_bearing", label: "Load Bearing" },
    { value: "precast", label: "Precast" },
    { value: "hybrid", label: "Hybrid" },
];
export const CONSTRUCTION_METHOD_OPTIONS = [
    { value: "conventional", label: "Conventional" },
    { value: "precast", label: "Precast" },
    { value: "modular", label: "Modular" },
    { value: "hybrid", label: "Hybrid" },
];
export const MACHINERY_OPTIONS = [
    "Tower Crane",
    "Batching Plant",
    "Excavator",
    "Concrete Pump",
    "Scaffolding System",
    "Vibrator",
    "Cutting Machine",
    "Welding Set",
];
export const APPROVAL_OPTIONS = [
    "Building Plan Sanction",
    "Fire NOC",
    "Environmental Clearance",
    "Labour License",
    "Structural Stability Certificate",
    "Occupancy Certificate",
];
export const SAFETY_COMPLIANCE_OPTIONS = [
    "PPE for all workers",
    "Site safety signage",
    "First aid station",
    "Fire extinguishers",
    "Scaffolding inspection",
    "Electrical safety audit",
    "Fall protection systems",
    "Daily toolbox talks",
];
export const SERVICE_TYPE_LABELS = Object.fromEntries(SERVICE_TYPE_OPTIONS.map((o) => [o.id, o.label]));
export const ONBOARDING_STEPS = [
    { id: "basics", label: "Project Basics" },
    { id: "services", label: "Service Types" },
    { id: "construction", label: "Construction Details" },
    { id: "team", label: "Team & Timeline" },
    { id: "review", label: "Review" },
];
