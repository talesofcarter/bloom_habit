import { IconTrophy, IconLock } from "@tabler/icons-react";
import type { Milestone } from "../types/stats";

interface BadgeProps {
  milestone: Milestone;

  currentStreak?: number;
}

export default function Badge({ milestone, currentStreak }: BadgeProps) {
  const { title, description, earned, days } = milestone;

  const daysRemaining =
    !earned && typeof currentStreak === "number"
      ? Math.max(days - currentStreak, 0)
      : null;

  const progressPct =
    !earned && typeof currentStreak === "number"
      ? Math.min((currentStreak / days) * 100, 100)
      : null;

  return (
    <div
      className={`p-5 rounded-2xl border transition-all duration-500 ${
        earned
          ? "bg-brand-green/10 border-brand-green/30 shadow-[0_0_15px_rgba(29,185,84,0.1)]"
          : "bg-white/3 border-white/5"
      }`}
    >
      <div className="flex items-center gap-3 mb-2">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
            earned
              ? "bg-brand-green/15 text-brand-green"
              : "bg-white/5 text-white/25"
          }`}
        >
          {earned ? (
            <IconTrophy size={16} stroke={2} />
          ) : (
            <IconLock size={14} stroke={1.75} />
          )}
        </div>
        <h4
          className={`text-sm font-bold tracking-wide ${
            earned ? "text-white" : "text-white/50"
          }`}
        >
          {title}
        </h4>
      </div>

      <p
        className={`text-[11px] leading-relaxed tracking-wide mb-3 ${
          earned ? "text-white/60" : "text-white/30"
        }`}
      >
        {description}
      </p>

      {daysRemaining !== null && progressPct !== null && (
        <div className="space-y-1.5">
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-white/20 rounded-full transition-all duration-700"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="text-[10px] text-white/25 font-medium tracking-wide">
            {daysRemaining === 1
              ? "1 day to go"
              : `${daysRemaining} days to go`}
          </p>
        </div>
      )}
    </div>
  );
}
