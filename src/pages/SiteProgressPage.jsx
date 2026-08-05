import { kanbanTasks as storeKanbanTasks } from "@/lib/store/project-store";
import { PageHeader } from "@/components/templates/page-header";
import { KanbanBoard } from "@/components/organisms/kanban-board";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HardHat } from "lucide-react";
import "@/assets/styles/pages/SiteProgressPage.scss";

const sitePhotos = [
    { id: "1", caption: "Living room marble installation", date: "2026-06-29" },
    { id: "2", caption: "Kitchen modular fitting progress", date: "2026-06-28" },
    { id: "3", caption: "Master bath tile work", date: "2026-06-27" },
    { id: "4", caption: "Electrical conduit routing", date: "2026-06-25" },
];
const dailyLogs = [
    { date: "2026-06-30", workers: 12, summary: "Marble polishing in master bedroom. 60% complete." },
    { date: "2026-06-29", workers: 14, summary: "Kitchen cabinet installation started. Plumbing checked." },
    { date: "2026-06-28", workers: 10, summary: "False ceiling work in living room. Electrical rough-in." },
];
const issues = [
    { id: "1", title: "Marble delivery delay", priority: "high", status: "open" },
    { id: "2", title: "Electrical point relocation", priority: "medium", status: "in_progress" },
    { id: "3", title: "Paint shade mismatch", priority: "low", status: "resolved" },
];
export function SiteProgressPage() {
    return (<div className="site-progress-page">
      <PageHeader title="Site Progress" description="Track execution, inspections, and daily site activity"/>

      <Card className="site-progress-page__callout">
        <CardContent className="site-progress-page__callout-content">
          <HardHat className="site-progress-page__callout-icon"/>
          <p className="site-progress-page__callout-text"><strong>Site Summary:</strong> Progress on track overall. Recurring issue: material delivery delays (3 instances this month). Consider buffer stock for critical items.</p>
        </CardContent>
      </Card>

      <Tabs defaultValue="kanban">
        <TabsList>
          <TabsTrigger value="kanban">Kanban</TabsTrigger>
          <TabsTrigger value="photos">Site Photos</TabsTrigger>
          <TabsTrigger value="logs">Daily Logs</TabsTrigger>
          <TabsTrigger value="issues">Issue Tracker</TabsTrigger>
        </TabsList>

        <TabsContent value="kanban" className="site-progress-page__tab-content">
          <KanbanBoard tasks={storeKanbanTasks}/>
        </TabsContent>

        <TabsContent value="photos" className="site-progress-page__tab-content">
          <div className="site-progress-page__photo-grid">
            {sitePhotos.map((photo) => (<Card key={photo.id} className="site-progress-page__photo-card">
                <div className="site-progress-page__photo-placeholder"/>
                <CardContent className="site-progress-page__photo-content">
                  <p className="site-progress-page__photo-caption">{photo.caption}</p>
                  <p className="site-progress-page__photo-date">{photo.date}</p>
                </CardContent>
              </Card>))}
          </div>
        </TabsContent>

        <TabsContent value="logs" className="site-progress-page__tab-content site-progress-page__tab-content--stack">
          {dailyLogs.map((log) => (<Card key={log.date}>
              <CardContent className="site-progress-page__log-content">
                <div className="site-progress-page__log-date">
                  <p className="site-progress-page__log-day">{log.date.split("-")[2]}</p>
                  <p className="site-progress-page__log-month">Jun</p>
                </div>
                <div>
                  <p className="site-progress-page__log-summary">{log.summary}</p>
                  <p className="site-progress-page__log-workers">{log.workers} workers on site</p>
                </div>
              </CardContent>
            </Card>))}
        </TabsContent>

        <TabsContent value="issues" className="site-progress-page__tab-content site-progress-page__tab-content--stack">
          {issues.map((issue) => (<Card key={issue.id}>
              <CardContent className="site-progress-page__issue-content">
                <p className="site-progress-page__issue-title">{issue.title}</p>
                <div className="site-progress-page__issue-badges">
                  <Badge variant={issue.priority === "high" ? "destructive" : issue.priority === "medium" ? "warning" : "outline"}>
                    {issue.priority}
                  </Badge>
                  <Badge variant="outline">{issue.status}</Badge>
                </div>
              </CardContent>
            </Card>))}
        </TabsContent>
      </Tabs>

      <div className="site-progress-page__stats-grid">
        <Card>
          <CardHeader><CardTitle className="site-progress-page__stat-title">Labour Attendance</CardTitle></CardHeader>
          <CardContent><p className="site-progress-page__stat-value">12/14</p><p className="site-progress-page__stat-label">Present today</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="site-progress-page__stat-title">Material Consumption</CardTitle></CardHeader>
          <CardContent><p className="site-progress-page__stat-value">₹1.2L</p><p className="site-progress-page__stat-label">This week</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="site-progress-page__stat-title">Inspection Reports</CardTitle></CardHeader>
          <CardContent><p className="site-progress-page__stat-value">3</p><p className="site-progress-page__stat-label">Pending review</p></CardContent>
        </Card>
      </div>
    </div>);
}
