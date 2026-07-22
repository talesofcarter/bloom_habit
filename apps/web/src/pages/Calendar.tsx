import { useState, useEffect, useMemo } from "react";
import { api } from "../lib/api";
import {
  IconCalendarEvent,
  IconQuote,
  IconChevronLeft,
  IconChevronRight,
  IconEdit,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import { isAxiosError } from "axios";

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
  const ITEMS_PER_PAGE = 5;

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

      // Update the local state with the edited data
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

  // Pagination Logic
  const totalPages = Math.ceil(safeCheckIns.length / ITEMS_PER_PAGE);
  const paginatedCheckIns = safeCheckIns.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // Map history dates for the Calendar Grid highlight
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

  // Calendar Engine Logic
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const handlePrevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  if (isLoading) {
    // ... [KEEP YOUR EXISTING SKELETON LOADER HERE EXACTLY AS IT WAS] ...
    return (
      <div className="space-y-8 max-w-4xl mx-auto pb-12 w-full animate-in fade-in duration-500">
        <div className="space-y-3 mb-10 text-center md:text-left">
          <div className="h-10 w-64 bg-white/5 rounded-xl animate-pulse mx-auto md:mx-0"></div>
          <div className="h-4 w-48 bg-white/5 rounded-md animate-pulse mx-auto md:mx-0"></div>
        </div>
        <div className="flex flex-col gap-12 w-full">
          {/* Calendar Skeleton */}
          <div className="w-full bg-white/2 border border-white/5 rounded-4xl p-6 md:p-8">
            <div className="flex justify-between items-center mb-8">
              <div className="h-6 w-32 bg-white/10 rounded-lg animate-pulse"></div>
              <div className="flex gap-2">
                <div className="h-8 w-8 bg-white/5 rounded-full animate-pulse"></div>
                <div className="h-8 w-8 bg-white/5 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2 md:gap-4 mb-4">
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={`day-${i}`}
                  className="h-3 w-full bg-white/5 rounded-sm animate-pulse"
                ></div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2 md:gap-4">
              {Array.from({ length: 35 }).map((_, i) => (
                <div
                  key={`grid-${i}`}
                  className="h-10 md:h-14 bg-white/5 rounded-xl animate-pulse"
                ></div>
              ))}
            </div>
          </div>
          {/* Timeline Skeleton */}
          <div className="w-full relative pl-4 md:pl-8">
            <div className="absolute left-3.75 md:left-7.75 top-4 bottom-4 w-px bg-white/5"></div>
            <div className="space-y-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={`card-${i}`} className="relative group">
                  <div className="absolute -left-7 md:-left-11 top-6 w-4 h-4 bg-[#0a0a0a] border-2 border-white/10 rounded-full animate-pulse z-10"></div>
                  <div className="bg-white/2 border border-white/5 rounded-3xl p-6 md:p-8 ml-4 md:ml-6">
                    <div className="h-6 w-32 bg-white/10 rounded-lg animate-pulse mb-5"></div>
                    <div className="h-6 w-3/4 bg-white/10 rounded-md animate-pulse mb-5"></div>
                    <div className="space-y-3">
                      <div className="h-3 w-full bg-white/5 rounded-md animate-pulse"></div>
                      <div className="h-3 w-[90%] bg-white/5 rounded-md animate-pulse"></div>
                      <div className="h-3 w-[75%] bg-white/5 rounded-md animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="space-y-2 text-center md:text-left mb-10">
        <h1 className="text-3xl md:text-4xl font-light text-white tracking-wide">
          Your <span className="font-medium">Journey</span>.
        </h1>
        <p className="text-sm text-white/50 tracking-wide">
          Review your progress and consistency.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium text-center">
          {error}
        </div>
      )}

      {/* Main Layout */}
      <div className="flex flex-col gap-12 w-full">
        {/* Top: Calendar Widget */}
        <div className="w-full bg-white/3 border border-white/10 rounded-4xl p-6 md:p-8 backdrop-blur-xl shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h2 className="text-xl md:text-2xl font-medium text-white tracking-wide">
              {currentMonth.toLocaleString("default", { month: "long" })} {year}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={handlePrevMonth}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-white border border-white/10"
              >
                <IconChevronLeft size={20} stroke={1.5} />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-white border border-white/10"
              >
                <IconChevronRight size={20} stroke={1.5} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 md:gap-4 mb-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center text-[10px] md:text-xs font-bold uppercase tracking-widest text-white/40"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2 md:gap-4">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="h-12 md:h-16 rounded-xl"></div>
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const hasCheckIn = checkInDateSet.has(dateString);

              return (
                <div
                  key={day}
                  className={`
                    flex items-center justify-center h-12 md:h-16 rounded-xl text-sm md:text-base font-medium transition-all duration-300 w-full
                    ${hasCheckIn ? "bg-brand-green/20 text-brand-green border border-brand-green/30 shadow-[0_0_15px_rgba(29,185,84,0.15)]" : "bg-white/2 text-white/40 border border-white/5"}
                  `}
                >
                  {day}
                </div>
              );
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-brand-green/20 border border-brand-green/30 shadow-[0_0_10px_rgba(29,185,84,0.3)]"></div>
            <span className="text-xs text-white/50 tracking-wide uppercase font-semibold">
              Completed Check-in
            </span>
          </div>
        </div>

        {/* Bottom: Notion-like Paginated Timeline */}
        <div className="w-full relative">
          {safeCheckIns.length === 0 && !error ? (
            <div className="text-center py-20 bg-white/3 border border-white/10 rounded-4xl backdrop-blur-xl">
              <IconCalendarEvent
                size={48}
                className="mx-auto text-white/20 mb-4"
                stroke={1}
              />
              <h3 className="text-white text-lg font-medium">No entries yet</h3>
              <p className="text-white/50 text-sm mt-2">
                Your journey begins on the Home page.
              </p>
            </div>
          ) : (
            <div className="relative pl-4 md:pl-8">
              <div className="absolute left-3.75 md:left-7.75 top-4 bottom-4 w-px bg-linear-to-b from-brand-green/50 via-white/10 to-transparent"></div>

              <div className="space-y-8">
                {paginatedCheckIns.map((entry, index) => {
                  const entryDate = entry.date
                    ? new Date(entry.date)
                    : new Date();
                  const isEditing = editingId === entry.id;

                  return (
                    <div
                      key={entry.id || `timeline-entry-${index}`}
                      className="relative group/timeline"
                    >
                      {/* Timeline Node */}
                      <div className="absolute -left-7 md:-left-11 top-6 w-4 h-4 bg-[#0a0a0a] border-2 border-brand-green rounded-full z-10 group-hover/timeline:scale-125 group-hover/timeline:bg-brand-green group-hover/timeline:shadow-[0_0_15px_rgba(29,185,84,0.5)] transition-all duration-300"></div>

                      {/* Content Card */}
                      <div className="bg-white/3 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl hover:bg-white/5 transition-colors duration-300 ml-4 md:ml-6 group/card relative">
                        <div className="flex items-center justify-between mb-4">
                          <div className="bg-brand-green/10 border border-brand-green/20 px-3 py-1.5 rounded-lg text-brand-green text-xs font-bold tracking-widest uppercase">
                            {entryDate.toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </div>

                          {/* Notion-style hidden actions (Visible on hover) */}
                          {!isEditing && (
                            <button
                              onClick={() => handleStartEdit(entry)}
                              className="opacity-0 group-hover/card:opacity-100 transition-opacity p-2 text-white/40 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg"
                              title="Edit Note"
                            >
                              <IconEdit size={18} stroke={1.5} />
                            </button>
                          )}
                        </div>

                        {/* EDIT MODE */}
                        {isEditing ? (
                          <div className="space-y-4 animate-in fade-in duration-300">
                            <input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              disabled={isSaving}
                              placeholder="Note Title"
                              className="w-full bg-black/20 border border-brand-green/30 focus:border-brand-green rounded-xl px-4 py-3 text-xl font-medium text-white placeholder-white/30 outline-none transition-all disabled:opacity-50"
                            />
                            <textarea
                              value={editNote}
                              onChange={(e) => setEditNote(e.target.value)}
                              disabled={isSaving}
                              rows={4}
                              placeholder="Write your reflection..."
                              className="w-full bg-black/20 border border-brand-green/30 focus:border-brand-green rounded-xl px-4 py-3 text-white/70 leading-relaxed text-sm md:text-base font-light placeholder-white/30 outline-none resize-none transition-all disabled:opacity-50"
                            />
                            <div className="flex items-center gap-3 pt-2">
                              <button
                                onClick={() => handleSaveEdit(entry.id)}
                                disabled={isSaving}
                                className="flex items-center gap-2 bg-brand-green hover:bg-brand-green-hover text-black font-semibold text-xs tracking-widest uppercase px-5 py-2.5 rounded-lg transition-all disabled:opacity-50"
                              >
                                {isSaving ? (
                                  "Saving..."
                                ) : (
                                  <>
                                    <IconCheck size={16} stroke={2} /> Save
                                  </>
                                )}
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                disabled={isSaving}
                                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs tracking-widest uppercase px-5 py-2.5 rounded-lg transition-all disabled:opacity-50"
                              >
                                <IconX size={16} stroke={1.5} /> Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* DISPLAY MODE */
                          <div>
                            <h3 className="text-xl font-medium text-white mb-3">
                              {entry.title || "Untitled Entry"}
                            </h3>
                            {entry.note && (
                              <div className="flex gap-4 items-start">
                                <IconQuote
                                  size={24}
                                  className="text-white/20 shrink-0 mt-1"
                                  stroke={1.5}
                                />
                                <p className="text-white/70 leading-relaxed text-sm md:text-base font-light whitespace-pre-wrap">
                                  {entry.note}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Scalable Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-12 ml-4 md:ml-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/3 border border-white/10 rounded-2xl p-4 backdrop-blur-xl">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center justify-center px-6 py-3 w-full sm:w-auto text-sm font-semibold tracking-wide text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed border border-white/5"
                  >
                    Previous
                  </button>
                  <span className="text-xs font-semibold tracking-widest text-white/50 uppercase">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="flex items-center justify-center px-6 py-3 w-full sm:w-auto text-sm font-semibold tracking-wide text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed border border-white/5"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
