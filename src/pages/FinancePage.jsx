import { invoices } from "@/lib/mock/data";
import { getAllProjects } from "@/lib/store/project-store";
import { FinanceClient } from "@/components/features/finance/finance-client";
export function FinancePage() {
    const projects = getAllProjects();
    return <FinanceClient projects={projects} invoices={invoices}/>;
}
