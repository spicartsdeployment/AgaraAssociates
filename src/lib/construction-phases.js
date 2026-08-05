// ─── Construction phases + checklist data ────────────────────────────────────
// weight: relative importance used to compute overall project progress.
// All weights sum to 100.

export const CONSTRUCTION_PHASES = [
  {
    id: "planning",
    label: "Planning",
    weight: 5,
    tasks: [
      { id: "pl-1", label: "Agreement Signed" },
      { id: "pl-2", label: "Advance Payment" },
      { id: "pl-3", label: "Drawings Approved" },
      { id: "pl-4", label: "Permissions Received" },
    ],
  },
  {
    id: "site_preparation",
    label: "Site Preparation",
    weight: 5,
    tasks: [
      { id: "sp-1", label: "Site Cleaning" },
      { id: "sp-2", label: "Site Layout" },
      { id: "sp-3", label: "Temporary Water" },
      { id: "sp-4", label: "Temporary Electricity" },
      { id: "sp-5", label: "Material Storage" },
    ],
  },
  {
    id: "foundation",
    label: "Foundation",
    weight: 12,
    tasks: [
      { id: "fn-1", label: "Excavation" },
      { id: "fn-2", label: "PCC" },
      { id: "fn-3", label: "Footing Reinforcement" },
      { id: "fn-4", label: "Footing Concrete" },
      { id: "fn-5", label: "Curing" },
      { id: "fn-6", label: "Inspection" },
    ],
  },
  {
    id: "columns_plinth",
    label: "Columns & Plinth",
    weight: 10,
    tasks: [
      { id: "cp-1", label: "Steel Reinforcement" },
      { id: "cp-2", label: "Shuttering" },
      { id: "cp-3", label: "Concrete" },
      { id: "cp-4", label: "Curing" },
      { id: "cp-5", label: "Plinth Beam" },
    ],
  },
  {
    id: "roof_slab",
    label: "Roof Slab",
    weight: 10,
    tasks: [
      { id: "rs-1", label: "Slab Reinforcement" },
      { id: "rs-2", label: "Electrical Conduits" },
      { id: "rs-3", label: "Concrete" },
      { id: "rs-4", label: "Curing" },
      { id: "rs-5", label: "Inspection" },
    ],
  },
  {
    id: "brick_work",
    label: "Brick Work",
    weight: 8,
    tasks: [
      { id: "bw-1", label: "External Walls" },
      { id: "bw-2", label: "Internal Walls" },
      { id: "bw-3", label: "Door Frames" },
      { id: "bw-4", label: "Window Frames" },
    ],
  },
  {
    id: "plumbing_electrical",
    label: "Plumbing & Electrical",
    weight: 8,
    tasks: [
      { id: "pe-1", label: "Plumbing Pipes" },
      { id: "pe-2", label: "Drainage" },
      { id: "pe-3", label: "Electrical Conduits" },
      { id: "pe-4", label: "Switch Boxes" },
      { id: "pe-5", label: "Inspection" },
    ],
  },
  {
    id: "plastering",
    label: "Plastering",
    weight: 7,
    tasks: [
      { id: "pl2-1", label: "Internal Plaster" },
      { id: "pl2-2", label: "External Plaster" },
      { id: "pl2-3", label: "Ceiling Plaster" },
    ],
  },
  {
    id: "flooring",
    label: "Flooring",
    weight: 8,
    tasks: [
      { id: "fl-1", label: "Tiles Delivered" },
      { id: "fl-2", label: "Tile Installation" },
      { id: "fl-3", label: "Grouting" },
      { id: "fl-4", label: "Cleaning" },
    ],
  },
  {
    id: "painting",
    label: "Painting",
    weight: 6,
    tasks: [
      { id: "pa-1", label: "Putty" },
      { id: "pa-2", label: "Primer" },
      { id: "pa-3", label: "First Coat" },
      { id: "pa-4", label: "Final Coat" },
      { id: "pa-5", label: "Quality Check" },
    ],
  },
  {
    id: "doors_windows",
    label: "Doors & Windows",
    weight: 6,
    tasks: [
      { id: "dw-1", label: "Main Door" },
      { id: "dw-2", label: "Internal Doors" },
      { id: "dw-3", label: "Windows" },
      { id: "dw-4", label: "Hardware" },
    ],
  },
  {
    id: "fixtures_finishing",
    label: "Fixtures & Finishing",
    weight: 8,
    tasks: [
      { id: "ff-1", label: "Sanitary Fixtures" },
      { id: "ff-2", label: "Electrical Fixtures" },
      { id: "ff-3", label: "Kitchen Installation" },
      { id: "ff-4", label: "Stair Railings" },
    ],
  },
  {
    id: "final_inspection",
    label: "Final Inspection",
    weight: 7,
    tasks: [
      { id: "fi-1", label: "Final Cleaning" },
      { id: "fi-2", label: "Snag List Closed" },
      { id: "fi-3", label: "Client Inspection" },
      { id: "fi-4", label: "Project Handover" },
      { id: "fi-5", label: "Project Closed" },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Build a fresh task-state map keyed by task id.
 * Shape: { [taskId]: { status, plannedDate, completionDate, remarks, photos } }
 */
export function buildInitialTaskState() {
  const state = {};
  for (const phase of CONSTRUCTION_PHASES) {
    for (const task of phase.tasks) {
      state[task.id] = {
        status: "planned",      // "planned" | "in_progress" | "completed"
        plannedDate: "",
        completionDate: "",
        remarks: "",
        photos: [],
      };
    }
  }
  return state;
}

/**
 * Compute phase progress (0-100) from taskState.
 */
export function calcPhaseProgress(phase, taskState) {
  const total = phase.tasks.length;
  if (total === 0) return 0;
  const done = phase.tasks.filter((t) => taskState[t.id]?.status === "completed").length;
  return Math.round((done / total) * 100);
}

/**
 * Derive the phase status label from its progress.
 */
export function phaseStatus(progress) {
  if (progress === 100) return "completed";
  if (progress > 0)    return "in_progress";
  return "planned";
}

/**
 * Compute weighted overall project progress (0-100).
 */
export function calcOverallProgress(taskState) {
  const totalWeight = CONSTRUCTION_PHASES.reduce((s, p) => s + p.weight, 0);
  const weighted = CONSTRUCTION_PHASES.reduce((sum, phase) => {
    const pct = calcPhaseProgress(phase, taskState);
    return sum + (pct * phase.weight) / 100;
  }, 0);
  return Math.round((weighted / totalWeight) * 100);
}

/**
 * Count all tasks by status across all phases.
 */
export function countTasksByStatus(taskState) {
  let completed = 0, inProgress = 0, planned = 0;
  for (const v of Object.values(taskState)) {
    if (v.status === "completed") completed++;
    else if (v.status === "in_progress") inProgress++;
    else planned++;
  }
  return { completed, inProgress, planned };
}

/**
 * Find the name of the first phase that is currently in_progress,
 * or the next planned phase.
 */
export function currentPhaseName(taskState) {
  for (const phase of CONSTRUCTION_PHASES) {
    const p = calcPhaseProgress(phase, taskState);
    if (p > 0 && p < 100) return phase.label;
  }
  for (const phase of CONSTRUCTION_PHASES) {
    const p = calcPhaseProgress(phase, taskState);
    if (p === 0) return phase.label;
  }
  return "Complete";
}
