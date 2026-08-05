import { tasks as seedTasks } from "@/lib/mock/activities";
import { CURRENT_USER } from "@/lib/constants";
const seedTeam = [
    { id: "user-1", name: "Adarsh P", role: "Principal Architect", email: "adarsh@agaraassociates.com", avatar: "/adarsh-profile.png", active: true },
    { id: "user-2", name: "Priya Nair", role: "Interior Designer", email: "priya@agaraassociates.com", active: true },
    { id: "user-3", name: "Amit Joshi", role: "Project Manager", email: "amit@agaraassociates.com", active: true },
    { id: "user-4", name: "Sneha Iyer", role: "3D Visualizer", email: "sneha@agaraassociates.com", active: true },
];
let teamMembers = [...seedTeam];
let tasks = [...seedTasks];
export function getTeamMembers() {
    return teamMembers;
}
export function getAllTasks() {
    return tasks;
}
export function getTasksByProjectId(projectId) {
    return tasks.filter((t) => t.projectId === projectId);
}
export function toggleTaskCompleted(id) {
    tasks = tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
    return tasks.find((t) => t.id === id);
}
export function addTeamMember(name, role, email) {
    const member = {
        id: `user-${Date.now()}`,
        name,
        role,
        email,
        active: true,
    };
    teamMembers = [...teamMembers, member];
    return member;
}
export function getStudioSettings() {
    return {
        studioName: "Agara Associates",
        email: CURRENT_USER.email,
        phone: "+91 98200 45678",
    };
}
let studioSettings = getStudioSettings();
export function updateStudioSettings(patch) {
    studioSettings = { ...studioSettings, ...patch };
    return studioSettings;
}
export function getStudioSettingsSnapshot() {
    return { ...studioSettings };
}
