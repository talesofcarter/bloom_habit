import {
  IconTrendingUp,
  IconTrendingDown,
  IconMinus,
  IconCalendarStats,
} from "@tabler/icons-react";
import {
  computeWeeklyComparison,
  computeBestStreak,
  computeStreakStartDate,
  computeDaysSinceLastRelapse,
  getMotivationalMessage,
  type CheckInLike,
} from "../lib/streakAnalytics";

interface WeeklyInsightsProps {
  checkIns: CheckInLike[];
  currentStreak: number;
  isLoading?: boolean;
}

export default function WeeklyInsights({
  checkIns,
  currentStreak,
  isLoading = false,
}: WeeklyInsightsProps) {
  if (isLoading) {
    return (
      <div className="bg-white/3 border border-white/10 rounded-3xl p-6 md:p-8 animate-pulse h-44" />
    );
  }

  const comparison = computeWeeklyComparison(checkIns);
  const bestStreak = computeBestStreak(checkIns);
  const streakStart = computeStreakStartDate(checkIns, currentStreak);
  const daysSinceRelapse = computeDaysSinceLastRelapse(checkIns);
  const message = getMotivationalMessage(comparison, currentStreak);

  const TrendIcon =
    comparison.trend === "up"
      ? IconTrendingUp
      : comparison.trend === "down"
        ? IconTrendingDown
        : IconMinus;

  const trendColorClass =
    comparison.trend === "up"
      ? "text-brand-green"
      : comparison.trend === "down"
        ? "text-orange-400"
        : "text-white/50";

  return (
    <div className="bg-white/3 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl space-y-6 relative overflow-hidden">
      <div className="absolute -left-16 -bottom-16 w-40 h-40 bg-brand-green/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="flex items-start justify-between gap-4 relative z-10">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.2em] text-white/30 uppercase mb-1.5">
            Your Progress
          </p>
          <p className="text-white text-base md:text-lg font-medium tracking-wide">
            {message}
          </p>
        </div>
        <div
          className={`flex items-center gap-1.5 shrink-0 ${trendColorClass}`}
        >
          <TrendIcon size={18} stroke={2} />
          <span className="text-xs font-semibold tracking-wide">
            {comparison.delta > 0 ? "+" : ""}
            {comparison.delta}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10">
        <div className="space-y-1">
          <p className="text-[10px] font-semibold tracking-widest text-white/30 uppercase">
            This week
          </p>
          <p className="text-xl font-light text-white">
            {comparison.thisWeekCount}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-semibold tracking-widest text-white/30 uppercase">
            Last week
          </p>
          <p className="text-xl font-light text-white">
            {comparison.lastWeekCount}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-semibold tracking-widest text-white/30 uppercase">
            Best streak
          </p>
          <p className="text-xl font-light text-white">
            {bestStreak} {bestStreak === 1 ? "day" : "days"}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-semibold tracking-widest text-white/30 uppercase">
            Since setback
          </p>
          <p className="text-xl font-light text-white">
            {daysSinceRelapse === null ? "—" : `${daysSinceRelapse}d`}
          </p>
        </div>
      </div>

      {streakStart && (
        <div className="flex items-center gap-2 pt-4 border-t border-white/5 text-xs text-white/40 relative z-10">
          <IconCalendarStats size={14} stroke={1.75} />
          <span>
            Current streak began{" "}
            {streakStart.toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      )}
    </div>
  );
}
