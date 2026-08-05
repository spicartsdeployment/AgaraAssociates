import { clients as seedClients } from "@/lib/mock/clients-seed";
let clients = [...seedClients];
function slugify(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
function generateClientId(name) {
    const base = `client-${slugify(name)}`;
    let id = base;
    let counter = 1;
    while (clients.some((c) => c.id === id)) {
        id = `${base}-${counter++}`;
    }
    return id;
}
export function getAllClients() {
    return clients;
}
export function getClientById(id) {
    return clients.find((c) => c.id === id);
}
export function createClient(name, city = "") {
    const trimmed = name.trim();
    const existing = clients.find((c) => c.name.toLowerCase() === trimmed.toLowerCase());
    if (existing)
        return existing;
    const client = {
        id: generateClientId(trimmed),
        name: trimmed,
        email: "",
        phone: "",
        city,
        type: "Residential",
        projectCount: 0,
        activeProjects: 0,
        totalRevenue: 0,
        lastContact: new Date().toISOString().split("T")[0],
    };
    clients = [client, ...clients];
    return client;
}
export function incrementClientProjectStats(clientId) {
    clients = clients.map((c) => c.id === clientId
        ? {
            ...c,
            projectCount: c.projectCount + 1,
            activeProjects: c.activeProjects + 1,
            lastContact: new Date().toISOString().split("T")[0],
        }
        : c);
}
