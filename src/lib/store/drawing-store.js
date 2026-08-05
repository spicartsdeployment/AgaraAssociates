import { drawings as seedDrawings } from "@/lib/mock/data-seed";
import { getProjectByIdFromStore } from "@/lib/store/project-store";
let drawings = [...seedDrawings];
export function getAllDrawings() {
    return drawings;
}
export function getDrawingById(id) {
    return drawings.find((d) => d.id === id);
}
export function getDrawingsByProjectId(projectId) {
    return drawings.filter((d) => d.projectId === projectId);
}
export function getDrawingsByProjectIds(projectIds) {
    return drawings.filter((d) => projectIds.includes(d.projectId));
}
export function addDrawing(input) {
    const project = getProjectByIdFromStore(input.projectId);
    const drawing = {
        id: `drw-${Date.now()}`,
        projectId: input.projectId,
        name: input.name,
        type: input.type,
        version: "v1.0",
        status: "draft",
        updatedAt: new Date().toISOString().split("T")[0],
        thumbnail: input.type === "3d_render"
            ? "/images/drawing-render.svg"
            : input.type === "mood_board"
                ? "/images/drawing-mood.svg"
                : input.type === "cad"
                    ? "/images/drawing-cad.svg"
                    : "/images/drawing-floor.svg",
    };
    drawings = [drawing, ...drawings];
    void project;
    return drawing;
}
