"use client";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  CheckSquare,
  Calendar,
  ChevronDown,
  Menu,
} from "lucide-react";
import { Button } from "@/components/common/Button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/common/Avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CommandPalette } from "@/components/organisms/command-palette";
import BrandLogo from "@/components/navigation/BrandLogo";
import { CURRENT_USER, DEFAULT_PROJECT_ID } from "@/lib/constants";
import { getInitials } from "@/lib/utils";
import { getProjectsSummary } from "@/services/projectsService";
import { getNotificationsSummary } from "@/services/notificationsService";
import { clearSessionCookie } from "@/lib/auth/session";
import "@/assets/styles/components/AppHeader.scss";

export function AppHeader({ onMenuClick, glass = false }) {
  const navigate = useNavigate();
  const [commandOpen, setCommandOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    try {
      setProjects(getProjectsSummary());
      const summary = getNotificationsSummary();
      setNotifications(summary.data);
      setUnreadCount(summary.meta.unread);
    } catch {
      setProjects([]);
      setNotifications([]);
      setUnreadCount(0);
    }
  }, []);

  const currentProject =
    projects.find((p) => p.id === DEFAULT_PROJECT_ID) ?? projects[0];

  return (
    <>
      <header
        className={`app-header${glass ? " app-header--glass" : ""}`}
      >
        <div className="app-header__brand">
          <BrandLogo compact />
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="app-header__menu-btn"
          onClick={onMenuClick}
        >
          <Menu className="app-header__action-icon" />
        </Button>

        {/* <button
          type="button"
          onClick={() => setCommandOpen(true)}
          className="app-header__search"
        >
          <Search className="app-header__search-icon" />
          <span className="app-header__search-text">
            Search projects, clients, pages...
          </span>
          <kbd className="app-header__kbd">⌘K</kbd>
        </button> */}

        <div className="app-header__actions">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="app-header__project-btn">
                <span className="app-header__project-name">
                  {currentProject?.name || "Select Project"}
                </span>
                <ChevronDown className="app-header__project-chevron" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="app-header__project-menu">
              <DropdownMenuLabel>Switch Project</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {projects.slice(0, 6).map((p) => (
                <DropdownMenuItem key={p.id} asChild>
                  <Link to={`/app/projects/${p.id}`}>{p.name}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="app-header__icon-btn"
              >
                <Bell className="app-header__bell-icon" />
                {unreadCount > 0 && (
                  <span className="app-header__badge">{unreadCount}</span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="app-header__notifications-menu">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.slice(0, 5).map((n) => (
                <DropdownMenuItem key={n.id} asChild>
                  <Link
                    to={n.href || "#"}
                    className="app-header__notification-link"
                  >
                    <span
                      className={`app-header__notification-title${!n.read
                        ? " app-header__notification-title--unread"
                        : ""
                        }`}
                    >
                      {n.title}
                    </span>
                    <span className="app-header__notification-message">
                      {n.message}
                    </span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            className="app-header__icon-btn"
            asChild
          >
            <Link to="/site-progress">
              <CheckSquare className="app-header__action-icon" />
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="app-header__calendar-btn"
            asChild
          >
            <Link to="/calendar">
              <Calendar className="app-header__action-icon" />
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="app-header__avatar-btn">
                <Avatar className="app-header__avatar">
                  <AvatarImage
                    src={CURRENT_USER.avatar}
                    alt={CURRENT_USER.name}
                    className="app-header__avatar-image"
                  />
                  <AvatarFallback className="app-header__avatar-fallback">
                    {getInitials(CURRENT_USER.name)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div>{CURRENT_USER.name}</div>
                <div className="app-header__user-role">{CURRENT_USER.role}</div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  clearSessionCookie();
                  navigate("/login");
                }}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {commandOpen && (
        <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
      )}
    </>
  );
}
