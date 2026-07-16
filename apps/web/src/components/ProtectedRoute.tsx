import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
  const { user, isLoading } = useAuth();

  // 1. Wait for authentication status to resolve
  if (isLoading) {
    return (
      <div className="h-screen w-full bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-brand-green/20 border-t-brand-green rounded-full animate-spin"></div>
      </div>
    );
  }

  // 2. If there is no user logged in, kick them to the login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. If authenticated, render the protected child routes
  return <Outlet />;
}
