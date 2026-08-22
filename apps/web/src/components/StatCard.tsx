import type { Icon } from "@tabler/icons-react";
import type { ReactNode } from "react";
import SkeletonLoader from "./SkeletonLoader";

interface StatCardProps {
  label: string;
  icon: Icon;
  iconColorClass: string;
  glowColorClass: string;
  isLoading: boolean;
  children: ReactNode;
}

export default function StatCard({
  label,
  icon: IconComponent,
  iconColorClass,
  glowColorClass,
  isLoading,
  children,
}: StatCardProps) {
  return (
    <div className="group bg-white/3 border border-white/10 rounded-3xl p-6 backdrop-blur-xl flex items-center gap-4 relative overflow-hidden transition-all duration-300 hover:bg-white/5 hover:border-white/15">
      <div
        className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-[60px] pointer-events-none transition-all duration-500 ${glowColorClass}`}
      />
      <div className="w-11 h-11 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shrink-0 relative z-10">
        <IconComponent size={20} className={iconColorClass} stroke={1.75} />
      </div>
      <div className="flex-1 relative z-10">
        <p className="text-[10px] font-semibold tracking-[0.18em] text-white/40 uppercase mb-1.5">
          {label}
        </p>
        {isLoading ? (
          <SkeletonLoader className="h-7 w-20 rounded-lg" />
        ) : (
          <p className="text-2xl font-light text-white tracking-tight">
            {children}
          </p>
        )}
      </div>
    </div>
  );
}
