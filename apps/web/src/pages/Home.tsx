import { useState, useEffect, type FormEvent } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import { isAxiosError } from "axios";
import {
  IconFlame,
  IconCircleCheck,
  IconCalendarEvent,
} from "@tabler/icons-react";
import SkeletonLoader from "../components/SkeletonLoader";
import InlineNotice from "../components/InlineNotice";
import Toggle from "../components/Toggle";
import BibleVerseCard from "../components/BibleVerseCard";

interface CheckInPayload {
  title: string;
  note: string;
  isRelapse: boolean;
}

interface UserStats {
  totalCheckIns: number;
  currentStreak: number;
  lastCheckIn: string | null;
}

export default function Home() {
  const { user } = useAuth();

  // Stats State
  const [stats, setStats] = useState<UserStats>({
    totalCheckIns: 0,
    currentStreak: 0,
    lastCheckIn: null,
  });
  const [isStatsLoading, setIsStatsLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [isRelapse, setIsRelapse] = useState<boolean>(false);

  const fetchStats = async () => {
    try {
      const response = await api.get<UserStats>("/check-ins/stats");
      setStats(response.data);
    } catch (err) {
      console.error("Failed to load stats", err);
    } finally {
      setIsStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!title.trim() || !note.trim()) {
      setError("Please fill out both the title and your note.");
      return;
    }

    setIsLoading(true);

    try {
      const payload: CheckInPayload = { title, note, isRelapse };
      await api.post("/check-ins", payload);

      setSuccess(true);
      setTitle("");
      setNote("");
      fetchStats();
    } catch (err: unknown) {
      if (isAxiosError(err) && err.response) {
        setError(err.response.data.error || "Failed to save check-in.");
      } else {
        setError("An unexpected network error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-light text-white tracking-wide">
          Welcome back, <span className="font-medium">{user?.name}</span>.
        </h1>
        <p className="text-sm text-white/50 tracking-wide">
          Consistency is the path to recovery.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Streak Card */}
        <div className="group bg-white/3 border border-white/10 rounded-3xl p-6 backdrop-blur-xl flex items-center gap-4 relative overflow-hidden transition-all duration-300 hover:bg-white/5 hover:border-white/15">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-orange-500/8 rounded-full blur-[60px] pointer-events-none group-hover:bg-orange-500/15 transition-all duration-500" />
          <div className="w-11 h-11 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shrink-0 relative z-10">
            <IconFlame size={20} className="text-orange-400" stroke={1.75} />
          </div>
          <div className="flex-1 relative z-10">
            <p className="text-[10px] font-semibold tracking-[0.18em] text-white/40 uppercase mb-1.5">
              Current Streak
            </p>
            {isStatsLoading ? (
              <SkeletonLoader className="h-7 w-20 rounded-lg" />
            ) : (
              <p className="text-2xl font-light text-white tracking-tight">
                {stats.currentStreak}{" "}
                <span className="text-sm text-white/40">
                  {stats.currentStreak === 1 ? "day" : "days"}
                </span>
              </p>
            )}
          </div>
        </div>

        {/* Total Check-ins Card */}
        <div className="group bg-white/3 border border-white/10 rounded-3xl p-6 backdrop-blur-xl flex items-center gap-4 relative overflow-hidden transition-all duration-300 hover:bg-white/5 hover:border-white/15">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-brand-green/8 rounded-full blur-[60px] pointer-events-none group-hover:bg-brand-green/15 transition-all duration-500" />
          <div className="w-11 h-11 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shrink-0 relative z-10">
            <IconCircleCheck
              size={20}
              className="text-brand-green"
              stroke={1.75}
            />
          </div>
          <div className="flex-1 relative z-10">
            <p className="text-[10px] font-semibold tracking-[0.18em] text-white/40 uppercase mb-1.5">
              Total Check-Ins
            </p>
            {isStatsLoading ? (
              <SkeletonLoader className="h-7 w-14 rounded-lg" />
            ) : (
              <p className="text-2xl font-light text-white tracking-tight">
                {stats.totalCheckIns}
              </p>
            )}
          </div>
        </div>

        {/* Last Check-in Card */}
        <div className="group bg-white/3 border border-white/10 rounded-3xl p-6 backdrop-blur-xl flex items-center gap-4 relative overflow-hidden transition-all duration-300 hover:bg-white/5 hover:border-white/15">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/8 rounded-full blur-[60px] pointer-events-none group-hover:bg-blue-500/15 transition-all duration-500" />
          <div className="w-11 h-11 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shrink-0 relative z-10">
            <IconCalendarEvent
              size={20}
              className="text-blue-400"
              stroke={1.75}
            />
          </div>
          <div className="flex-1 relative z-10">
            <p className="text-[10px] font-semibold tracking-[0.18em] text-white/40 uppercase mb-1.5">
              Last Entry
            </p>
            {isStatsLoading ? (
              <SkeletonLoader className="h-7 w-24 rounded-lg" />
            ) : (
              <p className="text-2xl font-light text-white tracking-tight">
                {stats.lastCheckIn
                  ? new Date(stats.lastCheckIn).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })
                  : "—"}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Verse of the Day */}
      <BibleVerseCard />

      {/* Check-In Form */}
      <div className="bg-white/3 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-green/8 rounded-full blur-[90px] pointer-events-none" />

        <h2 className="text-lg font-medium text-white mb-6 flex items-center gap-2 relative z-10">
          Daily Check-In
          <div className="h-px bg-white/10 flex-1 ml-4" />
        </h2>

        {success ? (
          <div className="relative z-10 bg-brand-green/10 border border-brand-green/20 rounded-2xl p-8 text-center space-y-3">
            <div className="w-12 h-12 bg-brand-green/20 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-green">
              <IconCircleCheck size={24} stroke={2} />
            </div>
            <h3 className="text-white font-medium">Check-in complete!</h3>
            <p className="text-white/60 text-sm">
              Your progress for today has been securely recorded.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            {error && <InlineNotice variant="notice">{error}</InlineNotice>}

            <div>
              <label
                htmlFor="checkin-title"
                className="block text-xs font-semibold tracking-widest text-white/70 uppercase mb-2"
              >
                Title
              </label>
              <input
                id="checkin-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isLoading}
                placeholder="e.g., Day 12: Feeling stronger"
                className="w-full bg-black/20 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-white/30 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all duration-300 disabled:opacity-50"
              />
            </div>

            <div>
              <label
                htmlFor="checkin-note"
                className="block text-xs font-semibold tracking-widest text-white/70 uppercase mb-2"
              >
                Notes
              </label>
              <textarea
                id="checkin-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                disabled={isLoading}
                placeholder="Reflect on your day, your triggers, or your victories…"
                rows={4}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-white/30 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all duration-300 resize-none disabled:opacity-50"
              />
            </div>

            <div className="pt-2 pb-4 border-b border-white/5">
              <Toggle
                checked={isRelapse}
                onChange={setIsRelapse}
                label="I experienced a setback today"
                helperText="Be honest. Your notes will help you identify triggers."
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-brand-green hover:bg-brand-green-hover text-black font-bold tracking-widest uppercase text-xs px-8 py-4 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(29,185,84,0.15)] hover:shadow-[0_0_25px_rgba(29,185,84,0.3)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Saving…" : "Submit Check-In"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
