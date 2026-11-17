"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LuStore,
  LuEye,
  LuEyeOff,
  LuArrowRight,
  LuShieldCheck,
} from "react-icons/lu";
import { Field, Notice } from "./ui";
export default function VendorSignIn() {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [show, setShow] = useState(false);
  const router = useRouter();
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/vendor/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: String(form.get("email")).trim().toLowerCase(),
          password: form.get("password"),
          rememberMe: form.get("rememberMe") === "on",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Unable to sign in.");
      router.replace("/vendor/dashboard");
      router.refresh();
    } catch (e) {
      setError(e.message);
      setBusy(false);
    }
  }
  return (
    <main className="mx-auto grid max-w-5xl gap-0 overflow-hidden px-4 py-10 sm:px-6 lg:grid-cols-2 lg:py-20">
      <section className="flex flex-col justify-between rounded-t-3xl bg-gradient-to-br from-brand-900 to-brand-700 p-8 text-white lg:rounded-l-3xl lg:rounded-tr-none lg:p-12">
        <Link
          href="/"
          className="flex items-center gap-3 font-display text-xl font-bold"
        >
          <LuStore />
          JonoJivan
        </Link>
        <div className="py-10">
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-brand-200">
            Your vendor workspace
          </p>
          <h1 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
            A fresh start.
            <br />A growing business.
          </h1>
          <p className="mt-5 text-sm leading-7 text-brand-100">
            Manage products, fulfill orders, and keep your store moving—all from
            one place.
          </p>
        </div>
        <p className="flex items-center gap-2 text-sm text-brand-100">
          <LuShieldCheck />
          Secure access to your store
        </p>
      </section>
      <section className="v-panel !rounded-t-none p-7 sm:p-10 lg:!rounded-l-none lg:!rounded-r-3xl">
        <h2 className="text-2xl font-semibold">Vendor sign in</h2>
        <p className="mb-7 mt-2 text-sm v-muted">
          Welcome back. Let’s take care of your store.
        </p>
        <form onSubmit={submit} className="space-y-5">
          <Notice error={error} />
          <Field label="Email address">
            <input
              type="email"
              name="email"
              required
              autoComplete="username"
              className="v-input"
              placeholder="you@example.com"
            />
          </Field>
          <Field label="Password">
            <span className="relative block">
              <input
                type={show ? "text" : "password"}
                name="password"
                required
                autoComplete="current-password"
                className="v-input !pr-12"
              />
              <button
                className="absolute right-1 top-1 p-3"
                type="button"
                aria-label={show ? "Hide password" : "Show password"}
                onClick={() => setShow(!show)}
              >
                {show ? <LuEyeOff /> : <LuEye />}
              </button>
            </span>
          </Field>
          <label className="flex min-h-11 items-center gap-2 text-sm v-muted">
            <input
              type="checkbox"
              name="rememberMe"
              className="h-4 w-4 accent-green-700"
            />
            Keep me signed in
          </label>
          <button className="v-button w-full" disabled={busy}>
            {busy ? "Signing in…" : "Sign in"}
            <LuArrowRight />
          </button>
        </form>
        <p className="mt-6 text-center text-xs v-muted">
          Need access?{" "}
          <Link className="v-link" href="/contactUs">
            Contact our team
          </Link>
        </p>
      </section>
    </main>
  );
}
