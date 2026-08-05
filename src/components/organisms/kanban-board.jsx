"use client";
import { Card, CardContent } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { cx } from "@/lib/utils";
import "@/assets/styles/components/KanbanBoard.scss";

const columns = [
    { id: "todo", title: "To Do", modifier: "todo" },
    { id: "in_progress", title: "In Progress", modifier: "in-progress" },
    { id: "inspection", title: "Inspection", modifier: "inspection" },
    { id: "done", title: "Done", modifier: "done" },
];

const priorityColors = {
    high: "destructive",
    medium: "warning",
    low: "outline",
};

export function KanbanBoard({ tasks, className }) {
    return (<div className={cx("kanban-board", className)}>
      {columns.map((col) => {
            const colTasks = tasks.filter((t) => t.column === col.id);
            return (<div key={col.id} className={cx("kanban-board__column", `kanban-board__column--${col.modifier}`)}>
            <div className="kanban-board__column-header">
              <h3 className="kanban-board__column-title">{col.title}</h3>
              <span className="kanban-board__column-count">
                {colTasks.length}
              </span>
            </div>
            <div className="kanban-board__tasks">
              {colTasks.map((task) => (<Card key={task.id} className="kanban-board__task">
                  <CardContent className="kanban-board__task-content">
                    <div className="kanban-board__task-header">
                      <p className="kanban-board__task-title">{task.title}</p>
                      <Badge variant={priorityColors[task.priority]} className="kanban-board__task-badge">
                        {task.priority}
                      </Badge>
                    </div>
                    <p className="kanban-board__task-description">{task.description}</p>
                    <p className="kanban-board__task-assignee">{task.assignee}</p>
                  </CardContent>
                </Card>))}
            </div>
          </div>);
        })}
    </div>);
}
