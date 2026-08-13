import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { isAxiosError } from "axios";
import AuthLayout from "../components/AuthLayout";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    try {
      await register({ name, email, password });
      navigate("/");
    } catch (err: unknown) {
      if (isAxiosError(err) && err.response) {
        setError(
          err.response.data.error || "Registration failed. Please try again.",
        );
      } else {
        setError("An unexpected network error occurred.");
      }
    }
  };

  return (
    <AuthLayout tagline="Consistency is the path to recovery. One day at a time.">
      <div className="bg-white/3 backdrop-blur-2xl border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl">
        <div className="mb-6 text-center">
          <h2 className="text-xl font-light text-white tracking-wide">
            Begin your journey.
          </h2>
          <p className="text-xs text-white/50 mt-1.5">
            Create a secure space for your recovery.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-medium tracking-wide"
          >
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <div>
            <label
              htmlFor="register-name"
              className="block text-xs font-semibold tracking-widest text-white/70 uppercase mb-2"
            >
              Preferred Name
            </label>
            <input
              id="register-name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              className="w-full bg-white/5 border border-white/20 rounded-xl px-5 py-4 text-white placeholder-white/40 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:bg-white/10 transition-all duration-300 disabled:opacity-50"
              placeholder="How should we call you?"
            />
          </div>

          <div>
            <label
              htmlFor="register-email"
              className="block text-xs font-semibold tracking-widest text-white/70 uppercase mb-2"
            >
              Email Address
            </label>
            <input
              id="register-email"
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
              htmlFor="register-password"
              className="block text-xs font-semibold tracking-widest text-white/70 uppercase mb-2"
            >
              Password
            </label>
            <input
              id="register-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="w-full bg-white/5 border border-white/20 rounded-xl px-5 py-4 text-white placeholder-white/40 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:bg-white/10 transition-all duration-300 disabled:opacity-50"
              placeholder="••••••••"
            />
            <p className="text-[10px] text-white/30 mt-2 pl-1">
              Minimum 8 characters. Choose something only you would know.
            </p>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-green hover:bg-brand-green-hover text-black font-bold tracking-widest uppercase text-sm py-4 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(29,185,84,0.15)] hover:shadow-[0_0_30px_rgba(29,185,84,0.3)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? "Creating…" : "Create Account"}
            </button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-white/10 text-center">
          <p className="text-xs text-white/60">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-brand-green hover:text-white font-semibold transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>

      <p className="text-center text-xs text-white/30 mt-4 tracking-wide">
        Your data is encrypted and strictly private.
      </p>
    </AuthLayout>
  );
}
