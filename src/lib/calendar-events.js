import { siteVisits } from "@/lib/mock/activities";
import { milestones, getAllProjects } from "@/lib/store/project-store";
import { getPendingApprovals } from "@/lib/store/approval-store";
import { getDashboardData } from "@/lib/mock/dashboard";
export function getCalendarEvents() {
    const events = [];
    siteVisits.forEach((sv) => {
        events.push({
            id: `cal-sv-${sv.id}`,
            title: sv.purpose,
            date: sv.date,
            time: sv.time,
            type: "site_visit",
            projectId: sv.projectId,
            projectName: sv.projectName,
            location: sv.location,
        });
    });
    milestones.forEach((ms) => {
        const project = getAllProjects().find((p) => p.id === ms.projectId);
        events.push({
            id: `cal-ms-${ms.id}`,
            title: ms.title,
            date: ms.date,
            type: ms.status === "delayed" ? "deadline" : "milestone",
            projectId: ms.projectId,
            projectName: project?.name,
        });
    });
    getPendingApprovals().forEach((a) => {
        events.push({
            id: `cal-appr-${a.id}`,
            title: a.title,
            date: a.dueDate,
            type: "approval",
            projectId: a.projectId,
            projectName: a.projectName,
        });
    });
    getDashboardData().projectAlerts
        .filter((a) => a.type === "calendar" || a.type === "site_visit" || a.type === "deadline")
        .forEach((a) => {
        events.push({
            id: `cal-alert-${a.id}`,
            title: a.title,
            date: a.dueAt.split("T")[0],
            time: a.dueAt.split("T")[1]?.slice(0, 5),
            type: a.type === "calendar" ? "meeting" : a.type === "site_visit" ? "site_visit" : "deadline",
            projectName: a.projectName,
        });
    });
    return events.sort((a, b) => a.date.localeCompare(b.date));
}
export function getEventsForDate(date) {
    return getCalendarEvents().filter((e) => e.date === date);
}
export function getUpcomingEvents(limit = 8) {
    const today = new Date().toISOString().split("T")[0];
    return getCalendarEvents().filter((e) => e.date >= today).slice(0, limit);
}
