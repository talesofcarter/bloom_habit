import { useEffect, useState, useMemo } from "react";
import { api } from "../lib/api";
import { isAxiosError } from "axios";
import {
  IconBook2,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import SkeletonLoader from "../components/SkeletonLoader";
import InlineNotice from "../components/InlineNotice";
import VerseDisplay from "../components/VerseDisplay";
import type { DailyVerse } from "../types/verse";

const ITEMS_PER_PAGE = 5;

export default function Verses() {
  const [verses, setVerses] = useState<DailyVerse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchVerses = async () => {
      try {
        const response = await api.get<DailyVerse[]>("/verses");
        setVerses(response.data);
      } catch (err: unknown) {
        if (isAxiosError(err) && err.response?.data?.error) {
          setError(err.response.data.error);
        } else {
          setError("Failed to load your verse archive.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchVerses();
  }, []);

  const safeVerses = useMemo(
    () => (Array.isArray(verses) ? verses : []),
    [verses],
  );

  const totalPages = Math.max(1, Math.ceil(safeVerses.length / ITEMS_PER_PAGE));
  const paginatedVerses = safeVerses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  if (isLoading) {
    return (
      <div className="space-y-8 max-w-3xl mx-auto pb-16 w-full animate-in fade-in duration-500 mt-4">
        <div className="space-y-3">
          <SkeletonLoader className="h-10 w-56 rounded-lg" />
          <SkeletonLoader className="h-4 w-72 rounded-md" />
        </div>
        <div className="border-t border-white/5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="py-6 space-y-3 border-b border-white/5">
              <SkeletonLoader className="h-4 w-24 rounded-md" />
              <SkeletonLoader className="h-5 w-full rounded-md" />
              <SkeletonLoader className="h-5 w-2/3 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out max-w-3xl mx-auto pb-24 mt-4 w-full">
      <div className="space-y-2 border-b border-white/5 pb-8">
        <h1 className="text-4xl font-semibold text-white tracking-tight flex items-center gap-3">
          <IconBook2 size={30} className="text-brand-green" stroke={1.5} />
          Verse Archive
        </h1>
        <p className="text-sm text-white/40 tracking-wide font-light">
          Every word spoken over your journey, one day at a time.
        </p>
      </div>

      {error && <InlineNotice variant="notice">{error}</InlineNotice>}

      {safeVerses.length === 0 && !error ? (
        <div className="text-center py-24 border border-white/5 rounded-3xl">
          <IconBook2
            size={32}
            className="mx-auto text-white/10 mb-4"
            stroke={1}
          />
          <h3 className="text-white/60 font-medium text-sm">No verses yet</h3>
          <p className="text-white/30 text-xs mt-1">
            Come back tomorrow for your first entry.
          </p>
        </div>
      ) : (
        <div>
          {/* Minimalist, Notion-style document list — thin dividers instead
              of heavy glass cards, so scanning many entries stays light. */}
          <div className="divide-y divide-white/5 border-t border-white/5">
            {paginatedVerses.map((verse) => (
              <div key={verse.id} className="py-6 md:py-7">
                <VerseDisplay
                  verse={verse}
                  dateLabel={new Date(verse.date).toLocaleDateString(
                    undefined,
                    {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    },
                  )}
                />
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pt-8 mt-2 border-t border-white/5 flex items-center justify-between text-sm">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 text-white/40 hover:text-white disabled:opacity-20 transition-colors font-medium"
              >
                <IconChevronLeft size={16} stroke={1.75} />
                Newer
              </button>
              <span className="text-white/30 text-xs font-medium">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 text-white/40 hover:text-white disabled:opacity-20 transition-colors font-medium"
              >
                Older
                <IconChevronRight size={16} stroke={1.75} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
