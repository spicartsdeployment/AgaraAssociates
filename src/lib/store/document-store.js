import { getAllDrawings } from "@/lib/store/drawing-store";
import { invoices } from "@/lib/mock/data-seed";
import { getAllProjects } from "@/lib/store/project-store";
const seedDocuments = [
    { id: "doc-1", projectId: "proj-skyline-villa", projectName: "Skyline Villa", name: "Interior Contract — Mehta Family", type: "contract", size: "2.4 MB", updatedAt: "2026-06-01", uploadedBy: "Adarsh P" },
    { id: "doc-2", projectId: "proj-skyline-villa", projectName: "Skyline Villa", name: "PMC Submission Checklist", type: "report", size: "890 KB", updatedAt: "2026-06-18", uploadedBy: "Amit Joshi" },
    { id: "doc-3", projectId: "proj-emerald-retail", projectName: "Emerald Retail", name: "MEP Consultant Report", type: "report", size: "4.1 MB", updatedAt: "2026-06-27", uploadedBy: "Priya Nair" },
    { id: "doc-4", projectId: "proj-aurora-office", projectName: "Aurora Tech Office", name: "Space Planning Specification", type: "specification", size: "1.2 MB", updatedAt: "2026-06-22", uploadedBy: "Adarsh P" },
    { id: "doc-5", projectId: "proj-lakeside-residence", projectName: "Lakeside Residence", name: "Structural Drawing Set", type: "drawing", size: "12.8 MB", updatedAt: "2026-06-28", uploadedBy: "Amit Joshi" },
];
let documents = [...seedDocuments];
function syncDrawingDocuments() {
    const drawingDocs = getAllDrawings().map((d) => {
        const project = getAllProjects().find((p) => p.id === d.projectId);
        return {
            id: `doc-drw-${d.id}`,
            projectId: d.projectId,
            projectName: project?.name ?? d.projectId,
            name: d.name,
            type: "drawing",
            size: "—",
            updatedAt: d.updatedAt,
            uploadedBy: "Design Team",
        };
    });
    const invoiceDocs = invoices.map((inv) => ({
        id: `doc-inv-${inv.id}`,
        projectId: inv.projectId,
        projectName: inv.projectName,
        name: `Invoice ${inv.id.toUpperCase()}`,
        type: "invoice",
        size: "—",
        updatedAt: inv.issuedDate,
        uploadedBy: "Finance",
    }));
    const ids = new Set(documents.map((d) => d.id));
    [...drawingDocs, ...invoiceDocs].forEach((doc) => {
        if (!ids.has(doc.id))
            documents.push(doc);
    });
}
syncDrawingDocuments();
export function getAllDocuments() {
    return documents;
}
export function getDocumentsByProjectId(projectId) {
    return documents.filter((d) => d.projectId === projectId);
}
export function addDocument(doc) {
    const newDoc = { ...doc, id: `doc-${Date.now()}` };
    documents = [newDoc, ...documents];
    return newDoc;
}
