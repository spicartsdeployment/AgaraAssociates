"use client";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Cloud, CloudRain, CloudSun, Sun, MapPin } from "lucide-react";
import { CURRENT_USER } from "@/lib/constants";
import { GlassCard } from "@/components/ui/glass-card";
import { ProgressRing } from "@/components/atoms/progress-ring";
import { cx } from "@/lib/utils";
import "@/assets/styles/components/DashboardHero.scss";

const weatherIcons = {
    sunny: Sun,
    cloudy: Cloud,
    rainy: CloudRain,
    partly_cloudy: CloudSun,
};

function weatherIconModifier(icon) {
    if (icon === "sunny")
        return "sunny";
    if (icon === "rainy")
        return "rainy";
    return "default";
}

export function DashboardHero({ userName, studio, userRole = CURRENT_USER.role, weather, onTrackPercent = 87, }) {
    const [now, setNow] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);
    const WeatherIcon = weatherIcons[weather.icon];
    const profileImage = CURRENT_USER.avatar;
    return (<div className="dashboard-hero">
      <GlassCard className="dashboard-hero__clock-card">
        <div className="dashboard-hero__clock-row">
          <div className="dashboard-hero__date-wrap">
            <p className="dashboard-hero__date">
              {format(now, "EEEE, MMM d")}
            </p>
            <p className="dashboard-hero__time">
              {format(now, "h:mm")}
              <span className="dashboard-hero__time-period">{format(now, "a")}</span>
            </p>
          </div>

          <div className="dashboard-hero__weather">
            <div className={cx("dashboard-hero__weather-icon-wrap", `dashboard-hero__weather-icon-wrap--${weatherIconModifier(weather.icon)}`)}>
              <WeatherIcon className="dashboard-hero__weather-icon" strokeWidth={1.5}/>
            </div>
            <div>
              <p className="dashboard-hero__weather-temp">{weather.temperature}°C</p>
              <p className="dashboard-hero__weather-location">
                <MapPin className="dashboard-hero__weather-pin"/>
                <span className="dashboard-hero__weather-city">{weather.city}</span>
              </p>
            </div>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="dashboard-hero__profile-card">
        <div className="dashboard-hero__profile-media">
          <img src={profileImage} alt={userName} className="dashboard-hero__profile-image"/>

          <div className="dashboard-hero__profile-gradient"/>

          <div className="dashboard-hero__profile-content">
            <div className="dashboard-hero__profile-row">
              <div className="dashboard-hero__profile-info">
                <p className="dashboard-hero__profile-name">
                  {userName}
                </p>
                <p className="dashboard-hero__profile-role">{userRole}</p>
                <p className="dashboard-hero__profile-studio">{studio}</p>
              </div>

              <div className="dashboard-hero__track-badge">
                <p className="dashboard-hero__track-label">On-Track</p>
                <p className="dashboard-hero__track-value">{onTrackPercent}%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-hero__footer">
          <div className="dashboard-hero__footer-info">
            <p className="dashboard-hero__footer-label">Portfolio</p>
            <p className="dashboard-hero__footer-text">{weather.condition} · {weather.city}</p>
          </div>
          <ProgressRing value={onTrackPercent} size={48} strokeWidth={4}/>
        </div>
      </GlassCard>
    </div>);
}
