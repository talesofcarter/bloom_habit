import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { isAxiosError } from "axios";
import { IconBook2 } from "@tabler/icons-react";
import SkeletonLoader from "../components/SkeletonLoader";
import InlineNotice from "../components/InlineNotice";
import VerseDisplay from "../components/VerseDisplay";
import type { DailyVerse } from "../types/verse";

export default function Verses() {
  const [verses, setVerses] = useState<DailyVerse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (isLoading) {
    return (
      <div className="space-y-8 max-w-3xl mx-auto pb-16 w-full animate-in fade-in duration-500 mt-4">
        <div className="space-y-3">
          <SkeletonLoader className="h-10 w-56 rounded-lg" />
          <SkeletonLoader className="h-4 w-72 rounded-md" />
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="border border-white/5 rounded-3xl p-6 md:p-8 space-y-3"
          >
            <SkeletonLoader className="h-4 w-24 rounded-md" />
            <SkeletonLoader className="h-5 w-full rounded-md" />
            <SkeletonLoader className="h-5 w-2/3 rounded-md" />
          </div>
        ))}
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

      {verses.length === 0 && !error ? (
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
        <div className="space-y-6">
          {verses.map((verse) => (
            <div
              key={verse.id}
              className="bg-white/3 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl relative overflow-hidden"
            >
              <div className="absolute -right-16 -bottom-16 w-40 h-40 bg-brand-green/5 rounded-full blur-[80px] pointer-events-none" />
              <div className="relative z-10">
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
