import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { isAxiosError } from "axios";
import LogoMark from "../components/LogoMark";

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
      // On success, redirect to the protected dashboard
      navigate("/");
    } catch (err: unknown) {
      if (isAxiosError(err) && err.response) {
        // Render specific error messages (e.g., "Invalid credentials")
        setError(err.response.data.error || "Login failed. Please try again.");
      } else {
        setError("An unexpected network error occurred.");
      }
    }
  };

  return (
    <div className="h-screen w-full bg-[#0a0a0a] p-4 md:p-6 overflow-hidden flex items-center justify-center">
      <div className="w-full h-full border border-white/10 rounded-4xl flex flex-col lg:flex-row relative overflow-hidden bg-[#0a0a0a] shadow-2xl">
        {/* Left Side - Brand & Atmosphere */}
        <div className="hidden lg:flex w-1/2 h-full relative flex-col items-center justify-center border-r border-white/5">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-175 h-175 bg-brand-green/10 rounded-full blur-[130px] pointer-events-none"></div>

          <div className="relative z-10 text-center">
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
              Welcome back. Let's continue your journey.
            </p>
          </div>
        </div>

        {/* Right Side - Interactive Form */}
        <div className="w-full lg:w-1/2 h-full flex flex-col items-center justify-center px-4 md:px-8 relative z-10 overflow-hidden">
          <div className="flex lg:hidden flex-col items-center justify-center mb-6 select-none">
            <span className="text-4xl font-extralight tracking-[0.2em] text-white uppercase leading-none ml-2">
              Bloom
            </span>
            <span className="text-[10px] font-bold tracking-[0.5em] text-brand-green uppercase mt-2 ml-1">
              Habit
            </span>
          </div>

          <div className="w-full max-w-md relative z-10">
            <div className="bg-white/3 backdrop-blur-2xl border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl">
              <div className="mb-6 text-center">
                <h2 className="text-xl font-light text-white tracking-wide">
                  Sign in
                </h2>
                <p className="text-xs text-white/50 mt-1.5">
                  Enter your secure space.
                </p>
              </div>

              {/* Dynamic Error Banner */}
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs text-center font-medium tracking-wide">
                  {error}
                </div>
              )}

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-xs font-semibold tracking-widest text-white/70 uppercase mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-5 py-4 text-white placeholder-white/40 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:bg-white/10 transition-all duration-300 disabled:opacity-50"
                    placeholder="hello@example.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold tracking-widest text-white/70 uppercase mb-2">
                    Password
                  </label>
                  <input
                    type="password"
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
                    {isLoading ? "Authenticating..." : "Sign In"}
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
          </div>
        </div>
      </div>
    </div>
  );
}
