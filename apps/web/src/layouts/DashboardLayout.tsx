import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  IconHome,
  IconCalendar,
  IconSettings,
  IconLogout,
  IconMenu2,
  IconX,
} from "@tabler/icons-react";
import LogoMark from "../components/LogoMark";

export default function DashboardLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", path: "/", icon: IconHome },
    { name: "Progress", path: "/calendar", icon: IconCalendar },
    { name: "Settings", path: "/settings", icon: IconSettings },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

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

      {/* Sidebar */}
      <aside
        className={`
    fixed inset-y-0 left-0 z-50 w-72 border-r border-white/5 flex flex-col bg-[#0a0a0a]/95 backdrop-blur-3xl
    transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
    md:relative md:translate-x-0
    ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
  `}
      >
        {/* Premium Mobile Close Button - Floating Glassmorphic Circle */}
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="md:hidden absolute top-6 right-6 w-10 h-10 bg-white/5 border border-white/10 hover:bg-white/10 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-all duration-300 z-50 shadow-[0_0_15px_rgba(0,0,0,0.5)]"
        >
          <IconX size={18} stroke={2} />
        </button>

        {/* Header & Brand Lockup */}
        <div className="pt-10 pb-8 px-8 flex items-center select-none relative">
          <div className="flex items-center gap-4">
            {/* Upscaled logo with optimized glow */}
            <LogoMark className="w-12 h-12 shrink-0 drop-shadow-[0_0_12px_rgba(29,185,84,0.4)]" />

            {/* Stacked text block fixes the horizontal border collision */}
            <div className="flex flex-col justify-center mt-1">
              <span className="text-2xl font-extralight tracking-[0.2em] uppercase text-white leading-none">
                Bloom
              </span>
              <span className="text-[10px] font-bold tracking-[0.4em] text-brand-green uppercase mt-1.5 ml-0.5">
                Habit
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-5 space-y-2 overflow-y-auto mt-2">
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
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 px-5 py-4 w-full rounded-2xl text-sm font-medium text-white/50 hover:text-white hover:bg-white/3 transition-all duration-500 group border border-transparent"
          >
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
