import { getBoqByIdFromStore } from "@/lib/store/project-store";
export function getBoqById(id) {
    return getBoqByIdFromStore(id);
}
