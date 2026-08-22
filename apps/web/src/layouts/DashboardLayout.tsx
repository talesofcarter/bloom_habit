import { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  IconHome,
  IconCalendar,
  IconSettings,
  IconLogout,
  IconMenu2,
  IconX,
  IconTrophy,
  IconChevronsLeft,
  IconBook2,
} from "@tabler/icons-react";
import LogoMark from "../components/LogoMark";

const SIDEBAR_COLLAPSE_KEY = "bloom:sidebar-collapsed";

export default function DashboardLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem(SIDEBAR_COLLAPSE_KEY) === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_COLLAPSE_KEY, String(isCollapsed));
    } catch {
      // Non-critical: collapse state just won't persist across sessions.
    }
  }, [isCollapsed]);

  const { logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", path: "/", icon: IconHome },
    { name: "Progress", path: "/calendar", icon: IconCalendar },
    { name: "Library", path: "/verses", icon: IconBook2 },
    { name: "Achievements", path: "/achievements", icon: IconTrophy },
    { name: "Settings", path: "/settings", icon: IconSettings },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-bg-base text-white overflow-hidden relative">
      {/* Mobile Overlay */}
      <div
        className={`
          fixed inset-0 bg-black/60 backdrop-blur-md z-40 md:hidden 
          transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col bg-bg-base/95 backdrop-blur-3xl border-r border-white/5
          transition-[transform,width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
          md:relative md:translate-x-0
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          ${isCollapsed ? "md:w-24" : "md:w-72"}
          w-72
        `}
      >
        {/* Mobile Close Button */}
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="md:hidden absolute top-6 right-6 w-10 h-10 bg-white/5 border border-white/10 hover:bg-white/10 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-all duration-300 z-50 shadow-[0_0_15px_rgba(0,0,0,0.5)]"
          aria-label="Close menu"
        >
          <IconX size={18} stroke={2} />
        </button>

        {/* Desktop Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed((c) => !c)}
          className="hidden md:flex absolute top-9 -right-3 w-6 h-6 bg-bg-elevated border border-white/10 hover:border-brand-green/40 hover:text-brand-green rounded-full items-center justify-center text-white/40 transition-all duration-300 z-50 shadow-lg"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <IconChevronsLeft
            size={14}
            stroke={2}
            className={`transition-transform duration-500 ${isCollapsed ? "rotate-180" : ""}`}
          />
        </button>

        {/* Header & Brand Lockup */}
        <div
          className={`pt-10 pb-8 flex items-center select-none relative ${
            isCollapsed ? "md:justify-center md:px-4 px-8" : "px-8"
          }`}
        >
          <div className="flex items-center gap-4">
            <LogoMark className="w-12 h-12 shrink-0 drop-shadow-[0_0_12px_rgba(29,185,84,0.4)]" />

            <div
              className={`flex-col justify-center mt-1 overflow-hidden transition-all duration-300 ${
                isCollapsed ? "md:hidden flex" : "flex"
              }`}
            >
              <span className="text-2xl font-extralight tracking-[0.2em] uppercase text-white leading-none whitespace-nowrap">
                Bloom
              </span>
              <span className="text-[10px] font-bold tracking-[0.4em] text-brand-green uppercase mt-1.5 ml-0.5 whitespace-nowrap">
                Habit
              </span>
            </div>
          </div>
        </div>

        <nav
          className={`flex-1 space-y-2 overflow-y-auto overflow-x-hidden mt-2 ${
            isCollapsed ? "md:px-3.5 px-5" : "px-5"
          }`}
        >
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              title={isCollapsed ? item.name : undefined}
              end={item.path === "/"}
              className={({ isActive }) =>
                `flex items-center gap-4 py-4 rounded-2xl text-sm font-medium transition-all duration-500 group border ${
                  isCollapsed ? "md:justify-center md:px-0 px-5" : "px-5"
                } ${
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
                    className={`shrink-0 ${
                      isActive
                        ? "text-brand-green drop-shadow-[0_0_10px_rgba(29,185,84,0.4)]"
                        : "text-white/40 group-hover:text-white/80 transition-all duration-300"
                    }`}
                  />
                  <span
                    className={`tracking-wide uppercase text-xs font-semibold whitespace-nowrap overflow-hidden transition-all duration-300 ${
                      isCollapsed ? "md:hidden" : ""
                    }`}
                  >
                    {item.name}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div
          className={`py-6 md:py-8 border-t border-white/5 ${
            isCollapsed ? "md:px-3.5 px-6" : "px-6 md:px-8"
          }`}
        >
          <button
            onClick={handleLogout}
            title={isCollapsed ? "Log Out" : undefined}
            className={`flex items-center gap-4 py-4 w-full rounded-2xl text-sm font-medium text-white/50 hover:text-white hover:bg-white/3 transition-all duration-500 group border border-transparent ${
              isCollapsed ? "md:justify-center md:px-0 px-5" : "px-5"
            }`}
          >
            <IconLogout
              size={22}
              stroke={1.5}
              className="text-white/40 group-hover:text-white/80 transition-all duration-300 shrink-0"
            />
            <span
              className={`tracking-wide uppercase text-xs font-semibold whitespace-nowrap overflow-hidden transition-all duration-300 ${
                isCollapsed ? "md:hidden" : ""
              }`}
            >
              Log Out
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content Area Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        <header className="md:hidden flex items-center justify-between p-6 border-b border-white/5 bg-bg-base/90 backdrop-blur-2xl z-30 sticky top-0">
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
            aria-label="Open menu"
          >
            <IconMenu2 size={24} stroke={1.5} />
          </button>
        </header>

        <main className="flex-1 relative overflow-y-auto">
          <div className="absolute inset-0 bg-linear-to-b from-white/2 to-transparent h-72 pointer-events-none" />

          <div className="p-6 md:p-12 max-w-5xl mx-auto relative z-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
