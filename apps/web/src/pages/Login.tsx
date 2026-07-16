import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] relative overflow-hidden px-4">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-150 h-150 bg-brand-green/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Typographic Logo */}
        <div className="flex flex-col items-center justify-center mb-12 select-none">
          <span className="text-5xl font-extralight tracking-[0.2em] text-white uppercase leading-none ml-2">
            Bloom
          </span>
          <span className="text-xs font-bold tracking-[0.5em] text-brand-green uppercase mt-2 ml-1">
            Habit
          </span>
        </div>

        <div className="bg-white/3 backdrop-blur-2xl border border-white/10 p-10 rounded-3xl shadow-2xl">
          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium tracking-wide text-white uppercase mb-3">
                Email
              </label>
              <input
                type="email"
                className="w-full bg-white/5 border border-white/20 rounded-xl px-5 py-4 text-white placeholder-white/60 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:bg-white/10 transition-all duration-300"
                placeholder="hello@example.com"
              />
            </div>

            {/* Password Input  */}
            <div>
              <label className="block text-sm font-medium tracking-wide text-white uppercase mb-3">
                Password
              </label>
              <input
                type="password"
                className="w-full bg-white/5 border border-white/20 rounded-xl px-5 py-4 text-white placeholder-white/60 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:bg-white/10 transition-all duration-300"
                placeholder="••••••••"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-brand-green hover:bg-brand-green-hover text-black font-bold tracking-wide py-4 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(29,185,84,0.15)] hover:shadow-[0_0_30px_rgba(29,185,84,0.3)] active:scale-[0.98]"
              >
                Sign In
              </button>
            </div>
          </form>

          <div className="mt-10 pt-6 border-t border-white/10 text-center">
            <p className="text-sm text-white">
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
  );
}
