import { quotations as seedQuotations } from "@/lib/mock/data-seed";
let quotations = [...seedQuotations];
export function getAllQuotations() {
    return quotations;
}
export function getQuotationById(id) {
    return quotations.find((q) => q.id === id);
}
export function getQuotationsByProjectId(projectId) {
    return quotations.filter((q) => q.projectId === projectId);
}
export function getQuotationsByClientId(clientId) {
    return quotations.filter((q) => q.clientId === clientId);
}
export function createQuotation(input, meta) {
    const amount = input.items.reduce((s, i) => s + i.amount, 0);
    const id = `quote-${Date.now()}`;
    const quotation = {
        id,
        projectId: input.projectId,
        projectName: meta.projectName,
        clientId: meta.clientId,
        clientName: meta.clientName,
        title: input.title,
        status: "draft",
        amount,
        validUntil: input.validUntil,
        versions: [{ version: 1, amount, createdAt: new Date().toISOString().split("T")[0], changes: "Initial draft" }],
        items: input.items,
    };
    quotations = [quotation, ...quotations];
    return quotation;
}
export function updateQuotationStatus(id, status) {
    quotations = quotations.map((q) => (q.id === id ? { ...q, status } : q));
    return getQuotationById(id);
}
