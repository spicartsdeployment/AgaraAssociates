import { useEffect, useRef } from "react";
import { COLORS } from "@/lib/constants";
import "@/assets/styles/components/ProgressRing.scss";

function getProgressColor(value) {
  if (value >= 80) return COLORS.success;
  if (value >= 60) return COLORS.accent;
  if (value >= 40) return COLORS.warning;
  return COLORS.danger;
}

function getValueSizeClass(size) {
  if (size <= 48) return "progress-ring__value--xs";
  if (size <= 72) return "progress-ring__value--sm";
  if (size <= 100) return "progress-ring__value--lg";
  return "progress-ring__value--xl";
}

export function ProgressRing({
  value,
  size = 120,
  strokeWidth = 8,
  label,
  className,
}) {
  const rootRef = useRef(null);
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const rootClassName = ["progress-ring", className].filter(Boolean).join(" ");

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    el.style.setProperty("--progress-size", `${size}px`);
    el.style.setProperty("--progress-stroke-width", `${strokeWidth}`);
    el.style.setProperty("--progress-circumference", `${circumference}`);
    el.style.setProperty("--progress-offset", `${offset}`);
    el.style.setProperty("--progress-color", getProgressColor(value));
  }, [value, size, strokeWidth, circumference, offset]);

  return (
    <div ref={rootRef} className={rootClassName}>
      <svg viewBox="0 0 100 100" className="progress-ring__svg">
        <circle
          className="progress-ring__track"
          cx="50"
          cy="50"
          r={radius}
        />
        <circle
          className="progress-ring__fill"
          cx="50"
          cy="50"
          r={radius}
        />
      </svg>
      <div className="progress-ring__label-wrap">
        <span
          className={`progress-ring__value ${getValueSizeClass(size)}`}
        >
          {value}
        </span>
        {label && <span className="progress-ring__label">{label}</span>}
      </div>
    </div>
  );
}
