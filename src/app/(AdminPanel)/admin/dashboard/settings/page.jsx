"use client";

import { ThemePicker } from "@/components/workspace/WorkspaceTheme";
import { useState } from "react";
import {
  LuBell,
  LuGlobe2,
  LuSave,
  LuShieldCheck,
  LuSparkles,
} from "react-icons/lu";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    orderUpdates: true,
    lowStock: true,
    weeklyReport: false,
  });
  const [saved, setSaved] = useState(false);
  const toggle = (key) => {
    setSettings((current) => ({ ...current, [key]: !current[key] }));
    setSaved(false);
  };

  return (
    <div className="min-h-[calc(100vh-72px)] bg-[var(--v-bg)] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--v-green)]">
              Workspace
            </p>
            <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-[var(--v-text)] sm:text-3xl">
              Admin settings
            </h1>
            <p className="mt-2 text-sm text-[var(--v-muted)]">
              Customize your workspace appearance and preview store preferences.
            </p>
          </div>
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[var(--v-border)] bg-[var(--v-blue-soft)] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-[var(--v-blue)]">
            <LuSparkles aria-hidden="true" /> Store settings demo
          </span>
        </header>
        <section className="v-panel flex flex-col justify-between gap-5 p-5 sm:flex-row sm:items-center sm:p-6">
          <div>
            <h2 className="text-lg font-semibold">Appearance</h2>
            <p className="mt-2 text-sm v-muted">
              Light, dark, or your device’s preference. Saved automatically for
              this browser.
            </p>
          </div>
          <ThemePicker />
        </section>
        <section className="rounded-2xl border border-[var(--v-border)] bg-[var(--v-panel)] p-5 shadow-card sm:p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--v-green-soft)] text-xl text-[var(--v-green)]">
              <LuGlobe2 aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-semibold text-[var(--v-text)]">
                Store profile
              </h2>
              <p className="text-sm text-[var(--v-muted)]">
                JonoJivan Grocery · Uttar Khatowal, Assam
              </p>
            </div>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-[var(--v-muted)]">
              Store name
              <input
                readOnly
                value="JonoJivan Grocery"
                className="mt-2 h-11 w-full rounded-xl border border-[var(--v-border)] bg-[var(--v-soft)] px-3 text-[var(--v-text)]"
              />
            </label>
            <label className="text-sm font-medium text-[var(--v-muted)]">
              Currency
              <input
                readOnly
                value="INR · ₹"
                className="mt-2 h-11 w-full rounded-xl border border-[var(--v-border)] bg-[var(--v-soft)] px-3 text-[var(--v-text)]"
              />
            </label>
          </div>
        </section>
        <section className="rounded-2xl border border-[var(--v-border)] bg-[var(--v-panel)] p-5 shadow-card sm:p-6">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--v-blue-soft)] text-xl text-[var(--v-blue)]">
              <LuBell aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-semibold text-[var(--v-text)]">
                Notifications
              </h2>
              <p className="text-sm text-[var(--v-muted)]">
                These sample toggles stay in this page preview.
              </p>
            </div>
          </div>
          <div className="divide-y divide-[var(--v-border)]">
            {[
              {
                key: "orderUpdates",
                label: "Order updates",
                description: "Notify the admin team about new orders.",
              },
              {
                key: "lowStock",
                label: "Low stock alerts",
                description: "Flag items that need restocking.",
              },
              {
                key: "weeklyReport",
                label: "Weekly summary",
                description: "Receive a sample weekly store summary.",
              },
            ].map((item) => (
              <label
                key={item.key}
                className="flex cursor-pointer items-center justify-between gap-4 py-4"
              >
                <span>
                  <span className="block text-sm font-semibold text-[var(--v-text)]">
                    {item.label}
                  </span>
                  <span className="mt-1 block text-xs text-[var(--v-muted)]">
                    {item.description}
                  </span>
                </span>
                <input
                  type="checkbox"
                  checked={settings[item.key]}
                  onChange={() => toggle(item.key)}
                  className="h-5 w-5 shrink-0 accent-brand-700"
                />
              </label>
            ))}
          </div>
        </section>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setSaved(true)}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand-700 px-5 text-sm font-bold text-white transition hover:bg-brand-800"
          >
            <LuSave aria-hidden="true" /> Save preview
          </button>
          {saved && (
            <span
              role="status"
              className="text-sm font-medium text-[var(--v-green)]"
            >
              Preview saved for this session. No settings were sent to the
              server.
            </span>
          )}
        </div>
        <p className="flex items-center gap-2 text-xs leading-5 text-[var(--v-muted)]">
          <LuShieldCheck aria-hidden="true" /> Demo page only. These preferences
          are not persisted to an account.
        </p>
      </div>
    </div>
  );
}
