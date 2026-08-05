import { ensureMaterialStoreLoaded } from "@/lib/materials/material-loader.server";
import { getAllMasterMaterials } from "@/lib/store/material-store";
import { createMaterialCatalog } from "@/lib/boq/material-mapping";
import { project_info } from "@/constants";

export async function getServerMaterialCatalog() {
    await ensureMaterialStoreLoaded();
    return createMaterialCatalog(getAllMasterMaterials());
}

export async function getProjectMaterials(projectId) {
    const project = project_info.find((item) => String(item.id) === String(projectId));
    if (project?.materials?.length) {
        return project.materials.map((material) => ({ ...material }));
    }

    await ensureMaterialStoreLoaded();
    return getAllMasterMaterials().filter((m) => m.projectIds?.includes(projectId) || m.projectIds?.includes(String(projectId)));
}
