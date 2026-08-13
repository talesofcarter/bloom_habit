import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { isAxiosError } from "axios";
import AuthLayout from "../components/AuthLayout";
import InlineNotice from "../components/InlineNotice";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please fill in both fields.");
      return;
    }

    try {
      await login({ email, password });
      navigate("/");
    } catch (err: unknown) {
      if (isAxiosError(err) && err.response) {
        setError(err.response.data.error || "Login failed. Please try again.");
      } else {
        setError("An unexpected network error occurred.");
      }
    }
  };

  return (
    <AuthLayout tagline="Welcome back. Let's continue your journey.">
      <div className="bg-white/3 backdrop-blur-2xl border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl">
        <div className="mb-6 text-center">
          <h2 className="text-xl font-light text-white tracking-wide">
            Sign in
          </h2>
          <p className="text-xs text-white/50 mt-1.5">
            Enter your secure space.
          </p>
        </div>

        {error && <InlineNotice variant="notice">{error}</InlineNotice>}

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <div>
            <label
              htmlFor="login-email"
              className="block text-xs font-semibold tracking-widest text-white/70 uppercase mb-2"
            >
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="w-full bg-white/5 border border-white/20 rounded-xl px-5 py-4 text-white placeholder-white/40 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:bg-white/10 transition-all duration-300 disabled:opacity-50"
              placeholder="hello@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="block text-xs font-semibold tracking-widest text-white/70 uppercase mb-2"
            >
              Password
            </label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="w-full bg-white/5 border border-white/20 rounded-xl px-5 py-4 text-white placeholder-white/40 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:bg-white/10 transition-all duration-300 disabled:opacity-50"
              placeholder="••••••••"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-green hover:bg-brand-green-hover text-black font-bold tracking-widest uppercase text-sm py-4 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(29,185,84,0.15)] hover:shadow-[0_0_30px_rgba(29,185,84,0.3)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? "Authenticating…" : "Sign In"}
            </button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-white/10 text-center">
          <p className="text-xs text-white/60">
            New to Bloom?{" "}
            <Link
              to="/register"
              className="text-brand-green hover:text-white font-semibold transition-colors"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
