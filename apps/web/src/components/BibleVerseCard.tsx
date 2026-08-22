import { useDailyVerse } from "../hooks/useDailyVerse";
import SkeletonLoader from "./SkeletonLoader";
import InlineNotice from "./InlineNotice";
import VerseDisplay from "./VerseDisplay";

export default function BibleVerseCard() {
  const { verse, isLoading, error } = useDailyVerse();

  return (
    <div className="relative bg-white/3 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl overflow-hidden">
      <div className="absolute -left-10 -top-10 w-48 h-48 bg-brand-green/5 rounded-full blur-[90px] pointer-events-none" />

      <div className="relative z-10">
        <h3 className="text-[10px] font-semibold tracking-[0.3em] text-white/30 uppercase mb-4">
          Verse of the Day
        </h3>

        {isLoading ? (
          <div className="space-y-3">
            <SkeletonLoader className="h-5 w-full rounded-md" />
            <SkeletonLoader className="h-5 w-4/5 rounded-md" />
            <SkeletonLoader className="h-3 w-32 rounded-md mt-3" />
          </div>
        ) : error || !verse ? (
          <InlineNotice variant="notice">
            {error ?? "No verse available right now."}
          </InlineNotice>
        ) : (
          <VerseDisplay verse={verse} />
        )}
      </div>
    </div>
  );
}
