"use client";
import { useMemo, useState } from "react";
import {
  ChevronDown, ChevronUp, CheckCircle2, Circle, Clock,
  Camera, FileText, AlertCircle, TrendingUp,
  Activity, ListChecks, CalendarClock, Flag,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { cx } from "@/lib/utils";
import {
  CONSTRUCTION_PHASES,
  buildInitialTaskState,
  calcPhaseProgress,
  calcOverallProgress,
  countTasksByStatus,
  currentPhaseName,
  phaseStatus,
} from "@/lib/construction-phases";
import "@/assets/styles/components/ProjectProgressTracking.scss";

// ─── Constants ────────────────────────────────────────────────────────────────
const STATUS_OPTIONS = [
  { value: "planned",     label: "Planned"     },
  { value: "in_progress", label: "In Progress" },
  { value: "completed",   label: "Completed"   },
];

const STATUS_BADGE_VARIANT = {
  planned:     "outline",
  in_progress: "default",
  completed:   "success",
};

const STATUS_ICON = {
  planned:     Circle,
  in_progress: Clock,
  completed:   CheckCircle2,
};

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({ icon: Icon, label, value, sub, accent }) {
  return (
    <div className={cx("ppt-kpi", accent && `ppt-kpi--${accent}`)}>
      <span className="ppt-kpi__icon-wrap"><Icon className="ppt-kpi__icon" /></span>
      <div className="ppt-kpi__body">
        <p className="ppt-kpi__value">{value}</p>
        <p className="ppt-kpi__label">{label}</p>
        {sub && <p className="ppt-kpi__sub">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Circular progress ring (pure CSS/SVG, no dep) ────────────────────────────
function MiniRing({ value }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  const color =
    value === 100 ? "var(--ppt-color-complete)" :
    value > 0     ? "var(--ppt-color-progress)" :
                    "var(--ppt-color-planned)";
  return (
    <svg className="ppt-ring" viewBox="0 0 100 100" aria-label={`${value}% complete`}>
      <circle className="ppt-ring__track" cx="50" cy="50" r={r} />
      <circle
        className="ppt-ring__fill"
        cx="50" cy="50" r={r}
        strokeDasharray={`${circ} ${circ}`}
        strokeDashoffset={offset}
        stroke={color}
      />
      <text className="ppt-ring__text" x="50" y="55" textAnchor="middle">{value}%</text>
    </svg>
  );
}

// ─── Phase progress bar ───────────────────────────────────────────────────────
function PhaseBar({ value, status }) {
  return (
    <div className="ppt-bar" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div
        className={cx("ppt-bar__fill", `ppt-bar__fill--${status}`)}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

// ─── Checklist row ────────────────────────────────────────────────────────────
function TaskRow({ task, data, onChange }) {
  const [expanded, setExpanded] = useState(false);
  const StatusIcon = STATUS_ICON[data.status];

  const handleCheck = () => {
    const next = data.status === "completed" ? "planned" : "completed";
    const patch = { status: next };
    if (next === "completed" && !data.completionDate) {
      patch.completionDate = new Date().toISOString().split("T")[0];
    }
    onChange(task.id, patch);
  };

  return (
    <div className={cx("ppt-task", data.status === "completed" && "ppt-task--done")}>
      {/* Main row */}
      <div className="ppt-task__main">
        <button
          type="button"
          onClick={handleCheck}
          className="ppt-task__checkbox"
          aria-label={data.status === "completed" ? "Mark incomplete" : "Mark complete"}
        >
          <StatusIcon
            className={cx("ppt-task__status-icon", `ppt-task__status-icon--${data.status}`)}
          />
        </button>

        <span className={cx("ppt-task__label", data.status === "completed" && "ppt-task__label--done")}>
          {task.label}
        </span>

        <select
          value={data.status}
          onChange={(e) => onChange(task.id, { status: e.target.value })}
          className={cx("ppt-task__status-select", `ppt-task__status-select--${data.status}`)}
          aria-label={`Status for ${task.label}`}
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        <input
          type="date"
          value={data.plannedDate}
          onChange={(e) => onChange(task.id, { plannedDate: e.target.value })}
          className="ppt-task__date-input"
          title="Planned date"
          aria-label="Planned date"
        />

        <input
          type="date"
          value={data.completionDate}
          onChange={(e) => onChange(task.id, { completionDate: e.target.value })}
          className="ppt-task__date-input"
          title="Completion date"
          aria-label="Completion date"
        />

        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="ppt-task__expand-btn"
          aria-expanded={expanded}
          aria-label="Toggle details"
        >
          {expanded ? <ChevronUp className="ppt-task__expand-icon" /> : <ChevronDown className="ppt-task__expand-icon" />}
        </button>
      </div>

      {/* Expanded detail panel */}
      {expanded && (
        <div className="ppt-task__detail">
          <textarea
            value={data.remarks}
            onChange={(e) => onChange(task.id, { remarks: e.target.value })}
            placeholder="Add remarks…"
            rows={2}
            className="ppt-task__remarks"
          />
          <div className="ppt-task__uploads">
            <label className="ppt-task__upload-btn">
              <Camera className="ppt-task__upload-icon" />
              Upload Photos
              <input type="file" accept="image/*" multiple className="ppt-task__file-input" />
            </label>
            <label className="ppt-task__upload-btn ppt-task__upload-btn--doc">
              <FileText className="ppt-task__upload-icon" />
              Attach Document
              <input type="file" accept=".pdf,.doc,.docx" className="ppt-task__file-input" />
            </label>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Phase accordion row ──────────────────────────────────────────────────────
function PhaseRow({ phase, taskState, onTaskChange, isFirst, isLast }) {
  const [open, setOpen] = useState(false);
  const progress = calcPhaseProgress(phase, taskState);
  const status   = phaseStatus(progress);
  const done     = phase.tasks.filter((t) => taskState[t.id]?.status === "completed").length;
  const total    = phase.tasks.length;

  return (
    <div className={cx("ppt-phase", `ppt-phase--${status}`, !isFirst && "ppt-phase--connected")}>
      {/* Timeline connector dot */}
      <div className="ppt-phase__connector">
        <span className={cx("ppt-phase__dot", `ppt-phase__dot--${status}`)} />
        {!isLast && <span className="ppt-phase__line" />}
      </div>

      {/* Phase card */}
      <div className="ppt-phase__card">
        <button
          type="button"
          className="ppt-phase__header"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          <div className="ppt-phase__header-left">
            <span className="ppt-phase__name">{phase.label}</span>
            <Badge
              variant={STATUS_BADGE_VARIANT[status]}
              className="ppt-phase__status-badge"
            >
              {status === "in_progress" ? "In Progress" : status === "completed" ? "Completed" : "Planned"}
            </Badge>
          </div>

          <div className="ppt-phase__header-right">
            <span className="ppt-phase__task-count">{done}/{total} tasks</span>
            <span className="ppt-phase__pct">{progress}%</span>
            {open
              ? <ChevronUp  className="ppt-phase__chevron" />
              : <ChevronDown className="ppt-phase__chevron" />
            }
          </div>
        </button>

        <PhaseBar value={progress} status={status} />

        {open && (
          <div className="ppt-phase__checklist">
            {/* Column headers */}
            <div className="ppt-phase__col-headers">
              <span className="ppt-phase__col-head ppt-phase__col-head--task">Activity</span>
              <span className="ppt-phase__col-head">Status</span>
              <span className="ppt-phase__col-head">Planned Date</span>
              <span className="ppt-phase__col-head">Completed Date</span>
              <span className="ppt-phase__col-head" />
            </div>
            {phase.tasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                data={taskState[task.id]}
                onChange={onTaskChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function ProjectProgressTracking() {
  const [taskState, setTaskState] = useState(() => buildInitialTaskState());

  const handleTaskChange = (taskId, patch) => {
    setTaskState((prev) => ({
      ...prev,
      [taskId]: { ...prev[taskId], ...patch },
    }));
  };

  // Derived stats — recomputed whenever taskState changes
  const overallProgress = useMemo(() => calcOverallProgress(taskState), [taskState]);
  const { completed, inProgress, planned } = useMemo(() => countTasksByStatus(taskState), [taskState]);
  const totalTasks    = completed + inProgress + planned;
  const pendingTasks  = inProgress + planned;
  const activePhase   = useMemo(() => currentPhaseName(taskState), [taskState]);

  // Upcoming milestone = first phase with 0% progress
  const nextMilestone = useMemo(() => {
    const p = CONSTRUCTION_PHASES.find((ph) => calcPhaseProgress(ph, taskState) === 0);
    return p?.label ?? "All phases started";
  }, [taskState]);

  // Count delayed: tasks that are not completed and have a plannedDate in the past
  const today = new Date().toISOString().split("T")[0];
  const delayed = useMemo(() => {
    return Object.values(taskState).filter(
      (t) => t.status !== "completed" && t.plannedDate && t.plannedDate < today
    ).length;
  }, [taskState, today]);

  return (
    <div className="ppt">

      {/* ── Page heading ──────────────────────────────────────────────── */}
      <div className="ppt__header">
        <h2 className="ppt__title">Progress Tracking</h2>
        <p className="ppt__subtitle">
          Track construction progress by completing activities for each phase.
          Overall project progress is calculated automatically.
        </p>
      </div>

      {/* ── KPI summary cards ─────────────────────────────────────────── */}
      <div className="ppt__kpi-grid">
        <div className="ppt__kpi-ring-card">
          <MiniRing value={overallProgress} />
          <div className="ppt__kpi-ring-body">
            <p className="ppt__kpi-ring-label">Overall Progress</p>
            <p className="ppt__kpi-ring-sub">Weighted across all phases</p>
          </div>
        </div>

        <KpiCard icon={Activity}      label="Current Phase"         value={activePhase}   accent="primary" />
        <KpiCard icon={ListChecks}    label="Completed Activities"  value={completed}     sub={`of ${totalTasks} total`}  accent="success" />
        <KpiCard icon={Clock}         label="Pending Activities"    value={pendingTasks}  sub={`${inProgress} in progress`} />
        <KpiCard icon={AlertCircle}   label="Delayed Activities"    value={delayed}       accent={delayed > 0 ? "danger" : undefined} />
        <KpiCard icon={Flag}          label="Upcoming Phase"        value={nextMilestone} />
      </div>

      {/* ── Phase accordion timeline ──────────────────────────────────── */}
      <div className="ppt__phases">
        {CONSTRUCTION_PHASES.map((phase, idx) => (
          <PhaseRow
            key={phase.id}
            phase={phase}
            taskState={taskState}
            onTaskChange={handleTaskChange}
            isFirst={idx === 0}
            isLast={idx === CONSTRUCTION_PHASES.length - 1}
          />
        ))}
      </div>

    </div>
  );
}
