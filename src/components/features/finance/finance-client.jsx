"use client";
import { memo, useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, } from "recharts";
import { PageHeader } from "@/components/templates/page-header";
import { StatCard } from "@/components/cards/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { IndianRupee, TrendingDown, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { COLORS } from "@/lib/constants";
import "@/assets/styles/components/FinanceClient.scss";

const PAGE_SIZE = 10;

export const FinanceClient = memo(function FinanceClient({ projects, invoices }) {
    const [page, setPage] = useState(1);
    const totalRevenue = projects.reduce((s, p) => s + p.spent, 0);
    const totalProfit = projects.reduce((s, p) => s + p.profit, 0);
    const totalExpenses = totalRevenue - totalProfit;
    const budgetData = useMemo(() => projects.slice(0, 6).map((p) => ({
        name: p.name.split(" ")[0],
        budget: p.budget / 100000,
        spent: p.spent / 100000,
        profit: p.profit / 100000,
    })), [projects]);
    const totalPages = Math.max(1, Math.ceil(invoices.length / PAGE_SIZE));
    const pagedInvoices = invoices.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    return (<div className="finance-client">
      <PageHeader title="Finance" description="Revenue, expenses, invoices, and budget analytics"/>

      <div className="finance-client__stats">
        <StatCard title="Revenue" value={formatCurrency(totalRevenue)} icon={IndianRupee} trend={{ value: "+12% this quarter", positive: true }}/>
        <StatCard title="Expenses" value={formatCurrency(totalExpenses)} icon={TrendingDown}/>
        <StatCard title="Profit" value={formatCurrency(totalProfit)} icon={TrendingUp} trend={{ value: `${Math.round((totalProfit / totalRevenue) * 100)}% margin`, positive: true }}/>
      </div>

      <Card>
        <CardHeader><CardTitle>Budget Analytics by Project</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={budgetData}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.divider}/>
              <XAxis dataKey="name" tick={{ fontSize: 12 }}/>
              <YAxis tick={{ fontSize: 12 }} label={{ value: "₹ Lakhs", angle: -90, position: "insideLeft" }}/>
              <Tooltip formatter={(v) => `₹${Number(v ?? 0)}L`}/>
              <Legend />
              <Bar dataKey="budget" fill={COLORS.accent} radius={[4, 4, 0, 0]}/>
              <Bar dataKey="spent" fill={COLORS.info} radius={[4, 4, 0, 0]}/>
              <Bar dataKey="profit" fill={COLORS.success} radius={[4, 4, 0, 0]}/>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <section className="finance-client__section">
        <h2 className="finance-client__section-title">Invoices</h2>
        <Card>
          <CardContent className="finance-client__table-wrap">
            <table className="finance-client__table">
              <thead>
                <tr className="finance-client__thead-row">
                  <th className="finance-client__th">Project</th>
                  <th className="finance-client__th">Client</th>
                  <th className="finance-client__th">Amount</th>
                  <th className="finance-client__th">Due Date</th>
                  <th className="finance-client__th">Status</th>
                </tr>
              </thead>
              <tbody>
                {pagedInvoices.map((inv) => (<tr key={inv.id} className="finance-client__row">
                    <td className="finance-client__td finance-client__td--bold">{inv.projectName}</td>
                    <td className="finance-client__td">{inv.clientName}</td>
                    <td className="finance-client__td">{formatCurrency(inv.amount)}</td>
                    <td className="finance-client__td">{inv.dueDate}</td>
                    <td className="finance-client__td">
                      <Badge variant={inv.status === "paid" ? "success" : inv.status === "overdue" ? "destructive" : "warning"}>
                        {inv.status}
                      </Badge>
                    </td>
                  </tr>))}
              </tbody>
            </table>
          </CardContent>
        </Card>
        {totalPages > 1 && (<div className="finance-client__pagination">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
            <span className="finance-client__pagination-text">Page {page} of {totalPages}</span>
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
          </div>)}
      </section>

      <Card>
        <CardHeader><CardTitle>Pending Collections</CardTitle></CardHeader>
        <CardContent>
          <p className="finance-client__pending-value">{formatCurrency(invoices.filter((i) => i.status !== "paid").reduce((s, i) => s + i.amount, 0))}</p>
          <p className="finance-client__pending-meta">{invoices.filter((i) => i.status === "overdue").length} overdue invoices</p>
        </CardContent>
      </Card>
    </div>);
});
