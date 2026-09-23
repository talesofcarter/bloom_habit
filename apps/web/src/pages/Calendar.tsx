import { useState, useEffect, useMemo, useCallback } from "react";
import { api } from "../lib/api";
import {
  IconCalendarEvent,
  IconChevronLeft,
  IconChevronRight,
  IconEdit,
} from "@tabler/icons-react";
import { isAxiosError } from "axios";
import SkeletonLoader from "../components/SkeletonLoader";
import InlineNotice from "../components/InlineNotice";
import Modal from "../components/Modal";
import CheckInForm, { type ExistingCheckIn } from "../components/CheckInForm";

interface CheckIn {
  id: string;
  title: string;
  note: string;
  date: string;
  createdAt: string;
  isRelapse: boolean;
}

export default function Calendar() {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editNote, setEditNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

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

  const totalPages = Math.ceil(safeCheckIns.length / itemsPerPage);
  const paginatedCheckIns = safeCheckIns.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const checkInByDate = useMemo(() => {
    const map = new Map<string, CheckIn>();
    safeCheckIns.forEach((entry) => {
      if (entry.date) {
        const dateObj = new Date(entry.date);
        const dateString = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}-${String(dateObj.getDate()).padStart(2, "0")}`;
        map.set(dateString, entry);
      }
    });
    return map;
  }, [safeCheckIns]);

  const checkInDateSet = useMemo(
    () => new Set(checkInByDate.keys()),
    [checkInByDate],
  );

  const todayStart = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const handlePrevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  const handleDayClick = (day: number, isFuture: boolean) => {
    if (isFuture) return;
    const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setSelectedDate(dateString);
  };

  const selectedEntry: CheckIn | null = selectedDate
    ? (checkInByDate.get(selectedDate) ?? null)
    : null;

  const selectedEntryForForm: ExistingCheckIn | null = selectedEntry
    ? {
        id: selectedEntry.id,
        title: selectedEntry.title,
        note: selectedEntry.note,
        isRelapse: selectedEntry.isRelapse,
      }
    : null;

  const selectedDateLabel = selectedDate
    ? new Date(`${selectedDate}T00:00:00`).toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

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
          Your recorded history and daily reflections. Click any past date below
          to add or update an entry.
        </p>
      </div>

      {error && (
        <InlineNotice variant="notice" className="text-sm">
          {error}
        </InlineNotice>
      )}

      {/* Sleek, Minimal Calendar Grid */}
      <div className="border border-white/5 rounded-2xl p-6 md:p-8 bg-bg-base">
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
            const cellDate = new Date(year, month, day);
            const isFuture = cellDate.getTime() > todayStart.getTime();

            return (
              <button
                key={day}
                type="button"
                onClick={() => handleDayClick(day, isFuture)}
                disabled={isFuture}
                title={
                  isFuture
                    ? undefined
                    : hasCheckIn
                      ? "View or edit this day's entry"
                      : "Add an entry for this day"
                }
                className={`
                  flex flex-col items-center justify-center h-10 md:h-12 rounded-xl text-sm transition-all duration-300 w-full relative
                  ${hasCheckIn ? "text-white font-medium bg-white/5" : "text-white/30"}
                  ${
                    isFuture
                      ? "opacity-30 cursor-not-allowed"
                      : "cursor-pointer hover:bg-white/8 hover:text-white"
                  }
                `}
              >
                {day}
                {hasCheckIn && (
                  <div className="absolute bottom-2 w-1 h-1 rounded-full bg-brand-green"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative ml-2 md:ml-4">
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
          <div>
            <div className="relative border-l border-white/10 space-y-12 pb-4">
              {paginatedCheckIns.map((entry) => {
                const entryDate = entry.date
                  ? new Date(entry.date)
                  : new Date();
                const isEditing = editingId === entry.id;

                return (
                  <div
                    key={entry.id}
                    className="group/block relative pl-8 md:pl-10"
                  >
                    {/* Timeline Node (The dot on the line) */}
                    <div
                      className={`absolute left-[-5.5px] top-1.5 w-2.5 h-2.5 rounded-full border-[1.5px] bg-bg-base z-10 transition-all duration-300 ${
                        entry.isRelapse
                          ? "border-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.4)]"
                          : "border-white/20 group-hover/block:border-brand-green group-hover/block:shadow-[0_0_10px_rgba(29,185,84,0.4)]"
                      }`}
                    ></div>

                    {/* Metadata & Labels */}
                    <div className="text-[11px] font-semibold tracking-widest uppercase mb-3 flex items-center gap-3">
                      <span className="text-white/30">
                        {entryDate.toLocaleDateString(undefined, {
                          weekday: "long",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      {entry.isRelapse && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-white/10"></span>
                          <span className="text-orange-500/80">Setback</span>
                        </>
                      )}
                    </div>

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
                      <div className="relative">
                        <div className="flex items-start justify-between gap-4">
                          <h3
                            className={`text-xl font-semibold mb-2 tracking-tight ${
                              entry.isRelapse ? "text-white/90" : "text-white"
                            }`}
                          >
                            {entry.title || "Untitled"}
                          </h3>

                          {/* Hover Action Menu (Now on the right side) */}
                          {!isEditing && (
                            <button
                              onClick={() => handleStartEdit(entry)}
                              className="opacity-0 group-hover/block:opacity-100 p-1.5 text-white/30 hover:text-white bg-white/5 hover:bg-white/10 rounded-md transition-all shrink-0 mt-0.5"
                              title="Edit block"
                            >
                              <IconEdit size={16} stroke={1.5} />
                            </button>
                          )}
                        </div>

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
            </div>

            {totalPages > 1 && (
              <div className="pt-8 mt-4 border-t border-white/5 flex items-center justify-between text-sm">
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

      {/* Backfill / Edit-from-calendar Modal */}
      <Modal
        isOpen={selectedDate !== null}
        onClose={() => setSelectedDate(null)}
        title={selectedDateLabel || "Check-In"}
      >
        {selectedDate && (
          <div className="space-y-6">
            <p className="text-xs text-white/40 tracking-wide">
              {selectedEntryForForm
                ? "Update the details you recorded for this day."
                : "Add an entry for this day. It's never too late to log your progress."}
            </p>
            <CheckInForm
              date={selectedDate}
              existingCheckIn={selectedEntryForForm}
              onSuccess={() => fetchHistory()}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
