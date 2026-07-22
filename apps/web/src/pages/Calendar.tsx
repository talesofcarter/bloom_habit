import { useState, useEffect, useMemo } from "react";
import { api } from "../lib/api";
import {
  IconCalendarEvent,
  IconChevronLeft,
  IconChevronRight,
  IconEdit,
} from "@tabler/icons-react";
import { isAxiosError } from "axios";
import SkeletonLoader from "../components/SkeletonLoader";

interface CheckIn {
  id: string;
  title: string;
  note: string;
  date: string;
  createdAt: string;
}

export default function Calendar() {
  // Data State
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editNote, setEditNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 7; // Increased slightly for the leaner layout

  // Calendar Grid State
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get("/check-ins");
        if (Array.isArray(response.data)) {
          setCheckIns(response.data);
        } else {
          setError("Received unexpected data format from the server.");
          setCheckIns([]);
        }
      } catch (err: unknown) {
        if (isAxiosError(err) && err.response?.data?.error) {
          setError(err.response.data.error);
        } else {
          setError("Failed to load your journey history.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // --- Edit Handlers ---
  const handleStartEdit = (entry: CheckIn) => {
    setEditingId(entry.id);
    setEditTitle(entry.title);
    setEditNote(entry.note);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditNote("");
  };

  const handleSaveEdit = async (id: string) => {
    if (!editTitle.trim() || !editNote.trim()) {
      setError("Title and note cannot be empty.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const response = await api.put(`/check-ins/${id}`, {
        title: editTitle,
        note: editNote,
      });

      setCheckIns((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, ...response.data } : item,
        ),
      );
      setEditingId(null);
    } catch (err: unknown) {
      if (isAxiosError(err) && err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Failed to update note.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const safeCheckIns = useMemo(() => {
    return Array.isArray(checkIns) ? checkIns : [];
  }, [checkIns]);

  const totalPages = Math.ceil(safeCheckIns.length / ITEMS_PER_PAGE);
  const paginatedCheckIns = safeCheckIns.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const checkInDateSet = useMemo(() => {
    const dates = new Set<string>();
    safeCheckIns.forEach((entry) => {
      if (entry.date) {
        const dateObj = new Date(entry.date);
        const dateString = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}-${String(dateObj.getDate()).padStart(2, "0")}`;
        dates.add(dateString);
      }
    });
    return dates;
  }, [safeCheckIns]);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const handlePrevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  // --- Flat, Editorial SkeletonLoader Loader ---
  if (isLoading) {
    return (
      <div className="space-y-12 max-w-3xl mx-auto pb-16 w-full animate-in fade-in duration-500 mt-4">
        <div className="space-y-3">
          <SkeletonLoader className="h-10 w-48 rounded-lg" />
          <SkeletonLoader className="h-4 w-64 rounded-md" />
        </div>

        <div className="border border-white/5 rounded-2xl p-6">
          <div className="flex justify-between mb-6">
            <SkeletonLoader className="h-6 w-32 rounded-md" />
            <SkeletonLoader className="h-6 w-16 rounded-md" />
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }).map((_, i) => (
              <SkeletonLoader key={i} className="h-10 rounded-lg" />
            ))}
          </div>
        </div>

        <div className="space-y-10 pl-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="space-y-3 border-l border-white/10 pl-6 py-1"
            >
              <SkeletonLoader className="h-4 w-24 rounded-md mb-4" />
              <SkeletonLoader className="h-6 w-3/4 rounded-md" />
              <SkeletonLoader className="h-4 w-full rounded-md" />
              <SkeletonLoader className="h-4 w-5/6 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out max-w-3xl mx-auto pb-24 mt-4 w-full">
      {/* Notion-Style Header */}
      <div className="space-y-2 border-b border-white/5 pb-8">
        <h1 className="text-4xl font-semibold text-white tracking-tight">
          Journey
        </h1>
        <p className="text-sm text-white/40 tracking-wide font-light">
          Your recorded history and daily reflections.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Sleek, Minimal Calendar Grid */}
      <div className="border border-white/5 rounded-2xl p-6 md:p-8 bg-[#0a0a0a]">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-medium text-white tracking-wide">
            {currentMonth.toLocaleString("default", { month: "long" })} {year}
          </h2>
          <div className="flex gap-1">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/50 hover:text-white"
            >
              <IconChevronLeft size={20} stroke={1.5} />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/50 hover:text-white"
            >
              <IconChevronRight size={20} stroke={1.5} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2">
          {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
            <div
              key={i}
              className="text-center text-[10px] font-semibold text-white/30"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 md:gap-2">
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="h-10 md:h-12"></div>
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const hasCheckIn = checkInDateSet.has(dateString);

            return (
              <div
                key={day}
                className={`
                  flex flex-col items-center justify-center h-10 md:h-12 rounded-xl text-sm transition-all duration-300 w-full relative
                  ${hasCheckIn ? "text-white font-medium bg-white/5" : "text-white/30 hover:bg-white/2"}
                `}
              >
                {day}
                {hasCheckIn && (
                  <div className="absolute bottom-2 w-1 h-1 rounded-full bg-brand-green"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Notion-like Timeline */}
      <div className="relative">
        {safeCheckIns.length === 0 && !error ? (
          <div className="text-center py-24 border-t border-white/5">
            <IconCalendarEvent
              size={32}
              className="mx-auto text-white/10 mb-4"
              stroke={1}
            />
            <h3 className="text-white/60 font-medium text-sm">
              No entries yet
            </h3>
          </div>
        ) : (
          <div className="space-y-12">
            {paginatedCheckIns.map((entry) => {
              const entryDate = entry.date ? new Date(entry.date) : new Date();
              const isEditing = editingId === entry.id;

              return (
                <div
                  key={entry.id}
                  className="group/block relative pl-6 md:pl-8 border-l border-white/10 hover:border-white/20 transition-colors duration-300"
                >
                  {/* Hover Action Menu */}
                  {!isEditing && (
                    <div className="absolute -left-4.25 top-0 opacity-0 group-hover/block:opacity-100 transition-opacity bg-[#0a0a0a] py-1">
                      <button
                        onClick={() => handleStartEdit(entry)}
                        className="p-1.5 text-white/30 hover:text-white bg-white/5 hover:bg-white/10 rounded-md border border-white/5"
                        title="Edit block"
                      >
                        <IconEdit size={14} stroke={1.5} />
                      </button>
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="text-[11px] font-semibold tracking-widest uppercase text-white/30 mb-3 flex items-center gap-2">
                    {entryDate.toLocaleDateString(undefined, {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>

                  {/* EDIT MODE (Borderless, Notion-style inputs) */}
                  {isEditing ? (
                    <div className="space-y-3 animate-in fade-in duration-300 -ml-3">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        disabled={isSaving}
                        placeholder="Untitled"
                        className="w-full bg-transparent px-3 py-1 text-xl font-semibold text-white placeholder-white/20 outline-none focus:bg-white/5 rounded-lg transition-colors"
                        autoFocus
                      />
                      <textarea
                        value={editNote}
                        onChange={(e) => setEditNote(e.target.value)}
                        disabled={isSaving}
                        rows={3}
                        placeholder="Empty note..."
                        className="w-full bg-transparent px-3 py-2 text-white/70 text-base font-light leading-relaxed placeholder-white/20 outline-none focus:bg-white/5 rounded-lg resize-none transition-colors"
                      />
                      <div className="flex items-center gap-2 pl-3 pt-2">
                        <button
                          onClick={() => handleSaveEdit(entry.id)}
                          disabled={isSaving}
                          className="flex items-center gap-1.5 text-brand-green hover:text-brand-green/80 text-xs font-semibold tracking-wide transition-colors"
                        >
                          {isSaving ? "Saving..." : "Save edits"}
                        </button>
                        <span className="text-white/20">•</span>
                        <button
                          onClick={handleCancelEdit}
                          disabled={isSaving}
                          className="flex items-center gap-1.5 text-white/40 hover:text-white text-xs font-semibold tracking-wide transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* DISPLAY MODE */
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2 tracking-tight">
                        {entry.title || "Untitled"}
                      </h3>
                      {entry.note && (
                        <p className="text-white/60 leading-relaxed text-base font-light whitespace-pre-wrap">
                          {entry.note}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Notion-style minimal pagination */}
            {totalPages > 1 && (
              <div className="pt-8 mt-8 border-t border-white/5 flex items-center justify-between text-sm">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="text-white/40 hover:text-white disabled:opacity-20 transition-colors font-medium"
                >
                  &larr; Newer
                </button>
                <span className="text-white/30 text-xs font-medium">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="text-white/40 hover:text-white disabled:opacity-20 transition-colors font-medium"
                >
                  Older &rarr;
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
