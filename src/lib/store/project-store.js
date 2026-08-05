import { projects as seedProjects, milestones as seedMilestones, risks as seedRisks } from "@/lib/mock/projects";
import { boqs as seedBoqs, kanbanTasks as seedKanbanTasks } from "@/lib/mock/data-seed";
import { aiInsights as seedInsights, activities as seedActivities } from "@/lib/mock/activities";
import { CURRENT_USER } from "@/lib/constants";
import { getClientById, createClient, incrementClientProjectStats } from "@/lib/store/client-store";
import { projectMaterialsById } from "@/constants/projectData";

function getDefaultMaterialsForProject(project) {
    if (project.serviceTypes?.includes("construction")) {
        return projectMaterialsById[1];
    }
    if (project.serviceTypes?.includes("interior_design") || project.serviceTypes?.includes("interior_consultancy") || project.serviceTypes?.includes("renovation")) {
        return projectMaterialsById[2];
    }
    if (project.serviceTypes?.includes("turnkey")) {
        return projectMaterialsById[14];
    }
    return projectMaterialsById[1];
}

let projects = seedProjects.map((project) => ({
    ...project,
    materials: project.materials ?? getDefaultMaterialsForProject(project),
}));
let milestones = [...seedMilestones];
const risks = [...seedRisks];
let boqs = [...seedBoqs];
let kanbanTasks = [...seedKanbanTasks];
let aiInsights = [...seedInsights];
let activities = [...seedActivities];
export function getAllProjects() {
    return projects;
}
export function getProjectByIdFromStore(id) {
    return projects.find((p) => p.id === id);
}
export function getMilestonesByProjectId(projectId) {
    return milestones.filter((m) => m.projectId === projectId);
}
export function getRisksByProjectId(projectId) {
    return risks.filter((r) => r.projectId === projectId);
}
export function getBoqsByProjectId(projectId) {
    return boqs.filter((b) => b.projectId === projectId);
}
export function getKanbanTasksByProjectId(projectId) {
    return kanbanTasks.filter((t) => t.projectId === projectId);
}
export function getActivitiesByProjectId(projectId) {
    return activities.filter((a) => a.projectId === projectId);
}
export function createBoq(input) {
    const project = projects.find((p) => p.id === input.projectId);
    const boq = {
        id: `boq-${input.projectId}-${Date.now()}`,
        projectId: input.projectId,
        projectName: project?.name ?? input.projectId,
        title: input.title,
        items: input.items,
        projectType: input.projectType ?? project?.type,
        takeoffSnapshot: input.takeoffSnapshot,
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
    };
    boqs = [boq, ...boqs];
    return boq;
}
export function getBoqByIdFromStore(id) {
    return boqs.find((b) => b.id === id);
}
export function updateBoqItems(id, items) {
    boqs = boqs.map((b) => b.id === id ? { ...b, items, updatedAt: new Date().toISOString().split("T")[0] } : b);
    return getBoqByIdFromStore(id);
}
export function getInsightsByProjectId(projectId) {
    return aiInsights.filter((i) => i.projectId === projectId);
}
function slugify(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
function generateId(prefix, name) {
    const base = `${prefix}-${slugify(name)}`;
    let id = base;
    let counter = 1;
    while (projects.some((p) => p.id === id)) {
        id = `${base}-${counter++}`;
    }
    return id;
}
function mapConstructionTypeToProjectType(constructionType) {
    const map = {
        residential: "residential",
        villa: "residential",
        apartment: "residential",
        commercial: "commercial",
        office: "office",
        retail: "retail",
        industrial: "commercial",
        institutional: "commercial",
    };
    return map[constructionType] || "residential";
}
export function createProjectFromOnboarding(payload) {
    let client;
    if (payload.clientId) {
        client = getClientById(payload.clientId);
        if (!client)
            throw new Error("Client not found");
    }
    else if (payload.clientName?.trim()) {
        client = createClient(payload.clientName.trim(), payload.city);
    }
    else {
        throw new Error("Client is required");
    }
    incrementClientProjectStats(client.id);
    const hasConstruction = payload.serviceTypes.includes("construction");
    const cd = payload.constructionDetails;
    const budget = hasConstruction && cd
        ? cd.estimatedConstructionBudget
        : payload.type === "commercial" || payload.type === "office"
            ? 5000000
            : 3000000;
    const projectId = generateId("proj", payload.name);
    const project = {
        id: projectId,
        name: payload.name,
        clientId: client.id,
        clientName: client.company || client.name,
        status: "concept",
        type: hasConstruction && cd ? mapConstructionTypeToProjectType(cd.constructionType) : payload.type,
        serviceTypes: payload.serviceTypes,
        constructionDetails: cd,
        location: payload.location,
        city: payload.city,
        healthScore: 90,
        progress: 0,
        budget,
        spent: 0,
        profit: Math.round(budget * 0.15),
        expectedCompletion: payload.expectedCompletion,
        startDate: payload.startDate,
        description: payload.description,
        team: payload.team.length > 0 ? payload.team : [CURRENT_USER.name],
    };
    projects = [project, ...projects];
    if (hasConstruction && cd) {
        seedConstructionMilestones(projectId, cd);
        seedConstructionBOQ(project, cd);
        seedConstructionKanban(project, cd);
        seedConstructionInsights(project, cd);
        seedConstructionActivity(project);
    }
    else {
        seedDefaultMilestones(projectId, payload);
        seedDefaultActivity(project);
    }
    return project;
}
function seedConstructionMilestones(projectId, cd) {
    const defaultMilestones = cd.milestones.length > 0
        ? cd.milestones
        : [
            { title: "Site Mobilization", targetDate: cd.siteMobilizationDate },
            { title: "Foundation Complete", targetDate: addMonths(cd.siteMobilizationDate, 2) },
            { title: "Structure Complete", targetDate: addMonths(cd.siteMobilizationDate, 6) },
            { title: "Finishing & Handover", targetDate: addMonths(cd.siteMobilizationDate, 10) },
        ];
    const newMilestones = defaultMilestones.map((m, i) => ({
        id: `ms-${projectId}-${i}`,
        projectId,
        title: m.title,
        date: m.targetDate,
        status: i === 0 ? "in_progress" : "upcoming",
    }));
    milestones = [...newMilestones, ...milestones];
}
function seedDefaultMilestones(projectId, payload) {
    milestones = [
        { id: `ms-${projectId}-0`, projectId, title: "Project Kickoff", date: payload.startDate, status: "in_progress" },
        { id: `ms-${projectId}-1`, projectId, title: "Concept Design", date: addMonths(payload.startDate, 1), status: "upcoming" },
        { id: `ms-${projectId}-2`, projectId, title: "Client Approval", date: addMonths(payload.startDate, 2), status: "upcoming" },
        ...milestones,
    ];
}
function seedConstructionBOQ(project, cd) {
    const boq = {
        id: `boq-${project.id}-civil`,
        projectId: project.id,
        projectName: project.name,
        title: `Civil & Structural — ${cd.numberOfFloors} Floor ${cd.constructionType}`,
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
        items: [
            { id: "c1", room: "Foundation", item: `${cd.foundationType.replace(/_/g, " ")} — ${cd.plotArea} sqft plot`, quantity: cd.plotArea, unit: "sqft", rate: 450, gst: 18, labour: 35, margin: 12 },
            { id: "c2", room: "Structure", item: `${cd.structuralSystem.replace(/_/g, " ")} — ${cd.builtUpArea} sqft`, quantity: cd.builtUpArea, unit: "sqft", rate: 1850, gst: 18, labour: 120, margin: 15 },
            { id: "c3", room: "Masonry", item: "Brick/block work per floor", quantity: cd.numberOfFloors, unit: "floor", rate: 280000, gst: 18, labour: 45000, margin: 12 },
            { id: "c4", room: "Finishes", item: "Basic internal finishes", quantity: cd.builtUpArea, unit: "sqft", rate: 420, gst: 18, labour: 55, margin: 15 },
        ],
    };
    boqs = [boq, ...boqs];
}
function seedConstructionKanban(project, cd) {
    const tasks = [
        { id: `kb-${project.id}-1`, projectId: project.id, title: "Obtain building plan sanction", description: cd.requiredApprovals.join(", ") || "Regulatory approvals", column: "todo", priority: "high", assignee: project.team[0] || "Project Manager" },
        { id: `kb-${project.id}-2`, projectId: project.id, title: "Site mobilization setup", description: `Machinery: ${cd.requiredMachinery.slice(0, 3).join(", ")}`, column: "todo", priority: "high", assignee: cd.contractor.name || "Contractor" },
        { id: `kb-${project.id}-3`, projectId: project.id, title: "Safety compliance audit", description: cd.safetyCompliance.slice(0, 3).join("; "), column: "todo", priority: "medium", assignee: "Site Engineer" },
        { id: `kb-${project.id}-4`, projectId: project.id, title: "Foundation excavation", description: `${cd.foundationType.replace(/_/g, " ")} work`, column: "in_progress", priority: "high", assignee: cd.contractor.company },
    ];
    kanbanTasks = [...tasks, ...kanbanTasks];
}
function seedConstructionInsights(project, cd) {
    const insight = {
        id: `insight-${project.id}-construction`,
        type: "recommendation",
        severity: "info",
        title: `Construction project initialized — ${cd.constructionMethod} method`,
        body: `Budget allocated: Material ₹${(cd.materialBudget / 100000).toFixed(1)}L, Labour ₹${(cd.labourBudget / 100000).toFixed(1)}L. Contractor ${cd.contractor.company} assigned. ${cd.requiredApprovals.length} approvals pending.`,
        projectId: project.id,
        projectName: project.name,
        actionLabel: "View Site Progress",
        actionHref: "/site-progress",
    };
    aiInsights = [insight, ...aiInsights];
}
function seedConstructionActivity(project) {
    activities = [
        {
            id: `act-${project.id}-create`,
            type: "project",
            title: "Construction project created",
            description: `${project.name} onboarded with full construction details`,
            projectId: project.id,
            projectName: project.name,
            userId: "user-1",
            userName: "Rahul Sharma",
            timestamp: new Date().toISOString(),
        },
        ...activities,
    ];
}
function seedDefaultActivity(project) {
    activities = [
        {
            id: `act-${project.id}-create`,
            type: "project",
            title: "Project created",
            description: `${project.name} onboarded successfully`,
            projectId: project.id,
            projectName: project.name,
            userId: "user-1",
            userName: "Rahul Sharma",
            timestamp: new Date().toISOString(),
        },
        ...activities,
    ];
}
function addMonths(dateStr, months) {
    const d = new Date(dateStr);
    d.setMonth(d.getMonth() + months);
    return d.toISOString().split("T")[0];
}
export { boqs, kanbanTasks, aiInsights, activities, milestones, risks };
