"use client";
import { useState } from "react";
import { toast } from "sonner";
import { getTeamMembers, getAllTasks, toggleTaskCompleted } from "@/lib/store/team-store";
import { PageHeader } from "@/components/templates/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/common/Avatar";
import { getInitials } from "@/lib/utils";
import "@/assets/styles/pages/TeamPage.scss";

export function TeamPage() {
    const [version, setVersion] = useState(0);
    void version;
    const team = getTeamMembers();
    const tasks = getAllTasks();
    const openTasks = tasks.filter((t) => !t.completed);
    return (<div className="team-page">
      <PageHeader title="Team & Tasks" description="Studio roster and cross-project task queue"/>

      <div className="team-page__layout">
        <Card>
          <CardHeader><CardTitle className="team-page__section-title">Team ({team.length})</CardTitle></CardHeader>
          <CardContent className="team-page__member-list">
            {team.map((member) => (<div key={member.id} className="team-page__member-row">
                <Avatar>
                  {member.avatar ? <AvatarImage src={member.avatar} alt={member.name}/> : null}
                  <AvatarFallback className="team-page__avatar-fallback">{getInitials(member.name)}</AvatarFallback>
                </Avatar>
                <div className="team-page__member-info">
                  <p className="team-page__member-name">{member.name}</p>
                  <p className="team-page__member-role">{member.role}</p>
                </div>
                <Badge variant={member.active ? "success" : "outline"}>{member.active ? "Active" : "Away"}</Badge>
              </div>))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="team-page__section-title">Open Tasks ({openTasks.length})</CardTitle></CardHeader>
          <CardContent className="team-page__task-list">
            {tasks.map((task) => (<div key={task.id} className="team-page__task-row">
                <input type="checkbox" checked={task.completed} className="team-page__checkbox" onChange={() => {
                toggleTaskCompleted(task.id);
                setVersion((v) => v + 1);
                toast.success(task.completed ? "Task reopened" : "Task completed");
            }}/>
                <div className="team-page__task-info">
                  <p className={task.completed ? "team-page__task-title team-page__task-title--completed" : "team-page__task-title"}>{task.title}</p>
                  <p className="team-page__task-meta">{task.projectName} · Due {task.dueDate}</p>
                </div>
                <Badge variant={task.priority === "high" ? "destructive" : task.priority === "medium" ? "warning" : "outline"}>{task.priority}</Badge>
              </div>))}
          </CardContent>
        </Card>
      </div>
    </div>);
}
