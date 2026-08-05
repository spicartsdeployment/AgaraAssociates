import { getLegacyMaterials } from "@/lib/materials/legacy-materials.server";
import { priceTrends, materialAlternatives } from "@/lib/mock/materials-meta";
/** @deprecated Prefer getLegacyMaterials() for server-side lazy loading */
export async function getMaterialsSnapshot() {
    const materials = await getLegacyMaterials();
    return { materials, priceTrends, materialAlternatives };
}
export { priceTrends, materialAlternatives };
