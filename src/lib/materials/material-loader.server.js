let loadPromise = null;
export async function loadMaterialLibrarySeed() {
    if (!loadPromise) {
        loadPromise = import("@/lib/mock/material-library-data").then(({ materialLibrarySeed }) => materialLibrarySeed.map((m) => ({ ...m })));
    }
    return loadPromise;
}
export async function ensureMaterialStoreLoaded() {
    const { initializeMaterialStore, isMaterialStoreInitialized } = await import("@/lib/store/material-store");
    if (isMaterialStoreInitialized())
        return;
    const seed = await loadMaterialLibrarySeed();
    initializeMaterialStore(seed);
}
