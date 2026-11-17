"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";

import {
  LuArrowRight,
  LuEye,
  LuEyeOff,
  LuLeaf,
  LuLock,
  LuMail,
  LuShieldCheck,
  LuStore,
} from "react-icons/lu";

export default function AdminSignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("admin");
  const [error, setError] = useState("");

  const isAdmin = role === "admin";

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = isAdmin ? "/api/admin/auth" : "/api/vendor/auth";
      await axios.post(endpoint, { email, password, rememberMe });
      setPassword("");

      router.push(isAdmin ? "/admin/dashboard" : "/vendor/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.msg ||
          "We couldn’t sign you in. Check your details and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative isolate overflow-hidden bg-[var(--v-bg)] px-4 py-10 sm:px-6 sm:py-14 lg:py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-16 h-64 w-64 rounded-full bg-brand-100/70 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-offer-100/70 blur-3xl"
      />

      <div className="relative mx-auto grid min-h-[610px] w-full max-w-6xl overflow-hidden rounded-[2rem] border border-[var(--v-border)] bg-[var(--v-panel)] shadow-[0_24px_80px_-36px_rgba(20,83,45,0.28)] lg:grid-cols-[1.02fr_0.98fr]">
        <section className="relative flex min-h-[250px] flex-col justify-between overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 px-6 py-7 text-white sm:min-h-[300px] sm:px-10 sm:py-9 lg:min-h-full lg:px-12 lg:py-12">
          <div
            aria-hidden="true"
            className="absolute -right-16 -top-16 h-64 w-64 rounded-full border border-white/10"
          />
          <div
            aria-hidden="true"
            className="absolute -right-5 -top-5 h-44 w-44 rounded-full border border-white/10"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-white/[0.06]"
          />

          <Link
            href="/"
            className="relative z-10 inline-flex w-fit items-center gap-3 rounded-full bg-[var(--v-panel)] px-3 py-2 text-[var(--v-green)] shadow-card"
            aria-label="JonoJivan home"
          >
            <Image
              src="/logo/logo.png"
              alt=""
              width={38}
              height={38}
              className="h-9 w-9 rounded-full object-contain"
            />
            <span className="pr-2 font-display text-lg font-bold tracking-tight">
              JonoJivan
            </span>
          </Link>

          <div className="relative z-10 mt-9 max-w-lg lg:mt-0">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-brand-50">
              <LuLeaf aria-hidden="true" className="text-base" /> GOOD THINGS,
              EVERY DAY
            </span>
            <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-[2.7rem]">
              Fresh essentials.
              <br />A smoother way to serve.
            </h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-brand-50/85 sm:text-base sm:leading-7">
              Sign in to manage your JonoJivan store and keep the everyday
              essentials your customers count on moving.
            </p>
          </div>

          <div className="relative z-10 mt-8 hidden items-center gap-3 text-sm text-brand-50/90 lg:flex">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-lg">
              <LuShieldCheck aria-hidden="true" />
            </span>
            <span>Private, secure access for your team</span>
          </div>
        </section>

        <section className="flex items-center justify-center px-5 py-9 sm:px-10 sm:py-12 lg:px-12">
          <div className="w-full max-w-md">
            <div className="mb-7">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[var(--v-green)]">
                Your workspace
              </p>
              <h2 className="font-display text-3xl font-semibold tracking-tight text-[var(--v-text)] sm:text-4xl">
                {isAdmin ? "Welcome back" : "Vendor sign in"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-[var(--v-muted)]">
                Sign in to continue to your JonoJivan{" "}
                {isAdmin ? "admin" : "vendor"} account.
              </p>
            </div>

            <div
              className="mb-6 grid grid-cols-2 rounded-2xl bg-[var(--v-soft)] p-1"
              role="group"
              aria-label="Choose account type"
            >
              <button
                type="button"
                onClick={() => setRole("admin")}
                aria-pressed={isAdmin}
                className={`flex min-h-11 items-center justify-center gap-2 rounded-xl px-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 ${isAdmin ? "bg-[var(--v-panel)] text-[var(--v-green)] shadow-sm" : "text-[var(--v-muted)] hover:text-[var(--v-text)]"}`}
              >
                <LuShieldCheck aria-hidden="true" className="text-base" /> Admin
              </button>
              <button
                type="button"
                onClick={() => setRole("vendor")}
                aria-pressed={!isAdmin}
                className={`flex min-h-11 items-center justify-center gap-2 rounded-xl px-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 ${!isAdmin ? "bg-[var(--v-panel)] text-[var(--v-green)] shadow-sm" : "text-[var(--v-muted)] hover:text-[var(--v-text)]"}`}
              >
                <LuStore aria-hidden="true" className="text-base" /> Vendor
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {error && <p role="alert" className="v-error">{error}</p>}
              <div>
                <label
                  htmlFor="signin-email"
                  className="mb-2 block text-sm font-semibold text-[var(--v-text)]"
                >
                  Email address
                </label>
                <div className="flex h-12 items-center gap-3 rounded-xl border border-[var(--v-border)] bg-[var(--v-panel)] px-3.5 transition focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-100">
                  <LuMail
                    aria-hidden="true"
                    className="shrink-0 text-lg text-[var(--v-muted)]"
                  />
                  <input
                    id="signin-email"
                    type="email"
                    name="email"
                    autoComplete="username"
                    inputMode="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    className="h-full min-w-0 flex-1 bg-transparent text-sm text-[var(--v-text)] outline-none placeholder:text-[var(--v-muted)]"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="signin-password"
                  className="mb-2 block text-sm font-semibold text-[var(--v-text)]"
                >
                  Password
                </label>
                <div className="flex h-12 items-center gap-3 rounded-xl border border-[var(--v-border)] bg-[var(--v-panel)] px-3.5 transition focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-100">
                  <LuLock
                    aria-hidden="true"
                    className="shrink-0 text-lg text-[var(--v-muted)]"
                  />
                  <input
                    id="signin-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    className="h-full min-w-0 flex-1 bg-transparent text-sm text-[var(--v-text)] outline-none placeholder:text-[var(--v-muted)]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-lg text-[var(--v-muted)] transition hover:bg-[var(--v-green-soft)] hover:text-[var(--v-green)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
                  >
                    {showPassword ? (
                      <LuEyeOff aria-hidden="true" />
                    ) : (
                      <LuEye aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-1">
                <label className="inline-flex min-h-8 cursor-pointer items-center gap-2 text-sm text-[var(--v-muted)]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                    className="h-4 w-4 rounded border-[var(--v-border)] accent-brand-700 focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
                  />
                  Keep me signed in
                </label>
                <span className="text-xs text-[var(--v-muted)]">
                  Secure access
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group mt-2 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-700 px-5 text-sm font-bold text-white shadow-[0_8px_18px_-8px_rgba(21,128,61,0.75)] transition hover:bg-brand-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--v-border)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Signing you in…"
                  : `Sign in as ${isAdmin ? "admin" : "vendor"}`}
                {!loading && (
                  <LuArrowRight
                    aria-hidden="true"
                    className="text-lg transition-transform group-hover:translate-x-1"
                  />
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-xs leading-5 text-[var(--v-muted)]">
              Need help accessing your account?{" "}
              <Link
                href="/contactUs"
                className="font-semibold text-[var(--v-green)] underline decoration-brand-200 underline-offset-4 hover:decoration-brand-700"
              >
                Contact our team
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
