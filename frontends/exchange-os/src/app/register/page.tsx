import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Register — Troptions Cloud",
  description: "Create your Troptions account to access Troptions Cloud tools and namespaces.",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#080C14] text-white flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="mb-10 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#C9A84C] mb-2">Troptions Cloud</p>
          <h1 className="text-2xl font-bold text-white">Create your account</h1>
          <p className="mt-2 text-sm text-gray-400">Access Troptions AI tools, namespaces, and proof vault.</p>
        </div>

        {/* Simulation Banner */}
        <div className="mb-6 rounded-xl border border-yellow-800/50 bg-yellow-900/10 p-4">
          <p className="text-xs font-semibold text-yellow-400 uppercase tracking-[0.2em] mb-1">Simulation Only</p>
          <p className="text-xs text-yellow-300/80">
            Registration is non-functional in this phase. No accounts will be created.
            This form is a scaffold for the onboarding flow.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5 rounded-xl border border-gray-800 bg-[#0F1923] p-6">
          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
              Full Name
            </label>
            <input
              disabled
              type="text"
              placeholder="Your full name"
              className="w-full cursor-not-allowed rounded-lg border border-gray-700 bg-[#080C14] px-4 py-2.5 text-sm text-gray-600"
            />
          </div>

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
              placeholder="Create a password"
              className="w-full cursor-not-allowed rounded-lg border border-gray-700 bg-[#080C14] px-4 py-2.5 text-sm text-gray-600"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
              Confirm Password
            </label>
            <input
              disabled
              type="password"
              placeholder="Confirm your password"
              className="w-full cursor-not-allowed rounded-lg border border-gray-700 bg-[#080C14] px-4 py-2.5 text-sm text-gray-600"
            />
          </div>

          <div className="flex items-start gap-3">
            <input
              disabled
              type="checkbox"
              className="mt-0.5 cursor-not-allowed opacity-40"
            />
            <p className="text-xs text-gray-500">
              I agree to the Troptions{" "}
              <span className="text-[#C9A84C]">Terms of Service</span> and{" "}
              <span className="text-[#C9A84C]">Privacy Policy</span>.
            </p>
          </div>

          <button
            disabled
            type="submit"
            className="w-full cursor-not-allowed rounded-lg border border-gray-700 bg-[#080C14] px-4 py-3 text-sm font-semibold text-gray-600"
          >
            Create Account — Simulation Only
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-[#C9A84C] hover:underline">
            Sign in
          </Link>
        </p>

        <p className="mt-8 text-center text-[10px] text-gray-600 leading-relaxed">
          Troptions Cloud is a platform tool access system. Registration does not constitute an investment,
          securities purchase, or financial product enrollment.
        </p>
      </div>
    </div>
  );
}
