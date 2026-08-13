import type { ReactNode } from "react";
import LogoMark from "./LogoMark";

interface AuthLayoutProps {
  tagline: string;
  children: ReactNode;
}

export default function AuthLayout({ tagline, children }: AuthLayoutProps) {
  return (
    <div className="h-screen w-full bg-bg-base p-4 md:p-6 overflow-hidden flex items-center justify-center">
      <div className="w-full h-full border border-white/10 rounded-4xl flex flex-col lg:flex-row relative overflow-hidden bg-bg-base shadow-2xl">
        {/* Left Side - Brand & Atmosphere */}
        <div className="hidden lg:flex w-1/2 h-full relative flex-col items-center justify-center border-r border-white/5">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-175 h-175 bg-brand-green/10 rounded-full blur-[130px] pointer-events-none" />

          <div className="relative z-10 text-center px-8">
            <div className="flex flex-col items-center justify-center mb-6 select-none">
              <LogoMark className="w-16 h-16 md:w-20 md:h-20 mb-4 drop-shadow-[0_0_15px_rgba(29,185,84,0.3)]" />
              <span className="text-5xl font-extralight tracking-[0.2em] text-white uppercase leading-none ml-2">
                Bloom
              </span>
              <span className="text-xs font-bold tracking-[0.5em] text-brand-green uppercase mt-2 ml-1">
                Habit
              </span>
            </div>

            <p className="text-base font-light text-white/60 tracking-wide max-w-sm mt-2">
              {tagline}
            </p>
          </div>
        </div>

        {/* Right Side - Interactive Form */}
        <div className="w-full lg:w-1/2 h-full flex flex-col items-center justify-center px-4 md:px-8 relative z-10 overflow-y-auto py-8">
          <div className="flex lg:hidden flex-col items-center justify-center mb-6 select-none">
            <span className="text-4xl font-extralight tracking-[0.2em] text-white uppercase leading-none ml-2">
              Bloom
            </span>
            <span className="text-[10px] font-bold tracking-[0.5em] text-brand-green uppercase mt-2 ml-1">
              Habit
            </span>
          </div>

          <div className="w-full max-w-md relative z-10">{children}</div>
        </div>
      </div>
    </div>
  );
}
