import { IconTrophy } from "@tabler/icons-react";
import type { Milestone } from "../types/stats";

interface BadgeProps {
  milestone: Milestone;
}

export default function Badge({ milestone }: BadgeProps) {
  const { title, description, earned } = milestone;

  return (
    <div
      className={`p-4 rounded-2xl border transition-all duration-500 ${
        earned
          ? "bg-brand-green/10 border-brand-green/30 shadow-[0_0_15px_rgba(29,185,84,0.1)]"
          : "bg-white/3 border-white/5 opacity-50"
      }`}
    >
      <div className="flex items-center gap-3 mb-2">
        <IconTrophy
          size={20}
          className={earned ? "text-brand-green" : "text-white/20"}
          stroke={earned ? 2 : 1.5}
        />
        <h4
          className={`text-sm font-bold tracking-wide ${earned ? "text-white" : "text-white/30"}`}
        >
          {title}
        </h4>
      </div>
      <p
        className={`text-[10px] tracking-wide ${earned ? "text-white/60" : "text-white/20"}`}
      >
        {description}
      </p>
    </div>
  );
}
