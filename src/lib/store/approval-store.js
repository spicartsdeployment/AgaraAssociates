const seedApprovals = [
    {
        id: "appr-1",
        title: "Approve master bedroom layout v2.4",
        description: "Drawing approval pending from client before contractor release.",
        projectId: "proj-skyline-villa",
        projectName: "Skyline Villa",
        clientName: "Mehta Family Trust",
        type: "drawing",
        status: "pending",
        priority: "high",
        dueDate: "2026-07-01",
        href: "/app/projects/proj-skyline-villa",
    },
    {
        id: "appr-2",
        title: "Sign off MEP submission package",
        description: "Consultant stamp and PMC checklist incomplete.",
        projectId: "proj-emerald-retail",
        projectName: "Emerald Retail Flagship",
        clientName: "Patel Retail Chain",
        type: "drawing",
        status: "pending",
        priority: "high",
        dueDate: "2026-07-02",
        href: "/app/projects/proj-emerald-retail",
    },
    {
        id: "appr-3",
        title: "Kitchen renovation quote v2",
        description: "Client review of Hafele hardware upgrade pricing.",
        projectId: "proj-mehta-kitchen",
        projectName: "Mehta Kitchen Renovation",
        clientName: "Mehta Family Trust",
        type: "quotation",
        status: "pending",
        priority: "medium",
        dueDate: "2026-07-05",
        href: "/quotations/quote-mehta-kitchen",
    },
    {
        id: "appr-4",
        title: "Milestone 3 payment release",
        description: "₹8.5L invoice approval for Emerald Retail fit-out phase.",
        projectId: "proj-emerald-retail",
        projectName: "Emerald Retail Flagship",
        clientName: "Patel Retail Chain",
        type: "payment",
        status: "pending",
        priority: "high",
        dueDate: "2026-07-03",
        href: "/app/projects/proj-emerald-retail",
    },
    {
        id: "appr-5",
        title: "Ground floor plan v2.3",
        description: "Client approved ground floor layout.",
        projectId: "proj-skyline-villa",
        projectName: "Skyline Villa",
        clientName: "Mehta Family Trust",
        type: "drawing",
        status: "approved",
        priority: "low",
        dueDate: "2026-06-28",
        href: "/app/projects/proj-skyline-villa",
    },
];
let approvals = [...seedApprovals];
export function getAllApprovals() {
    return approvals;
}
export function getPendingApprovals() {
    return approvals.filter((a) => a.status === "pending");
}
export function getApprovalsByProjectId(projectId) {
    return approvals.filter((a) => a.projectId === projectId);
}
export function updateApprovalStatus(id, status) {
    approvals = approvals.map((a) => (a.id === id ? { ...a, status } : a));
    return approvals.find((a) => a.id === id);
}
