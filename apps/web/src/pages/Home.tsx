import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import {
  IconFlame,
  IconCircleCheck,
  IconCalendarEvent,
  IconPlus,
} from "@tabler/icons-react";
import BibleVerseCard from "../components/BibleVerseCard";
import StatCard from "../components/StatCard";
import Modal from "../components/Modal";
import CheckInForm from "../components/CheckInForm";
import WeeklyInsights from "../components/WeeklyInsights";
import type { CheckInLike } from "../lib/streakAnalytics";

interface UserStats {
  totalCheckIns: number;
  currentStreak: number;
}

interface CheckInRecord extends CheckInLike {
  id: string;
  title: string;
}

export default function Home() {
  const { user } = useAuth();

  const [stats, setStats] = useState<UserStats>({
    totalCheckIns: 0,
    currentStreak: 0,
  });
  const [checkIns, setCheckIns] = useState<CheckInRecord[]>([]);
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchStats = async () => {
    try {
      // GET /check-ins/stats never included a `lastCheckIn` field, so the
      // old "Last Entry" card was silently reading `undefined` forever.
      // The check-in history endpoint (already ordered newest-first) is the
      // actual source of truth for "when did I last check in".
      const [statsRes, checkInsRes] = await Promise.all([
        api.get<UserStats>("/check-ins/stats"),
        api.get<CheckInRecord[]>("/check-ins"),
      ]);
      setStats(statsRes.data);
      setCheckIns(Array.isArray(checkInsRes.data) ? checkInsRes.data : []);
    } catch (err) {
      console.error("Failed to load stats", err);
    } finally {
      setIsStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const lastCheckIn = checkIns[0]?.date ?? null;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 border-b border-white/5 pb-8">
        <div className="space-y-2.5">
          <h1 className="text-3xl md:text-4xl font-light text-white tracking-tight">
            Welcome back, <span className="font-medium">{user?.name}</span>.
          </h1>
          <p className="text-sm text-white/40 tracking-wide font-light">
            Consistency is the path to recovery.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-hover text-black font-bold tracking-widest text-xs px-6 py-3.5 rounded-md transition-all duration-300 shadow-[0_0_15px_rgba(29,185,84,0.15)] hover:shadow-[0_0_25px_rgba(29,185,84,0.3)] active:scale-[0.98] shrink-0 self-start sm:self-auto"
        >
          <IconPlus size={16} stroke={2.5} />
          New Check-In
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Current Streak"
          icon={IconFlame}
          iconColorClass="text-orange-400"
          glowColorClass="bg-orange-500/8 group-hover:bg-orange-500/15"
          isLoading={isStatsLoading}
        >
          {stats.currentStreak}{" "}
          <span className="text-sm text-white/40">
            {stats.currentStreak === 1 ? "day" : "days"}
          </span>
        </StatCard>

        <StatCard
          label="Total Check-Ins"
          icon={IconCircleCheck}
          iconColorClass="text-brand-green"
          glowColorClass="bg-brand-green/8 group-hover:bg-brand-green/15"
          isLoading={isStatsLoading}
        >
          {stats.totalCheckIns}
        </StatCard>

        <StatCard
          label="Last Entry"
          icon={IconCalendarEvent}
          iconColorClass="text-blue-400"
          glowColorClass="bg-blue-500/8 group-hover:bg-blue-500/15"
          isLoading={isStatsLoading}
        >
          {lastCheckIn
            ? new Date(lastCheckIn).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })
            : "—"}
        </StatCard>
      </div>

      {/* Weekly Insights & Analytics */}
      <WeeklyInsights
        checkIns={checkIns}
        currentStreak={stats.currentStreak}
        isLoading={isStatsLoading}
      />

      {/* Verse of the Day */}
      <BibleVerseCard />

      {/* Check-In Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Daily Check-In"
      >
        <CheckInForm
          onSuccess={() => {
            fetchStats();
          }}
        />
      </Modal>
    </div>
  );
}
