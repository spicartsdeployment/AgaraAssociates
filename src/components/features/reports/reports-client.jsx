"use client";
import { memo, useMemo, useState } from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, } from "recharts";
import { PageHeader } from "@/components/templates/page-header";
import { Button } from "@/components/common/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/Card";
import { Download } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { COLORS } from "@/lib/constants";
import { toast } from "sonner";
import "@/assets/styles/components/ReportsClient.scss";

export const ReportsClient = memo(function ReportsClient({ dashboard, projects, materialCostByCategory, vendorPerformance, }) {
    const [range, setRange] = useState("6m");
    const profitTrend = useMemo(() => dashboard.revenueChart.map((r) => ({
        month: r.month,
        profit: (r.revenue - r.expenses) / 100000,
    })), [dashboard.revenueChart]);
    return (<div className="reports-client">
      <PageHeader title="Reports" description="Analytics and business intelligence">
        <div className="reports-client__header-actions">
          {["3m", "6m", "1y"].map((r) => (<Button key={r} variant={range === r ? "default" : "outline"} size="sm" onClick={() => setRange(r)}>
              {r}
            </Button>))}
          <Button variant="outline" onClick={() => toast.success("Report exported", { description: `${range} analytics saved as PDF` })}><Download className="reports-client__export-icon"/> Export</Button>
        </div>
      </PageHeader>

      <Tabs defaultValue="revenue">
        <TabsList>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="materials">Material Costs</TabsTrigger>
          <TabsTrigger value="vendors">Vendor Performance</TabsTrigger>
          <TabsTrigger value="profit">Profit Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="reports-client__tab-content">
          <Card>
            <CardHeader><CardTitle>Revenue vs Expenses</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={dashboard.revenueChart}>
                  <CartesianGrid strokeDasharray="3 3"/>
                  <XAxis dataKey="month"/>
                  <YAxis tickFormatter={(v) => `₹${v / 100000}L`}/>
                  <Tooltip formatter={(v) => formatCurrency(Number(v ?? 0))}/>
                  <Legend />
                  <Area type="monotone" dataKey="revenue" stroke={COLORS.accent} fill={COLORS.accent} fillOpacity={0.1}/>
                  <Area type="monotone" dataKey="expenses" stroke={COLORS.danger} fill={COLORS.danger} fillOpacity={0.1}/>
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="reports-client__tab-content">
          <div className="reports-client__projects-grid">
            {projects.map((p) => (<Card key={p.id}>
                <CardContent className="reports-client__project-card-content">
                  <p className="reports-client__project-name">{p.name}</p>
                  <div className="reports-client__project-stats">
                    <div><p className="reports-client__stat-label">Budget</p><p className="reports-client__stat-value">{formatCurrency(p.budget)}</p></div>
                    <div><p className="reports-client__stat-label">Profit</p><p className="reports-client__stat-value reports-client__stat-value--success">{formatCurrency(p.profit)}</p></div>
                  </div>
                </CardContent>
              </Card>))}
          </div>
        </TabsContent>

        <TabsContent value="materials" className="reports-client__tab-content">
          <Card>
            <CardContent className="reports-client__chart-content">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={materialCostByCategory}>
                  <CartesianGrid strokeDasharray="3 3"/>
                  <XAxis dataKey="category"/>
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="cost" fill={COLORS.info} radius={[4, 4, 0, 0]}/>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vendors" className="reports-client__tab-content">
          <Card>
            <CardContent className="reports-client__chart-content">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={vendorPerformance}>
                  <CartesianGrid strokeDasharray="3 3"/>
                  <XAxis dataKey="vendor"/>
                  <YAxis yAxisId="left"/>
                  <YAxis yAxisId="right" orientation="right"/>
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="rating" fill={COLORS.accent} name="Rating" radius={[4, 4, 0, 0]}/>
                  <Bar yAxisId="right" dataKey="delivery" fill={COLORS.warning} name="Delivery Days" radius={[4, 4, 0, 0]}/>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profit" className="reports-client__tab-content">
          <Card>
            <CardContent className="reports-client__chart-content">
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={profitTrend}>
                  <CartesianGrid strokeDasharray="3 3"/>
                  <XAxis dataKey="month"/>
                  <YAxis tickFormatter={(v) => `₹${v}L`}/>
                  <Tooltip formatter={(v) => `₹${Number(v ?? 0)}L`}/>
                  <Area type="monotone" dataKey="profit" stroke={COLORS.success} fill={COLORS.success} fillOpacity={0.15}/>
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>);
});
