import { useEffect, useMemo, useState } from "react";
import { getDashboardData } from "@/lib/mock/dashboard";
import { vendorQuotes } from "@/lib/mock/data";
import { getAllProjects } from "@/lib/store/project-store";
import { getLegacyMaterials } from "@/lib/materials/legacy-materials.server";
import { ReportsClient } from "@/components/features/reports/reports-client";
import "@/assets/styles/pages/ReportsPage.scss";

export function ReportsPage() {
    const dashboard = getDashboardData();
    const projects = getAllProjects();
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        getLegacyMaterials()
            .then(setMaterials)
            .finally(() => setLoading(false));
    }, []);
    const materialCostByCategory = useMemo(() => ["tiles", "wood", "paint", "electrical", "lighting", "furniture"].map((category) => ({
        category: category.charAt(0).toUpperCase() + category.slice(1),
        cost: materials.filter((material) => material.category === category).reduce((sum, material) => sum + material.currentPrice * 10, 0) /
            1000,
    })), [materials]);
    const vendorPerformance = useMemo(() => [...new Map(vendorQuotes.map((quote) => [quote.vendor, quote])).values()].map((quote) => ({
        vendor: quote.vendor.split(" ")[0],
        rating: quote.rating,
        delivery: quote.deliveryDays,
    })), []);
    if (loading) {
        return <div className="reports-page__loading">Loading reports...</div>;
    }
    return (<ReportsClient dashboard={dashboard} projects={projects} materialCostByCategory={materialCostByCategory} vendorPerformance={vendorPerformance}/>);
}
