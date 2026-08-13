import { useState, useEffect } from "react";
import { api } from "../lib/api";
import type { StatsData } from "../types/stats";
import Badge from "../components/Badge";
import SkeletonLoader from "../components/SkeletonLoader";
import confetti from "canvas-confetti";

export default function Achievements() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Gamification Engine
  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#1DB954", "#ffffff", "#a3a3a3"],
      });

      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#1DB954", "#ffffff", "#a3a3a3"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get<StatsData>("/check-ins/stats");
        const data = response.data;
        setStats(data);

        const hitMilestoneToday = data.milestones.some(
          (milestone) => milestone.days === data.currentStreak,
        );

        if (hitMilestoneToday) {
          setTimeout(() => {
            triggerConfetti();
          }, 300);
        }
      } catch (err: unknown) {
        console.error("Failed to load stats", err);
        setError("Could not load your achievements.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Skeleton Loader
  if (isLoading) {
    return (
      <div className="space-y-8 max-w-5xl mx-auto pb-12 w-full animate-in fade-in duration-500">
        <div className="space-y-3 mb-10 text-center md:text-left">
          <SkeletonLoader className="h-10 w-64 rounded-xl mx-auto md:mx-0" />
          <SkeletonLoader className="h-4 w-48 rounded-md mx-auto md:mx-0" />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-white/2 border border-white/5 p-6 md:p-8 rounded-4xl">
          <div className="space-y-3 w-full sm:w-auto flex flex-col items-center sm:items-start">
            <SkeletonLoader className="h-6 w-32 rounded-lg" />
            <SkeletonLoader className="h-4 w-48 rounded-md" />
          </div>
          <SkeletonLoader className="h-14 w-32 rounded-2xl shrink-0" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={`badge-skeleton-${i}`}
              className="p-4 rounded-2xl border border-white/5 bg-white/2"
            >
              <div className="flex items-center gap-3 mb-3">
                <SkeletonLoader className="w-5 h-5 rounded-full shrink-0" />
                <SkeletonLoader className="h-5 w-24 rounded-lg" />
              </div>
              <div className="space-y-2">
                <SkeletonLoader className="h-3 w-full rounded-md" />
                <SkeletonLoader className="h-3 w-2/3 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center font-medium max-w-5xl mx-auto">
        {error}
      </div>
    );
  }

  // Content
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="space-y-2 text-center md:text-left mb-10">
        <h1 className="text-3xl md:text-4xl font-light text-white tracking-wide">
          Your <span className="font-medium">Achievements</span>.
        </h1>
        <p className="text-sm text-white/50 tracking-wide">
          Every day is a victory. Watch your progress bloom.
        </p>
      </div>

      {/* Streak Highlight Card */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-white/3 border border-white/10 p-6 md:p-8 rounded-4xl backdrop-blur-xl relative overflow-hidden">
        {/*  background  */}
        <div className="absolute -right-24 -top-24 w-48 h-48 bg-brand-green/10 rounded-full blur-[80px] pointer-events-none"></div>

        <div>
          <h3 className="text-lg md:text-xl text-white font-medium tracking-wide">
            Current Streak
          </h3>
          <p className="text-xs text-white/50 mt-1">
            Total lifetime check-ins: {stats.totalCheckIns}
          </p>
        </div>

        <div className="flex items-center gap-2 px-6 py-3 bg-brand-green/10 border border-brand-green/20 rounded-2xl shadow-[0_0_20px_rgba(29,185,84,0.15)] relative z-10">
          <span className="text-brand-green text-lg md:text-xl font-bold tracking-widest uppercase">
            {stats.currentStreak} {stats.currentStreak === 1 ? "Day" : "Days"}
          </span>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {stats.milestones.map((milestone) => (
          <Badge key={milestone.id} milestone={milestone} />
        ))}
      </div>
    </div>
  );
}
