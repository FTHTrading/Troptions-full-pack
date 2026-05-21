import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign In — Troptions Cloud",
  description: "Sign in to your Troptions account.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#080C14] text-white flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="mb-10 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#C9A84C] mb-2">Troptions Cloud</p>
          <h1 className="text-2xl font-bold text-white">Sign in</h1>
          <p className="mt-2 text-sm text-gray-400">Access your Troptions namespaces and tools.</p>
        </div>

        {/* Simulation Banner */}
        <div className="mb-6 rounded-xl border border-yellow-800/50 bg-yellow-900/10 p-4">
          <p className="text-xs font-semibold text-yellow-400 uppercase tracking-[0.2em] mb-1">Simulation Only</p>
          <p className="text-xs text-yellow-300/80">
            Authentication is non-functional in this phase. No credentials will be validated.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5 rounded-xl border border-gray-800 bg-[#0F1923] p-6">
          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
              Email Address
            </label>
            <input
              disabled
              type="email"
              placeholder="you@example.com"
              className="w-full cursor-not-allowed rounded-lg border border-gray-700 bg-[#080C14] px-4 py-2.5 text-sm text-gray-600"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
              Password
            </label>
            <input
              disabled
              type="password"
              placeholder="Your password"
              className="w-full cursor-not-allowed rounded-lg border border-gray-700 bg-[#080C14] px-4 py-2.5 text-sm text-gray-600"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs text-gray-500">
              <input disabled type="checkbox" className="cursor-not-allowed opacity-40" />
              Remember me
            </label>
            <span className="text-xs text-gray-600 cursor-not-allowed">Forgot password?</span>
          </div>

          <button
            disabled
            type="submit"
            className="w-full cursor-not-allowed rounded-lg border border-gray-700 bg-[#080C14] px-4 py-3 text-sm font-semibold text-gray-600"
          >
            Sign In — Simulation Only
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-500">
          {"Don't have an account? "}
          <Link href="/register" className="text-[#C9A84C] hover:underline">
            Register
          </Link>
        </p>

        <p className="mt-4 text-center text-xs text-gray-500">
          Want to explore?{" "}
          <Link href="/troptions/onboarding" className="text-[#C9A84C] hover:underline">
            Start onboarding
          </Link>
        </p>
      </div>
    </div>
  );
}
