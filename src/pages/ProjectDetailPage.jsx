import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Calendar,
  Camera,
  CheckCircle2,
  Clock3,
  FileCheck2,
  FileSignature,
  FolderKanban,
  HardHat,
  Layers3,
  MapPin,
  MoreHorizontal,
  NotebookPen,
  Package2,
  PencilLine,
  ReceiptText,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { getProjectByIdFromStore, getMilestonesByProjectId, getBoqsByProjectId, } from "@/lib/store/project-store";
import { PageHeader } from "@/components/templates/page-header";
import { StatusChip } from "@/components/atoms/status-chip";
import { ProgressRing } from "@/components/atoms/progress-ring";
import { ConstructionDetailsPanel } from "@/components/organisms/construction-details-panel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/common/Badge";
import { SERVICE_TYPE_LABELS } from "@/lib/constants/onboarding";
import { formatCurrency } from "@/lib/utils";
import { getDrawingsByProjectId } from "@/lib/store/drawing-store";
import { getQuotationsByProjectId } from "@/lib/store/quotation-store";
import { ProjectMaterialsTab, ProjectPaymentsTab, ProjectDocumentsTab, } from "@/components/organisms/project-tab-panels";
import { ProjectProgressTracking } from "@/components/organisms/project-progress-tracking";
import "@/assets/styles/pages/ProjectDetailPage.scss";

const TAB_ITEMS = [
  "Overview", "Planning", "Requirements", "Design Files", "BOQ", "Materials", "Quotation",
  "Payments", "Progress Tracking", "Documents",
];

const MILESTONE_DOT_CLASS = {
  completed: "project-detail-page__milestone-dot--completed",
  in_progress: "project-detail-page__milestone-dot--in-progress",
  delayed: "project-detail-page__milestone-dot--delayed",
};

