import { useState } from "react";
import { IconQuote } from "@tabler/icons-react";
import VerseVersionToggle from "./VerseVersionToggle";
import type { DailyVerse } from "../types/verse";

interface VerseDisplayProps {
  verse: DailyVerse;
  dateLabel?: string;
}

export default function VerseDisplay({ verse, dateLabel }: VerseDisplayProps) {
  const [version, setVersion] = useState<"amp" | "niv">("amp");
  const translation = verse[version];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        {dateLabel ? (
          <span className="text-[10px] font-semibold tracking-[0.2em] text-white/30 uppercase">
            {dateLabel}
          </span>
        ) : (
          <span />
        )}
        <VerseVersionToggle value={version} onChange={setVersion} />
      </div>

      <div className="flex items-start gap-4 md:gap-5">
        <IconQuote
          size={26}
          className="text-brand-green/40 shrink-0 mt-0.5"
          stroke={1.5}
        />
        <div className="space-y-2.5">
          <p className="text-lg md:text-xl font-light text-white/85 leading-relaxed font-bricolage">
            "{translation.text}"
          </p>
          <p className="text-[11px] font-semibold tracking-[0.2em] text-brand-green/70 font-bricolage">
            {translation.reference}{" "}
            <span className="text-white/25 normal-case tracking-normal">
              ({version.toUpperCase()})
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
