import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import {
  IconHome,
  IconCalendar,
  IconSettings,
  IconLogout,
  IconMenu2,
  IconX,
} from "@tabler/icons-react";

export default function DashboardLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/", icon: IconHome },
    { name: "Progress", path: "/calendar", icon: IconCalendar },
    { name: "Settings", path: "/settings", icon: IconSettings },
  ];

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden relative">
      {/* Mobile Overlay */}
      <div
        className={`
          fixed inset-0 bg-black/60 backdrop-blur-md z-40 md:hidden 
          transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Sidebar - Fixed on mobile, relative on desktop */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-50 w-70 border-r border-white/5 flex flex-col bg-[#0a0a0a]/95 backdrop-blur-3xl
        transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
        md:relative md:translate-x-0
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* Inline Typographic Logo + Mobile Close Button */}
        <div className="p-8 md:p-10 pb-10 md:pb-12 flex items-center justify-between select-none">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extralight tracking-[0.2em] uppercase text-white">
              Bloom
            </span>
            <span className="text-[10px] font-bold tracking-[0.3em] text-brand-green uppercase">
              Habit
            </span>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden text-white/40 hover:text-white transition-colors p-2 -mr-2"
          >
            <IconX size={22} stroke={1.5} />
          </button>
        </div>

        <nav className="flex-1 px-6 space-y-3 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-medium transition-all duration-500 group border ${
                  isActive
                    ? "text-white bg-white/8 border-white/10 shadow-[0_8px_16px_rgba(0,0,0,0.2)]"
                    : "text-white/50 border-transparent hover:text-white hover:bg-white/3"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    size={22}
                    stroke={1.5}
                    className={
                      isActive
                        ? "text-brand-green drop-shadow-[0_0_10px_rgba(29,185,84,0.4)]"
                        : "text-white/40 group-hover:text-white/80 transition-all duration-300"
                    }
                  />
                  <span className="tracking-wide uppercase text-xs font-semibold">
                    {item.name}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-6 md:p-8 border-t border-white/5">
          <button className="flex items-center gap-4 px-5 py-4 w-full rounded-2xl text-sm font-medium text-white/50 hover:text-white hover:bg-white/3 transition-all duration-500 group border border-transparent">
            <IconLogout
              size={22}
              stroke={1.5}
              className="text-white/40 group-hover:text-white/80 transition-all duration-300"
            />
            <span className="tracking-wide uppercase text-xs font-semibold">
              Log Out
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content Area Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        <header className="md:hidden flex items-center justify-between p-6 border-b border-white/5 bg-[#0a0a0a]/90 backdrop-blur-2xl z-30 sticky top-0">
          <div className="flex items-baseline gap-2 select-none">
            <span className="text-xl font-extralight tracking-[0.2em] uppercase text-white">
              Bloom
            </span>
            <span className="text-[8px] font-bold tracking-[0.2em] text-brand-green uppercase">
              Habit
            </span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="text-white/60 hover:text-white transition-colors"
          >
            <IconMenu2 size={24} stroke={1.5} />
          </button>
        </header>

        {/* Scrollable Main View */}
        <main className="flex-1 relative overflow-y-auto">
          <div className="absolute inset-0 bg-linear-to-b from-white/2 to-transparent h-72 pointer-events-none"></div>

          <div className="p-6 md:p-12 max-w-5xl mx-auto relative z-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
