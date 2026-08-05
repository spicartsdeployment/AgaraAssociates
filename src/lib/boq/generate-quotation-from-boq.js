import { createQuotation } from "@/lib/store/quotation-store";
import { getProjectByIdFromStore } from "@/lib/store/project-store";
import { calculateBoqEstimate, groupEstimateByTrade } from "@/lib/boq/estimate-calculator";
export function generateQuotationFromBoq(boq, strategy = "by_trade") {
    const project = getProjectByIdFromStore(boq.projectId);
    if (!project)
        throw new Error("Project not found");
    const estimate = calculateBoqEstimate(boq.items);
    let items;
    if (strategy === "single") {
        items = [{ description: boq.title, amount: Math.round(estimate.grandTotal) }];
    }
    else if (strategy === "by_room") {
        const byRoom = {};
        boq.items.forEach((line) => {
            const room = line.room || "General";
            const lineTotal = calculateBoqEstimate([line]).grandTotal;
            byRoom[room] = (byRoom[room] ?? 0) + lineTotal;
        });
        items = Object.entries(byRoom).map(([room, amount]) => ({
            description: room,
            amount: Math.round(amount),
        }));
    }
    else {
        const byTrade = groupEstimateByTrade(boq.items);
        const tradeLabels = {
            civil_construction: "Civil & Structure",
            interior: "Interior Finishes",
            architectural: "Architectural",
            doors_windows: "Doors & Windows",
            modular_kitchen: "Kitchen & Wardrobes",
            electrical: "Electrical",
            plumbing: "Plumbing & Sanitary",
            hvac: "HVAC",
            fire_safety: "Fire Safety",
            furniture: "Furniture",
            smart_home: "Smart Home",
            landscape: "Landscape",
            miscellaneous: "Miscellaneous",
        };
        items = Object.entries(byTrade).map(([trade, amount]) => ({
            description: tradeLabels[trade] ?? trade.replace(/_/g, " "),
            amount: Math.round(amount),
        }));
    }
    const validUntil = new Date();
    validUntil.setMonth(validUntil.getMonth() + 1);
    return createQuotation({
        projectId: boq.projectId,
        title: `Estimate — ${boq.title}`,
        validUntil: validUntil.toISOString().split("T")[0],
        items,
    }, {
        projectName: project.name,
        clientId: project.clientId,
        clientName: project.clientName,
    });
}
