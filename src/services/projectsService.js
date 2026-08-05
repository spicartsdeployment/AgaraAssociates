import { getAllProjects, createProjectFromOnboarding } from "@/lib/store/project-store";
export function getProjectsSummary() {
    return getAllProjects().map((project) => ({
        id: project.id,
        name: project.name,
    }));
}
export function createProject(payload) {
    if (!payload.name?.trim()) {
        throw new Error("Project name is required");
    }
    if (!payload.clientId && !payload.clientName?.trim()) {
        throw new Error("Client is required");
    }
    if (!payload.serviceTypes?.length) {
        throw new Error("At least one service type is required");
    }
    if (payload.serviceTypes.includes("construction") && !payload.constructionDetails) {
        throw new Error("Construction details required when Construction service is selected");
    }
    return createProjectFromOnboarding(payload);
}
