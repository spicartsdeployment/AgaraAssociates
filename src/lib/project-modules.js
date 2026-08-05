import { purchaseOrders, invoices, communications } from "@/lib/mock/data-seed";
import { getDocumentsByProjectId } from "@/lib/store/document-store";
import { getApprovalsByProjectId } from "@/lib/store/approval-store";
import { activities } from "@/lib/store/project-store";
import { sitePhotosSeed } from "@/lib/mock/site-photos";
export { getProjectMaterials } from "@/lib/project-modules.server";
export function getProjectPurchaseOrders(projectId) {
    return purchaseOrders.filter((po) => po.projectId === projectId);
}
export function getProjectInvoices(projectId) {
    return invoices.filter((inv) => inv.projectId === projectId);
}
export function getProjectDocuments(projectId) {
    return getDocumentsByProjectId(projectId);
}
export function getProjectApprovals(projectId) {
    return getApprovalsByProjectId(projectId);
}
export function getProjectActivities(projectId) {
    return activities.filter((a) => a.projectId === projectId);
}
export function getProjectSitePhotos(projectId) {
    return sitePhotosSeed.filter((p) => p.projectId === projectId);
}
export function getCommunicationsForClient(clientId) {
    return communications.filter((c) => c.clientId === clientId);
}
