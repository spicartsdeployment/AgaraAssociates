"use client";
import { Link, useLocation } from "react-router-dom";
import { APP_TAGLINE, NAV_ITEMS } from "@/lib/constants";
import { AppLogo } from "@/components/atoms/app-logo";
import { ScrollArea } from "@/components/ui/scroll-area";
import "@/assets/styles/components/Sidebar.scss";

export function Sidebar() {
  const { pathname } = useLocation();
  const groups = [...new Set(NAV_ITEMS.map((item) => item.group || "Main"))];

  return (
    <aside className="sidebar">

      <ScrollArea className="sidebar__scroll">
        <nav className="sidebar__nav">
          {groups.map((group) => (
            <div key={group}>
              <p className="sidebar__group-label">{group}</p>
              <div className="sidebar__group-items">
                {NAV_ITEMS.filter(
                  (item) => (item.group || "Main") === group
                ).map((item) => {
                  const isActive =
                    item.href === "/dashboard"
                      ? pathname === "/dashboard"
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={`sidebar__link${isActive ? " sidebar__link--active" : ""
                        }`}
                    >
                      <item.icon
                        className="sidebar__link-icon"
                        strokeWidth={1.5}
                      />
                      {item.title}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>
    </aside>
  );
}
