import { apiGet } from "./client";
export const getDashboard = () => apiGet("/api/dashboard");
export const getProjects = () => apiGet("/api/projects");
export const getClients = () => apiGet("/api/clients");
export async function createProject(payload) {
    const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok)
        throw new Error(json.error || "Failed to create project");
    return json.data;
}
