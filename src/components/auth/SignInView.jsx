"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  LuMail,
  LuLock,
  LuEye,
  LuEyeOff,
  LuLoader2,
  LuAlertTriangle,
  LuPackageCheck,
  LuMapPin,
  LuZap,
  LuStore,
  LuInfo,
  LuArrowRight,
} from "react-icons/lu";
import { business } from "@/config/home";
import logo from "../../../public/logo/logo.png";
import googleIcon from "../../../public/IconHub/GoogleIcons.png";
import facebookIcon from "../../../public/IconHub/facebookIcon.png";
import basket from "../../../public/frontend/slider/hero-img-1.webp";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const SHOW_FACEBOOK = process.env.NEXT_PUBLIC_FACEBOOK_LOGIN === "true";

/** Only allow same-site relative paths as a post-login destination. */
function safeNext(value) {
  if (!value || typeof value !== "string") return "";
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return "";
  return value;
}

const BENEFITS = [
  { icon: LuPackageCheck, title: "Track every order", text: "See what's packed, shipped and delivered." },
  { icon: LuMapPin, title: "Saved addresses", text: "Check out in a few taps next time." },
  { icon: LuZap, title: "Groceries + recharge", text: "Everything your home runs on, in one account." },
];

export default function SignInView() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get("next"));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [capsOn, setCapsOn] = useState(false);
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState("");
  const [formError, setFormError] = useState("");
  const [showReset, setShowReset] = useState(false);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const emailError = !email ? "Enter your email address." : !EMAIL_RE.test(email) ? "Enter a valid email, like name@example.com." : "";
  const passwordError = !password ? "Enter your password." : "";

  const submit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    setFormError("");
    if (emailError) return emailRef.current?.focus();
    if (passwordError) return passwordRef.current?.focus();

    setLoading(true);
    try {
      await axios.post("/api/auth/login", { email: email.trim(), password, rememberMe: remember });
      const me = await axios.get("/api/auth/userAuthTokenCookies");
      toast.success("Welcome back!");
      router.push(next || `/users/${me.data._id}`);
      router.refresh();
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401) setFormError("That email and password don't match. Please try again.");
      else if (status === 403) setFormError("This account can't sign in here. If you're a vendor, use Vendor login below.");
      else setFormError("Something went wrong. Please check your connection and try again.");
      setPassword("");
      setTouched((t) => ({ ...t, password: false }));
      passwordRef.current?.focus();
    } finally {
      setLoading(false);
    }
  };

  const social = async (provider) => {
    setSocialLoading(provider);
    try {
      // Without a `next` page, return to this page: the middleware then forwards
      // signed-in users to their account, as before.
      await signIn(provider, { callbackUrl: next || "/auth/signIn" });
    } catch {
      setSocialLoading("");
      toast.error("Couldn't start sign-in. Please try again.");
    }
  };

  const fieldCls = (bad) =>
    `flex h-12 items-center gap-3 rounded-xl border bg-cream px-4 transition focus-within:bg-white focus-within:ring-4 ${
      bad ? "border-red-400 focus-within:ring-red-100" : "border-black/10 focus-within:border-brand-500 focus-within:ring-brand-100"
    }`;

  return (
    <main className="bg-cream px-4 py-8 sm:px-6 sm:py-12 lg:py-16">
      <div className="mx-auto grid w-full max-w-6xl items-stretch gap-8 lg:grid-cols-2 lg:gap-0 lg:overflow-hidden lg:rounded-[2rem] lg:bg-white lg:shadow-lift">
        {/* Brand panel (desktop) */}
        <aside className="relative hidden overflow-hidden bg-gradient-to-br from-brand-700 via-brand-800 to-brand-900 p-10 text-white lg:flex lg:flex-col">
          <div aria-hidden className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10" />
          <div aria-hidden className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-brand-500/30 blur-2xl" />
          <Link href="/" className="relative flex items-center gap-3">
            <Image src={logo} alt="" width={48} height={48} className="h-12 w-12 rounded-full bg-white p-0.5" />
            <span className="font-display text-2xl font-bold">JonoJivan</span>
          </Link>
          <h2 className="relative mt-10 font-display text-4xl font-bold leading-tight">
            Fresh groceries.
            <br />
            Quick recharge.
            <br />
            <span className="text-brand-200">One account.</span>
          </h2>
          <ul className="relative mt-8 space-y-4">
            {BENEFITS.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-lg ring-1 ring-white/20">
                  <Icon aria-hidden />
                </span>
                <span>
                  <span className="block font-semibold">{title}</span>
                  <span className="block text-sm text-brand-100">{text}</span>
                </span>
              </li>
            ))}
          </ul>
          <div className="relative mt-auto flex justify-end pt-8">
            <Image src={basket} alt="" sizes="320px" className="w-72 drop-shadow-2xl" />
          </div>
        </aside>

        {/* Form */}
        <section className="mx-auto w-full max-w-md rounded-3xl bg-white p-6 shadow-lift sm:p-8 lg:max-w-none lg:rounded-none lg:p-12 lg:shadow-none xl:px-16">
          <div className="flex items-center gap-3 lg:hidden">
            <Image src={logo} alt="" width={40} height={40} className="h-10 w-10" />
            <span className="font-display text-lg font-bold text-brand-800">JonoJivan</span>
          </div>

          <h1 className="mt-6 font-display text-3xl font-bold text-ink lg:mt-0">Welcome back</h1>
          <p className="mt-1 text-sm text-ink-muted">
            {next ? "Sign in to continue where you left off." : "Sign in to your JonoJivan account."}
          </p>

          {/* Social */}
          <div className="mt-6 space-y-3">
            <button
              type="button"
              onClick={() => social("google")}
              disabled={!!socialLoading || loading}
              className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-black/10 bg-white text-sm font-semibold text-ink shadow-sm transition hover:-translate-y-0.5 hover:border-black/20 hover:shadow-card disabled:opacity-60"
            >
              {socialLoading === "google" ? (
                <LuLoader2 className="animate-spin" aria-hidden />
              ) : (
                <Image src={googleIcon} alt="" width={20} height={20} />
              )}
              Continue with Google
            </button>
            {SHOW_FACEBOOK && (
              <button
                type="button"
                onClick={() => social("facebook")}
                disabled={!!socialLoading || loading}
                className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-black/10 bg-white text-sm font-semibold text-ink shadow-sm transition hover:-translate-y-0.5 hover:shadow-card disabled:opacity-60"
              >
                <Image src={facebookIcon} alt="" width={20} height={20} />
                Continue with Facebook
              </button>
            )}
          </div>

          <div className="my-6 flex items-center gap-3 text-xs font-medium uppercase tracking-wider text-ink-soft">
            <span className="h-px flex-1 bg-black/10" /> or use email <span className="h-px flex-1 bg-black/10" />
          </div>

          {formError && (
            <div role="alert" className="mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <LuAlertTriangle className="mt-0.5 shrink-0" aria-hidden />
              {formError}
            </div>
          )}

          <form onSubmit={submit} noValidate className="space-y-4">
            <div>
              <label htmlFor="signin-email" className="mb-1.5 block text-sm font-semibold text-ink">
                Email
              </label>
              <div className={fieldCls(touched.email && emailError)}>
                <LuMail className="shrink-0 text-ink-muted" aria-hidden />
                <input
                  id="signin-email"
                  ref={emailRef}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  autoCapitalize="none"
                  spellCheck={false}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                  placeholder="name@example.com"
                  aria-invalid={!!(touched.email && emailError)}
                  aria-describedby={touched.email && emailError ? "signin-email-error" : undefined}
                  className="h-full w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-soft"
                />
              </div>
              {touched.email && emailError && (
                <p id="signin-email-error" className="mt-1.5 text-xs text-red-600">{emailError}</p>
              )}
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="signin-password" className="text-sm font-semibold text-ink">
                  Password
                </label>
                <button type="button" onClick={() => setShowReset((v) => !v)} className="text-xs font-semibold text-brand-700 hover:underline" aria-expanded={showReset}>
                  Forgot password?
                </button>
              </div>
              <div className={fieldCls(touched.password && passwordError)}>
                <LuLock className="shrink-0 text-ink-muted" aria-hidden />
                <input
                  id="signin-password"
                  ref={passwordRef}
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                  onKeyUp={(e) => setCapsOn(e.getModifierState?.("CapsLock"))}
                  placeholder="Your password"
                  aria-invalid={!!(touched.password && passwordError)}
                  aria-describedby={touched.password && passwordError ? "signin-password-error" : undefined}
                  className="h-full w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-soft"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="-mr-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-ink-muted hover:bg-black/5 hover:text-ink"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                >
                  {showPassword ? <LuEyeOff aria-hidden /> : <LuEye aria-hidden />}
                </button>
              </div>
              {touched.password && passwordError && (
                <p id="signin-password-error" className="mt-1.5 text-xs text-red-600">{passwordError}</p>
              )}
              {capsOn && <p className="mt-1.5 text-xs font-semibold text-offer-600">Caps Lock is on.</p>}
              {showReset && (
                <p className="mt-2 flex items-start gap-2 rounded-xl bg-charge-50 px-3 py-2.5 text-xs text-ink">
                  <LuInfo className="mt-0.5 shrink-0 text-charge-600" aria-hidden />
                  <span>
                    Online password reset is coming soon. Meanwhile, sign in with Google if your account uses the same email, or call us at{" "}
                    <a href={`tel:${business.phone}`} className="font-semibold text-charge-700 hover:underline">{business.phone}</a>.
                  </span>
                </p>
              )}
            </div>

            <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-4 w-4 rounded accent-brand-600" />
              Keep me signed in
            </label>

            <button
              type="submit"
              disabled={loading || !!socialLoading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 text-base font-bold text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <LuLoader2 className="animate-spin" aria-hidden /> Signing in…
                </>
              ) : (
                <>
                  Sign in <LuArrowRight aria-hidden />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-muted">
            New to JonoJivan?{" "}
            <Link href={next ? `/auth/register?next=${encodeURIComponent(next)}` : "/auth/register"} className="font-semibold text-brand-700 hover:underline">
              Create an account
            </Link>
          </p>

          <div className="mt-6 flex items-center justify-center gap-2 border-t border-black/5 pt-5 text-sm">
            <LuStore className="text-ink-muted" aria-hidden />
            <span className="text-ink-muted">Selling on JonoJivan?</span>
            <Link href="/admin/auth" className="font-semibold text-ink hover:text-brand-700 hover:underline">
              Vendor login
            </Link>
          </div>

          <p className="mt-6 text-center text-xs text-ink-soft">
            By continuing you agree to our{" "}
            <Link href="/termsAndConditions" className="underline hover:text-ink">Terms</Link> and{" "}
            <Link href="/privacyPolicy" className="underline hover:text-ink">Privacy Policy</Link>.
          </p>
        </section>
      </div>
    </main>
  );
}
