"use client";

import { useState } from "react";
import { LuCheckCircle, LuSparkles, LuUser } from "react-icons/lu";

export default function AdminProfilePage() {
  const [preview, setPreview] = useState(false);
  return (
    <div className="min-h-[calc(100vh-72px)] bg-[var(--v-bg)] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--v-green)]">
              Workspace
            </p>
            <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-[var(--v-text)] sm:text-3xl">
              Admin profile
            </h1>
            <p className="mt-2 text-sm text-[var(--v-muted)]">
              Review the sample administrator profile.
            </p>
          </div>
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[var(--v-border)] bg-[var(--v-blue-soft)] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-[var(--v-blue)]">
            <LuSparkles aria-hidden="true" /> Demo profile
          </span>
        </header>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setPreview(true);
          }}
          className="rounded-2xl border border-[var(--v-border)] bg-[var(--v-panel)] p-5 shadow-card sm:p-7"
        >
          <div className="mb-6 flex items-center gap-4 border-b border-[var(--v-border)] pb-6">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--v-green-soft)] text-3xl text-[var(--v-green)]">
              <LuUser aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-semibold text-[var(--v-text)]">
                Store Administrator
              </h2>
              <p className="mt-1 text-sm text-[var(--v-muted)]">
                Super Admin · JonoJivan Grocery
              </p>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {[
              ["Display name", "Store Administrator"],
              ["Email address", "admin@example.com"],
              ["Role", "Super Admin"],
              ["Store location", "Uttar Khatowal, Assam"],
            ].map(([label, value]) => (
              <label
                key={label}
                className="text-sm font-semibold text-[var(--v-text)]"
              >
                {label}
                <input
                  readOnly
                  value={value}
                  className="mt-2 h-11 w-full rounded-xl border border-[var(--v-border)] bg-[var(--v-soft)] px-3 font-normal text-[var(--v-text)]"
                />
              </label>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              className="min-h-11 rounded-xl bg-brand-700 px-5 text-sm font-bold text-white transition hover:bg-brand-800"
            >
              Preview profile
            </button>
            {preview && (
              <span
                role="status"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--v-green)]"
              >
                <LuCheckCircle aria-hidden="true" /> Sample profile is ready. No
                account changes were saved.
              </span>
            )}
          </div>
          <p className="mt-4 text-xs text-[var(--v-muted)]">
            Demo page only. Profile edits are not persisted.
          </p>
        </form>
      </div>
    </div>
  );
}
