import { getCalendarEvents, getUpcomingEvents } from "@/lib/calendar-events";
import { PageHeader } from "@/components/templates/page-header";
import { Card, CardContent } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { Calendar, MapPin } from "lucide-react";
import "@/assets/styles/pages/CalendarPage.scss";

const TYPE_LABELS = {
    site_visit: "Site Visit",
    milestone: "Milestone",
    meeting: "Meeting",
    deadline: "Deadline",
    approval: "Approval",
};
export function CalendarPage() {
    const events = getCalendarEvents();
    const upcoming = getUpcomingEvents(12);
    const dates = [...new Set(events.map((e) => e.date))].sort();
    return (<div className="calendar-page">
      <PageHeader title="Calendar" description="Site visits, milestones, meetings, and approval deadlines"/>

      <Card className="calendar-page__callout">
        <CardContent className="calendar-page__callout-content">
          <Calendar className="calendar-page__callout-icon"/>
          <p className="calendar-page__callout-text"><strong>{upcoming.length} upcoming events</strong> across active projects — site visits, milestones, and client meetings.</p>
        </CardContent>
      </Card>

      <div className="calendar-page__timeline">
        {dates.map((date) => {
            const dayEvents = events.filter((e) => e.date === date);
            return (<section key={date}>
              <h2 className="calendar-page__day-title">
                <Calendar />
                {date}
              </h2>
              <div className="calendar-page__events">
                {dayEvents.map((e) => (<Card key={e.id}>
                    <CardContent className="calendar-page__event-content">
                      <div>
                        <div className="calendar-page__event-title-row">
                          <p className="calendar-page__event-title">{e.title}</p>
                          <Badge variant="outline" className="calendar-page__event-type">{TYPE_LABELS[e.type] ?? e.type}</Badge>
                        </div>
                        {e.projectName && <p className="calendar-page__event-project">{e.projectName}</p>}
                        {e.location && (<p className="calendar-page__event-location">
                            <MapPin />{e.location}
                          </p>)}
                      </div>
                      {e.time && <span className="calendar-page__event-time">{e.time}</span>}
                    </CardContent>
                  </Card>))}
              </div>
            </section>);
        })}
      </div>
    </div>);
}
