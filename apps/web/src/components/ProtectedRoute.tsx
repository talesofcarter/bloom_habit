import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SkeletonLoader from "../components/SkeletonLoader";

export default function ProtectedRoute() {
  const { user, isLoading } = useAuth();

  // 1. Wait for authentication status to resolve
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex overflow-hidden w-full">
        <aside className="hidden md:flex flex-col w-72 border-r border-white/5 pt-10 pb-8 px-8">
          <div className="flex items-center gap-4 mb-12">
            <SkeletonLoader className="w-12 h-12 rounded-full shrink-0" />
            <div className="space-y-2 flex-1 pt-1">
              <SkeletonLoader className="h-6 w-24 rounded-md" />
              <SkeletonLoader className="h-3 w-12 rounded-md" />
            </div>
          </div>

          {/* Ghost Navigation Items */}
          <nav className="flex-1 space-y-3 mt-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonLoader
                key={`nav-skel-${i}`}
                className="h-13.5 w-full rounded-2xl"
              />
            ))}
          </nav>

          {/* Ghost Logout Button */}
          <div className="pt-8 border-t border-white/5 mt-auto">
            <SkeletonLoader className="h-13.5 w-full rounded-2xl" />
          </div>
        </aside>

        {/* Ghost Main Content Area */}
        <main className="flex-1 flex flex-col h-screen relative">
          <header className="md:hidden p-4 border-b border-white/5 flex items-center justify-between">
            <SkeletonLoader className="h-8 w-8 rounded-md" />
            <SkeletonLoader className="h-8 w-24 rounded-md" />
            <SkeletonLoader className="h-8 w-8 rounded-full" />
          </header>

          <div className="flex-1 p-4 md:p-8 lg:p-12 animate-in fade-in duration-500">
            <div className="space-y-3 mb-10 mt-2">
              <SkeletonLoader className="h-10 w-64 rounded-xl" />
              <SkeletonLoader className="h-4 w-48 rounded-md" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SkeletonLoader className="h-30 w-full rounded-3xl" />
              <SkeletonLoader className="h-30 w-full rounded-3xl" />
              <SkeletonLoader className="h-30 w-full rounded-3xl" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
