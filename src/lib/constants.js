import { LayoutDashboard, FolderKanban, Users, Palette, FileText, ClipboardList, Package, ShoppingCart, Truck, HardHat, Settings, FolderOpen, CheckSquare, UserCog, CalendarDays, } from "lucide-react";
export const NAV_ITEMS = [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard, group: "Main" },
    { title: "Projects", href: "/app/projects", icon: FolderKanban, group: "Main" },
    { title: "Clients", href: "/clients", icon: Users, group: "Main" },
    { title: "Design", href: "/design-studio", icon: Palette, group: "Design & Estimation" },
    { title: "BOQ", href: "/boq", icon: ClipboardList, group: "Design & Estimation" },
    { title: "Quotations", href: "/quotations", icon: FileText, group: "Design & Estimation" },
    { title: "Material Library", href: "/materials", icon: Package, group: "Execution" },
    // { title: "Vendors", href: "/vendors", icon: Truck, group: "Execution" },

    { title: "Documents", href: "/documents", icon: FolderOpen, group: "Business" },
    // { title: "Approvals", href: "/approvals", icon: CheckSquare, group: "Business" },
    // { title: "Team & Tasks", href: "/team", icon: UserCog, group: "Business" },
    { title: "Calendar", href: "/calendar", icon: CalendarDays, group: "Business" },
    { title: "Settings", href: "/settings", icon: Settings, group: "System" },
];
export const APP_NAME = "ArchiFlow";
export const APP_TAGLINE = "Project & Business Management Platform";
export const APP_LOGO = "/archiflow-logo.png";
export const PROJECT_STATUS_LABELS = {
    concept: "Concept",
    design_dev: "Design Development",
    execution: "Execution",
    handover: "Handover",
    completed: "Completed",
};
export const QUOTATION_STATUS_LABELS = {
    draft: "Draft",
    sent: "Sent",
    approved: "Approved",
    rejected: "Rejected",
};
export const CHART_COLORS = ["#A07A4B", "#6A8BA8", "#5D8A63", "#C88A3D", "#B95C5C", "#E6E0D9"];
export const COLORS = {
    primary: "#E6E0D9",
    secondary: "#D6D0CA",
    accent: "#A07A4B",
    background: "#F7F5F2",
    surface: "#EFEBE6",
    surfaceHover: "#E6E0D9",
    heading: "#000000",
    body: "#000000",
    muted: "#000000",
    border: "#C9C1BA",
    divider: "#DDD6CF",
    success: "#5D8A63",
    warning: "#C88A3D",
    danger: "#B95C5C",
    info: "#6A8BA8",
};
export const CURRENT_USER = {
    id: "user-1",
    name: "Adarsh P",
    email: "adarsh@agaraassociates.com",
    role: "Principal Architect",
    avatar: "/adarsh-profile.png",
};
export const CURRENT_STUDIO = "Agara Associates";
export const DEFAULT_PROJECT_ID = "proj-skyline-villa";
