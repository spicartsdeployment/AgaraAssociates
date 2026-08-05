"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DEFAULT_MATERIAL_FILTERS } from "@/lib/materials/default-filters";
import { getMaterialMeta, getMaterialsPage, toggleMaterialFavoriteRecord, } from "@/services/materialsService";
export function useMaterialMeta() {
    const [meta, setMeta] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const data = await getMaterialMeta();
                if (!cancelled)
                    setMeta(data);
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
    return { meta, loading };
}
export function useMaterialsPage(filters, page, limit = 50) {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const filterKey = useMemo(() => JSON.stringify({ filters, page, limit }), [filters, page, limit]);
    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);
        (async () => {
            try {
                const data = await getMaterialsPage(filters, page, limit);
                if (!cancelled) {
                    setResult({ materials: data.materials, meta: data.meta });
                }
            }
            catch (e) {
                if (!cancelled)
                    setError(e instanceof Error ? e.message : "Failed to load materials");
            }
            finally {
                if (!cancelled)
                    setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [filterKey, filters, page, limit]);
    const toggleFavorite = useCallback(async (id) => {
        const updated = await toggleMaterialFavoriteRecord(id);
        if (!updated)
            return;
        setResult((prev) => prev
            ? {
                ...prev,
                materials: prev.materials.map((material) => (material.id === id ? updated : material)),
            }
            : prev);
    }, []);
    return { result, loading, error, toggleFavorite };
}
export { DEFAULT_MATERIAL_FILTERS };
