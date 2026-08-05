"use client";
import { useEffect, useState } from "react";
import { createMaterialCatalog } from "@/lib/boq/material-mapping";
import { getCompactMaterials } from "@/services/materialsService";
export function useMaterialCatalog() {
    const [catalog, setCatalog] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const materials = await getCompactMaterials();
                if (!cancelled) {
                    setCatalog(createMaterialCatalog(materials));
                }
            }
            finally {
                if (!cancelled)
                    setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);
    return { catalog, loading };
}
