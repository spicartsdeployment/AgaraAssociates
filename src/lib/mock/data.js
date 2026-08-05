export { kanbanTasks, purchaseOrders, vendorQuotes, invoices, communications, } from "@/lib/mock/data-seed";
export { boqs } from "@/lib/store/project-store";
export { getAllQuotations, getQuotationById } from "@/lib/store/quotation-store";
export { getAllDrawings, getDrawingsByProjectId } from "@/lib/store/drawing-store";
import { boqs } from "@/lib/store/project-store";
import { getBoqByIdFromStore } from "@/lib/store/project-store";
export function getBOQById(id) {
    return getBoqByIdFromStore(id) ?? boqs.find((b) => b.id === id);
}
