import { getDashboardData } from "@/lib/mock/dashboard";
import { DashboardClient } from "@/components/features/dashboard/dashboard-client";
export function DashboardPage() {
    const data = getDashboardData();
    return <DashboardClient data={data}/>;
}
