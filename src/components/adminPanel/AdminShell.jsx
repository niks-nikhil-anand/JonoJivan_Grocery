"use client";
import { Suspense, useEffect, useState } from "react";
import { DemoProvider } from "./demo/DemoProvider";
import DemoWorkspace, { DemoToolbar } from "./demo/DemoWorkspace";
import { resolveRoute } from "@/lib/admin/demo/routes";
import { usePathname, useRouter } from "next/navigation";
import { WorkspaceTheme } from "@/components/workspace/WorkspaceTheme";
import SidebarAdmin from "./SidebarAdmin";
import NavbarAdmin from "./NavbarAdmin";
import "./admin.css";
export default function AdminShell({ children, initialTheme }) {
  const [demoEnabled, setDemoEnabled] = useState(true);
  useEffect(() => {
    try {
      setDemoEnabled(
        sessionStorage.getItem("admin-workspace-mode") !== "existing",
      );
    } catch {}
  }, []);
  const changeMode = (enabled) => {
    setDemoEnabled(enabled);
    try {
      sessionStorage.setItem(
        "admin-workspace-mode",
        enabled ? "demo" : "existing",
      );
    } catch {}
  };
  const [mobileOpen, setMobileOpen] = useState(false),
    [loggingOut, setLoggingOut] = useState(false),
    [error, setError] = useState("");
  const path = usePathname(),
    router = useRouter();
  useEffect(() => {
    setMobileOpen(false);
  }, [path]);
  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const close = () => {
      if (media.matches) setMobileOpen(false);
    };
    media.addEventListener("change", close);
    return () => media.removeEventListener("change", close);
  }, []);
  async function logout() {
    setLoggingOut(true);
    setError("");
    try {
      const response = await fetch("/api/admin/auth/logout", {
        method: "POST",
      });
      if (!response.ok) throw new Error();
      router.replace("/admin/auth");
      router.refresh();
    } catch {
      setError("Sign out failed. Please try again.");
      setLoggingOut(false);
    }
  }
  return (
    <DemoProvider>
      <WorkspaceTheme
        initialTheme={initialTheme}
        cookieName="admin-theme"
        className="admin-workspace"
      >
        <div className="flex min-h-dvh w-full">
          <a
            href="#admin-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] v-button"
          >
            Skip to content
          </a>
          <SidebarAdmin
            demoEnabled={demoEnabled}
            mobileOpen={mobileOpen}
            onClose={() => setMobileOpen(false)}
            onLogout={logout}
            loggingOut={loggingOut}
          />
          <div className="min-w-0 flex-1">
            <NavbarAdmin
              demoEnabled={demoEnabled}
              onMenuClick={() => setMobileOpen(true)}
              mobileOpen={mobileOpen}
              onLogout={logout}
              loggingOut={loggingOut}
            />
            <DemoToolbar enabled={demoEnabled} setEnabled={changeMode} />
            <main id="admin-content" className="min-w-0">
              {error && (
                <p role="alert" className="v-error mx-4 mt-4 sm:mx-6">
                  {error}
                </p>
              )}
              {demoEnabled && resolveRoute(path) ? (
                <Suspense fallback={<p className="p-8">Loading demo…</p>}>
                  <DemoWorkspace key={path} />
                </Suspense>
              ) : (
                children
              )}
            </main>
          </div>
        </div>
      </WorkspaceTheme>
    </DemoProvider>
  );
}
