export interface CheckInLike {
  date: string;
  isRelapse: boolean;
}

export interface WeeklyComparison {
  thisWeekCount: number;
  lastWeekCount: number;
  delta: number;
  trend: "up" | "down" | "same";
}

function startOfDay(d: Date): Date {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function startOfWeek(d: Date): Date {
  const copy = startOfDay(d);
  const day = copy.getDay(); // 0 = Sunday
  copy.setDate(copy.getDate() - day);
  return copy;
}

export function computeWeeklyComparison(
  checkIns: CheckInLike[],
): WeeklyComparison {
  const now = new Date();
  const thisWeekStart = startOfWeek(now);
  const lastWeekStart = new Date(thisWeekStart);
  lastWeekStart.setDate(lastWeekStart.getDate() - 7);

  let thisWeekCount = 0;
  let lastWeekCount = 0;

  checkIns.forEach((entry) => {
    const entryDate = startOfDay(new Date(entry.date));
    if (entryDate >= thisWeekStart) {
      thisWeekCount++;
    } else if (entryDate >= lastWeekStart && entryDate < thisWeekStart) {
      lastWeekCount++;
    }
  });

  const delta = thisWeekCount - lastWeekCount;
  const trend: WeeklyComparison["trend"] =
    delta > 0 ? "up" : delta < 0 ? "down" : "same";

  return { thisWeekCount, lastWeekCount, delta, trend };
}

export function computeBestStreak(checkIns: CheckInLike[]): number {
  const sorted = [...checkIns].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  let best = 0;
  let current = 0;
  let prevDate: Date | null = null;

  for (const entry of sorted) {
    const entryDate = startOfDay(new Date(entry.date));

    if (entry.isRelapse) {
      current = 0;
      prevDate = entryDate;
      continue;
    }

    if (prevDate) {
      const diffDays = Math.round(
        (entryDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24),
      );
      current = diffDays === 1 ? current + 1 : 1;
    } else {
      current = 1;
    }

    best = Math.max(best, current);
    prevDate = entryDate;
  }

  return best;
}

export function computeStreakStartDate(
  checkIns: CheckInLike[],
  currentStreak: number,
): Date | null {
  if (currentStreak <= 0) return null;

  const sortedDesc = [...checkIns].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const streakEntries = sortedDesc.slice(0, currentStreak);
  const last = streakEntries[streakEntries.length - 1];
  return last ? startOfDay(new Date(last.date)) : null;
}

export function computeDaysSinceLastRelapse(
  checkIns: CheckInLike[],
): number | null {
  const relapses = checkIns
    .filter((c) => c.isRelapse)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (relapses.length === 0) return null;

  const lastRelapseDate = startOfDay(new Date(relapses[0].date));
  const today = startOfDay(new Date());
  return Math.round(
    (today.getTime() - lastRelapseDate.getTime()) / (1000 * 60 * 60 * 24),
  );
}

export function getMotivationalMessage(
  comparison: WeeklyComparison,
  currentStreak: number,
): string {
  if (currentStreak === 0) {
    return "Every journey starts with a single step. Today is a fresh start.";
  }
  if (comparison.trend === "up") {
    return "You're on fire this week! Keep the momentum going.";
  }
  if (comparison.trend === "down") {
    return "It was a quieter week, and that's okay. Show up today, regain your momentum, and get back into a consistent rhythm";
  }
  return "Steady and consistent. That's exactly how lasting habits are built.";
}