function formatDate(dateValue) {
  if (!dateValue) return "—";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return dateValue;
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function toTitleCase(value) {
  if (!value) return "—";
  return String(value)
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getTabValue(label) {
  return label.toLowerCase().replace(/\s+/g, "-");
}

const DEFAULT_SCHEDULE_PHASES = [
  { id: "planning", name: "Planning" },
  { id: "site-preparation", name: "Site Preparation" },
  { id: "foundation", name: "Foundation" },
  { id: "columns-plinth", name: "Columns & Plinth" },
  { id: "roof-slab", name: "Roof Slab" },
  { id: "brick-work", name: "Brick Work" },
  { id: "plumbing-electrical", name: "Plumbing & Electrical" },
  { id: "plastering", name: "Plastering" },
  { id: "flooring", name: "Flooring" },
  { id: "painting", name: "Painting" },
  { id: "fixtures-finishing", name: "Fixtures & Finishing" },
  { id: "final-handover", name: "Final Handover" },
];

function buildConstructionSchedule(project) {
  return DEFAULT_SCHEDULE_PHASES.map(({ id, name }) => ({
    id,
    name,
    plannedStartDate: "",
    plannedEndDate: "",
    status: project.status === "execution" ? "in_progress" : "planned",
  }));
}

function parseDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function calculateDuration(start, end) {
  const startDate = parseDate(start);
  const endDate = parseDate(end);
  if (!startDate || !endDate) return "—";
  const diff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
  if (diff < 0) return "Invalid";
  return diff === 1 ? "1 day" : `${diff} days`;
}

function getProjectDuration(start, end) {
  const startDate = parseDate(start);
  const endDate = parseDate(end);
  if (!startDate || !endDate) return "—";
  const months = Math.max(1, Math.round((endDate - startDate) / (1000 * 60 * 60 * 24 * 30)));
  return `${months} months`;
}

function getCurrentSchedulePhase(schedule) {
  const inProgress = schedule.find((item) => item.status === "in_progress");
  if (inProgress) return inProgress.name;
  const nextPlanned = schedule.find((item) => item.status === "planned");
  return nextPlanned ? nextPlanned.name : "Final Handover";
}

function countPhaseStatuses(schedule) {
  return schedule.reduce(
    (acc, item) => {
      if (item.status === "completed") acc.completed += 1;
      else if (item.status === "in_progress") acc.inProgress += 1;
      else acc.pending += 1;
      return acc;
    },
    { completed: 0, inProgress: 0, pending: 0 }
  );
}

export function ProjectDetailPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const project = getProjectByIdFromStore(id);
  const [projectStatus, setProjectStatus] = useState(project?.status || "concept");
  const [schedule, setSchedule] = useState(() => project ? buildConstructionSchedule(project) : []);
  const [planningNotes, setPlanningNotes] = useState("");

  if (!project)
    return <Navigate to="/app/projects" replace />;
  const projectMilestones = getMilestonesByProjectId(id);
  const projectDrawings = getDrawingsByProjectId(id);
  const projectBOQs = getBoqsByProjectId(id);
  const projectBOQ = projectBOQs[0];
  const projectQuotes = getQuotationsByProjectId(id);
  const serviceLabels = (project.serviceTypes || []).map((service) => SERVICE_TYPE_LABELS[service] || toTitleCase(service));
  const projectCode = project.projectCode || project.id?.toUpperCase() || "PRJ-001";
  const projectTypeLabel = toTitleCase(project.type || project.projectType || "Residential");
  const currentStage = project.currentStage || project.status || "planning";
  const projectProgress = Math.max(0, Math.min(100, project.progress || 0));
  const completedMilestones = projectMilestones.filter((item) => item.status === "completed").length;
  const pendingMilestones = projectMilestones.filter((item) => item.status === "upcoming" || item.status === "pending").length;
  const delayedMilestones = projectMilestones.filter((item) => item.status === "delayed").length;
  const currentPhase = projectMilestones.find((item) => item.status === "in_progress")?.title || projectMilestones[0]?.title || "Planning";
  const upcomingMilestone = projectMilestones.find((item) => item.status === "upcoming") || projectMilestones.find((item) => item.status === "pending") || projectMilestones[0];
  const hasConstruction = (project.serviceTypes || []).includes("construction");
  const hasInterior = (project.serviceTypes || []).some((service) => ["interior_design", "interior_consultancy", "renovation"].includes(service));
  const constructionDetails = project.constructionDetails;
  const estimatedBuiltUpArea = constructionDetails?.builtUpArea || 0;
  const currentBuiltUpArea = estimatedBuiltUpArea ? Math.round(estimatedBuiltUpArea * (projectProgress / 100)) : 0;
  const estimatedProjectValue = project.budget || 0;
  const advanceReceived = Math.max(0, Math.round(estimatedProjectValue * 0.3));
  const balanceAmount = Math.max(0, estimatedProjectValue - advanceReceived);
  const roomsPlanned = project.roomsPlanned || (project.type === "residential" ? 8 : 6);
  const boqStatus = projectBOQ ? "Ready" : "Pending";
  const quotationStatus = projectQuotes.length > 0 ? "Issued" : "Pending";
  const documentStats = [
    { label: "Agreement", count: 1, icon: FileSignature },
    { label: "Drawings", count: Math.max(1, projectDrawings.length), icon: Layers3 },
    { label: "Approvals", count: Math.max(1, projectMilestones.length), icon: BadgeCheck },
    { label: "Photos", count: Math.max(1, Math.min(8, projectProgress > 50 ? 5 : 3)), icon: Camera },
    { label: "Other Documents", count: Math.max(1, projectBOQs.length + projectQuotes.length), icon: FolderKanban },
  ];
  const timelineItems = [
    { label: "Project Created", detail: `Kickoff initiated for ${project.name}`, date: formatDate(project.startDate || project.createdAt), icon: Sparkles, user: project.team?.[0] || "Project Team" },
    { label: "Agreement Uploaded", detail: "Client agreement and scope packet uploaded", date: formatDate(project.startDate || project.createdAt), icon: FileSignature, user: "Admin" },
    { label: "Package Selected", detail: hasConstruction ? "Construction package aligned to site scope" : "Design package finalized", date: formatDate(project.startDate || project.createdAt), icon: Package2, user: project.clientName },
    { label: "Planning Started", detail: "Core planning and coordination activities started", date: formatDate(project.startDate || project.createdAt), icon: BriefcaseBusiness, user: project.team?.[1] || "Planner" },
    { label: "Foundation Started", detail: hasConstruction ? "Foundation and mobilization activities in progress" : "Interior planning work in progress", date: formatDate(project.expectedCompletion), icon: HardHat, user: "Site Team" },
  ];
  const scheduleRows = projectMilestones.slice(0, 5).map((milestone) => ({
    activity: milestone.title,
    plannedDate: milestone.date,
    assignedTo: project.team?.[0] || "Project Team",
    status: milestone.status,
  }));

  const projectStartDate = project.startDate || project.createdAt;
  const projectCompletionDate = project.expectedCompletion;
  const projectDuration = getProjectDuration(projectStartDate, projectCompletionDate);
  const schedulePhaseCount = schedule.length;
  const scheduleStatusCounts = countPhaseStatuses(schedule);
  const currentSchedulePhase = getCurrentSchedulePhase(schedule);

  const handleScheduleChange = (phaseId, patch) => {
    setSchedule((prev) => prev.map((item) => item.id === phaseId ? { ...item, ...patch } : item));
  };

  const handleSaveSchedule = () => {
    toast.success("Construction schedule saved", {
      description: "Your project timeline was updated successfully.",
    });
  };

  const handleStartProject = () => {
    setProjectStatus("execution");
    setSchedule((prev) => {
      const hasInProgress = prev.some((item) => item.status === "in_progress");
      if (hasInProgress) return prev;
      return prev.map((item, index) => index === 0 ? { ...item, status: "in_progress" } : item);
    });
    toast.success("Project started", {
      description: "Project status changed to Execution.",
    });
  };
  const overviewActionCards = [
    { label: "Continue Planning", icon: BriefcaseBusiness, tab: "design-files" },
    { label: "Update Progress", icon: TrendingUp, tab: "progress-tracking" },
    { label: "View BOQ", icon: ReceiptText, tab: "boq" },
    { label: "View Materials", icon: Package2, tab: "materials" },
    { label: "View Payments", icon: ReceiptText, tab: "payments" },
    { label: "Upload Documents", icon: FileCheck2, tab: "documents" },
    { label: "Add Project Note", icon: NotebookPen, tab: "overview" },
  ];

  return (
    <div className="project-detail-page">
      <Link to="/app/projects" className="project-detail-page__back-link">
        <ArrowLeft /> Back to Projects
      </Link>

      <PageHeader title={project.name} description={project.description}>
        <StatusChip status={projectStatus} />
      </PageHeader>

      <div className="project-detail-page__meta-row">
        <span><MapPin />{project.location}, {project.city}</span>
        <span><Calendar />Due {project.expectedCompletion}</span>
        <span>{project.clientName}</span>
      </div>


      {project.constructionDetails && <ConstructionDetailsPanel details={project.constructionDetails} />}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="project-detail-page__tabs-list">
          {TAB_ITEMS.map((tab) => (
            <TabsTrigger key={tab} value={getTabValue(tab)} className="project-detail-page__tab-trigger">
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="project-detail-page__tab-panel project-detail-page__tab-panel--stack">




          <section className="project-detail-page__section project-detail-page__section--split">
            <Card className="project-detail-page__summary-card">
              <div className="project-detail-page__section-heading">
                <div>
                  <p className="project-detail-page__section-kicker">Finance</p>
                  <h3 className="project-detail-page__section-title">Financial Snapshot</h3>
                </div>
                <Button variant="outline" size="sm" onClick={() => setActiveTab("payments")}>View Payments</Button>
              </div>
              <div className="project-detail-page__metric-grid">
                <div className="project-detail-page__metric-card">
                  <span className="project-detail-page__metric-label">Estimated Cost</span>
                  <strong>{formatCurrency(project.budget)}</strong>
                </div>
                <div className="project-detail-page__metric-card">
                  <span className="project-detail-page__metric-label">Amount Received</span>
                  <strong>{formatCurrency(project.spent)}</strong>
                </div>
                <div className="project-detail-page__metric-card">
                  <span className="project-detail-page__metric-label">Pending Amount</span>
                  <strong>{formatCurrency(Math.max(0, project.budget - project.spent))}</strong>
                </div>
                <div className="project-detail-page__metric-card">
                  <span className="project-detail-page__metric-label">Total Payments</span>
                  <strong>{projectQuotes.length + 1}</strong>
                </div>
              </div>
            </Card>

            <Card className="project-detail-page__summary-card project-detail-page__summary-card--accent">
              <div className="project-detail-page__section-heading">
                <div>
                  <p className="project-detail-page__section-kicker">Delivery Pulse</p>
                  <h3 className="project-detail-page__section-title">Progress Summary</h3>
                </div>
                <Button variant="outline" size="sm" onClick={() => setActiveTab("progress-tracking")}>View Progress Tracking</Button>
              </div>
              <div className="project-detail-page__progress-summary-grid">
                <div className="project-detail-page__progress-pill"><span>Current Phase</span><strong>{currentPhase}</strong></div>
                <div className="project-detail-page__progress-pill"><span>Upcoming Milestone</span><strong>{upcomingMilestone?.title || "—"}</strong></div>
                <div className="project-detail-page__progress-pill"><span>Completed Activities</span><strong>{completedMilestones}</strong></div>
                <div className="project-detail-page__progress-pill"><span>Pending Activities</span><strong>{pendingMilestones}</strong></div>
                <div className="project-detail-page__progress-pill"><span>Delayed Activities</span><strong>{delayedMilestones}</strong></div>
              </div>
            </Card>
          </section>






        </TabsContent>

        <TabsContent value="planning" className="project-detail-page__tab-panel project-detail-page__tab-panel--stack">
          <section className="project-detail-page__section project-detail-page__section--split">
            <Card className="project-detail-page__timeline-card">
              <div className="project-detail-page__section-heading">
                <div>
                  <p className="project-detail-page__section-kicker">Project Timeline</p>
                  <h3 className="project-detail-page__section-title">Construction Project Schedule</h3>
                </div>
              </div>
              <div className="project-detail-page__timeline-grid">
                <div className="project-detail-page__timeline-metric">
                  <span>Project Start Date</span>
                  <strong>{formatDate(projectStartDate)}</strong>
                </div>
                <div className="project-detail-page__timeline-metric">
                  <span>Expected Completion</span>
                  <strong>{formatDate(projectCompletionDate)}</strong>
                </div>
                <div className="project-detail-page__timeline-metric">
                  <span>Total Duration</span>
                  <strong>{projectDuration}</strong>
                </div>
                <div className="project-detail-page__timeline-metric">
                  <span>Current Phase</span>
                  <strong>{currentSchedulePhase}</strong>
                </div>
                <div className="project-detail-page__timeline-metric">
                  <span>Project Status</span>
                  <strong>{toTitleCase(projectStatus)}</strong>
                </div>
              </div>
            </Card>

            <Card className="project-detail-page__summary-card project-detail-page__schedule-summary-card">
              <div className="project-detail-page__section-heading">
                <div>
                  <p className="project-detail-page__section-kicker">Schedule Summary</p>
                  <h3 className="project-detail-page__section-title">Phase KPIs</h3>
                </div>
              </div>
              <div className="project-detail-page__schedule-kpi-grid">
                <div className="project-detail-page__schedule-kpi-card">
                  <span>Total Phases</span>
                  <strong>{schedulePhaseCount}</strong>
                </div>
                <div className="project-detail-page__schedule-kpi-card">
                  <span>Completed Phases</span>
                  <strong>{scheduleStatusCounts.completed}</strong>
                </div>
                <div className="project-detail-page__schedule-kpi-card">
                  <span>In Progress Phases</span>
                  <strong>{scheduleStatusCounts.inProgress}</strong>
                </div>
                <div className="project-detail-page__schedule-kpi-card">
                  <span>Pending Phases</span>
                  <strong>{scheduleStatusCounts.pending}</strong>
                </div>
              </div>
            </Card>
          </section>

          <section className="project-detail-page__section">
            <Card className="project-detail-page__schedule-card">
              <div className="project-detail-page__section-heading">
                <div>
                  <p className="project-detail-page__section-kicker">Construction Schedule</p>
                  <h3 className="project-detail-page__section-title">Phase timeline</h3>
                </div>
              </div>
              <div className="project-detail-page__table-wrap">
                <table className="project-detail-page__schedule-table">
                  <thead>
                    <tr>
                      <th>Phase Name</th>
                      <th>Planned Start</th>
                      <th>Planned End</th>
                      <th>Duration</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedule.map((item) => (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>
                          <input
                            type="date"
                            value={item.plannedStartDate}
                            onChange={(e) => handleScheduleChange(item.id, { plannedStartDate: e.target.value })}
                            className="project-detail-page__schedule-input"
                          />
                        </td>
                        <td>
                          <input
                            type="date"
                            value={item.plannedEndDate}
                            onChange={(e) => handleScheduleChange(item.id, { plannedEndDate: e.target.value })}
                            className="project-detail-page__schedule-input"
                          />
                        </td>
                        <td>{calculateDuration(item.plannedStartDate, item.plannedEndDate)}</td>
                        <td>
                          <select
                            value={item.status}
                            onChange={(e) => handleScheduleChange(item.id, { status: e.target.value })}
                            className="project-detail-page__schedule-select"
                          >
                            <option value="planned">Planned</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </section>

          <section className="project-detail-page__section project-detail-page__section--split">
            <Card className="project-detail-page__summary-card">
              <div className="project-detail-page__section-heading">
                <div>
                  <p className="project-detail-page__section-kicker">Planning Notes</p>
                  <h3 className="project-detail-page__section-title">Project planning notes</h3>
                </div>
              </div>
              <textarea
                value={planningNotes}
                onChange={(e) => setPlanningNotes(e.target.value)}
                placeholder="Add planning notes for the project schedule..."
                className="project-detail-page__planning-notes"
                rows={8}
              />
            </Card>

            <Card className="project-detail-page__summary-card project-detail-page__actions-card">
              <div className="project-detail-page__section-heading">
                <div>
                  <p className="project-detail-page__section-kicker">Actions</p>
                  <h3 className="project-detail-page__section-title">Manage schedule</h3>
                </div>
              </div>
              <div className="project-detail-page__action-buttons">
                <Button variant="default" onClick={handleSaveSchedule}>Save Schedule</Button>
                <Button variant="secondary" onClick={handleStartProject}>Start Project</Button>
              </div>
              <p className="project-detail-page__action-help">Starting project will change status to Execution and enable progress tracking updates.</p>
            </Card>
          </section>
        </TabsContent>

        <TabsContent value="requirements" className="project-detail-page__tab-panel project-detail-page__tab-panel--stack">
          <section className="project-detail-page__section project-detail-page__section--split">
            <Card className="project-detail-page__summary-card">
              <div className="project-detail-page__section-heading">
                <div>
                  <p className="project-detail-page__section-kicker">Project Requirements</p>
                  <h3 className="project-detail-page__section-title">Requirements Overview</h3>
                </div>
              </div>
              <p className="project-detail-page__empty-text">
                {project.description || "The project requirements are captured from the client brief and scope documents."}
              </p>
            </Card>

            <Card className="project-detail-page__summary-card">
              <div className="project-detail-page__section-heading">
                <div>
                  <p className="project-detail-page__section-kicker">Scope Summary</p>
                  <h3 className="project-detail-page__section-title">Key Requirements</h3>
                </div>
              </div>
              <div className="project-detail-page__metric-grid">
                <div className="project-detail-page__metric-card">
                  <span className="project-detail-page__metric-label">Service Type</span>
                  <strong>{serviceLabels.join(" · ") || "Not specified"}</strong>
                </div>
                <div className="project-detail-page__metric-card">
                  <span className="project-detail-page__metric-label">Expected Completion</span>
                  <strong>{formatDate(project.expectedCompletion)}</strong>
                </div>
                <div className="project-detail-page__metric-card">
                  <span className="project-detail-page__metric-label">Budget</span>
                  <strong>{formatCurrency(project.budget)}</strong>
                </div>
                <div className="project-detail-page__metric-card">
                  <span className="project-detail-page__metric-label">Location</span>
                  <strong>{project.location || "TBD"}</strong>
                </div>
              </div>
            </Card>
          </section>
        </TabsContent>

        <TabsContent value="design-files" className="project-detail-page__tab-panel">
          <div className="project-detail-page__drawings-grid">
            {projectDrawings.map((d) => (<Card key={d.id} className="project-detail-page__drawing-card">
              <CardContent className="project-detail-page__drawing-content">
                <div className="project-detail-page__drawing-preview">
                  <span className="project-detail-page__drawing-type">{d.type.replace("_", " ")}</span>
                </div>
                <div>
                  <p className="project-detail-page__drawing-name">{d.name}</p>
                  <p className="project-detail-page__drawing-meta">{d.version} · {d.updatedAt}</p>
                </div>
                <Badge variant={d.status === "approved" ? "success" : "warning"}>{d.status.replace("_", " ")}</Badge>
              </CardContent>
            </Card>))}
          </div>
        </TabsContent>

        <TabsContent value="boq" className="project-detail-page__tab-panel">
          {projectBOQ ? (<Card>
            <CardHeader>
              <CardTitle>{projectBOQ.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="project-detail-page__boq-table-wrap">
                <table className="project-detail-page__boq-table">
                  <thead>
                    <tr>
                      <th>Room</th>
                      <th>Item</th>
                      <th>Qty</th>
                      <th>Rate</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projectBOQ.items.map((item) => {
                      const total = item.quantity * item.rate * (1 + item.gst / 100) + item.labour;
                      return (<tr key={item.id}>
                        <td>{item.room}</td>
                        <td>{item.item}</td>
                        <td>{item.quantity} {item.unit}</td>
                        <td>₹{item.rate}</td>
                        <td>{formatCurrency(total)}</td>
                      </tr>);
                    })}
                  </tbody>
                </table>
              </div>
              <ButtonLink to={`/boq/${projectBOQ.id}`} />
            </CardContent>
          </Card>) : (<p className="project-detail-page__empty-text">No BOQ created yet.</p>)}
        </TabsContent>

        <TabsContent value="quotation" className="project-detail-page__tab-panel">
          <div className="project-detail-page__quotes-list">
            {projectQuotes.map((q) => (<Card key={q.id}>
              <CardContent className="project-detail-page__quote-content">
                <div>
                  <p className="project-detail-page__quote-title">{q.title}</p>
                  <p className="project-detail-page__quote-meta">{q.versions.length} versions</p>
                </div>
                <div className="project-detail-page__quote-right">
                  <p className="project-detail-page__quote-amount">{formatCurrency(q.amount)}</p>
                  <StatusChip status={q.status} type="quotation" />
                </div>
              </CardContent>
            </Card>))}
          </div>
        </TabsContent>

        <TabsContent value="progress-tracking" className="project-detail-page__tab-panel">
          <ProjectProgressTracking />
        </TabsContent>

        <TabsContent value="materials" className="project-detail-page__tab-panel">
          <ProjectMaterialsTab materials={project.materials} />
        </TabsContent>

        <TabsContent value="payments" className="project-detail-page__tab-panel">
          <ProjectPaymentsTab projectId={id} />
        </TabsContent>

        <TabsContent value="documents" className="project-detail-page__tab-panel">
          <ProjectDocumentsTab projectId={id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
function ButtonLink({ to }) {
  return (<Link to={to} className="project-detail-page__boq-link">
    Open full BOQ builder →
  </Link>);
}

