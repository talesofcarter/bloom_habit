import { useState } from "react";
import {
  IconChevronLeft,
  IconChevronRight,
  IconCheck,
  IconLock,
} from "@tabler/icons-react";

export default function Calendar() {
  // Mock data for July 2026
  const [currentMonth] = useState("July 2026");

  // Generating a simple mock grid (0 = missed, 1 = checked in, 2 = today, null = future/empty)
  const days = [
    null,
    null,
    null,
    1,
    1,
    1,
    0,
    1,
    1,
    1,
    1,
    1,
    0,
    1,
    1,
    2,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ];

  const recentNotes = [
    {
      date: "Jul 15, 2026",
      preview:
        "Felt a strong urge this morning, but I took a walk instead. Proud of myself.",
    },
    { date: "Jul 14, 2026", preview: "A very calm day. Work kept me busy." },
    {
      date: "Jul 12, 2026",
      preview: "Struggled a bit today. Need to remember why I started this.",
    },
  ];

  return (
    <div className="space-y-12 pb-12 animate-in fade-in duration-700">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-extralight tracking-wide text-white mb-2">
          Your Progress.
        </h1>
        <p className="text-white/50 tracking-wide text-sm">
          Consistency is the path to recovery. One day at a time.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar Grid Section */}
        <div className="lg:col-span-2 bg-white/2 border border-white/5 rounded-3xl p-8 md:p-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-light text-white tracking-widest uppercase">
              {currentMonth}
            </h2>
            <div className="flex gap-2">
              <button className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors border border-white/10">
                <IconChevronLeft size={20} className="text-white" />
              </button>
              <button className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors border border-white/10 opacity-50 cursor-not-allowed">
                <IconChevronRight size={20} className="text-white" />
              </button>
            </div>
          </div>

          {/* Days of Week */}
          <div className="grid grid-cols-7 gap-2 mb-4 text-center">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <span
                key={day}
                className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/30"
              >
                {day}
              </span>
            ))}
          </div>

          {/* Calendar Cells */}
          <div className="grid grid-cols-7 gap-2 md:gap-4">
            {days.map((status, index) => (
              <div
                key={index}
                className={`
                  aspect-square rounded-xl flex items-center justify-center transition-all duration-300
                  ${status === 1 ? "bg-brand-green/10 border border-brand-green/30 text-brand-green shadow-[inset_0_0_15px_rgba(29,185,84,0.1)]" : ""}
                  ${status === 0 ? "bg-white/5 border border-white/5 text-white/20" : ""}
                  ${status === 2 ? "bg-white/10 border-2 border-brand-green text-white shadow-[0_0_20px_rgba(29,185,84,0.2)] scale-105 relative" : ""}
                  ${status === null ? "bg-transparent border border-white/2" : ""}
                `}
              >
                {status !== null && (
                  <span
                    className={`text-sm md:text-base font-medium ${status === 2 ? "font-bold" : ""}`}
                  >
                    {index - 2 > 0 ? index - 2 : ""}
                  </span>
                )}
                {/* Indicator for today */}
                {status === 2 && (
                  <div className="absolute -bottom-2 w-1.5 h-1.5 bg-brand-green rounded-full animate-pulse" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* History / Recent Check-ins */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <IconLock size={18} className="text-white/40" />
            <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-white/50">
              Private History
            </h3>
          </div>

          <div className="flex flex-col gap-4">
            {recentNotes.map((note, i) => (
              <div
                key={i}
                className="bg-white/2 border border-white/5 hover:bg-white/4 hover:border-white/10 transition-all duration-300 rounded-2xl p-6 cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold tracking-widest uppercase text-brand-green">
                    {note.date}
                  </span>
                  <IconCheck
                    size={16}
                    className="text-brand-green/50 group-hover:text-brand-green transition-colors"
                  />
                </div>
                <p className="text-sm text-white/70 leading-relaxed line-clamp-3 group-hover:text-white transition-colors">
                  {note.preview}
                </p>
              </div>
            ))}
          </div>

          <button className="w-full py-4 text-xs font-bold tracking-widest uppercase text-white/50 hover:text-white border border-white/5 hover:border-white/20 hover:bg-white/2 rounded-2xl transition-all duration-300">
            View All Entries
          </button>
        </div>
      </div>
    </div>
  );
}
