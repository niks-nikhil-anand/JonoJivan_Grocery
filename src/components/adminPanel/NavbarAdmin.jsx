"use client";
import Link from "next/link";
import { useDemo } from "./demo/DemoProvider";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { LuMenu, LuSearch, LuUser, LuLogOut } from "react-icons/lu";
import { ThemePicker } from "@/components/workspace/WorkspaceTheme";
export default function NavbarAdmin({
  demoEnabled = false,
  onMenuClick,
  mobileOpen,
  onLogout,
  loggingOut,
}) {
  const demo = useDemo();
  const displayName = demoEnabled
    ? demo?.state?.profile.name || "Demo Administrator"
    : "Super Admin";
  const role = demoEnabled
    ? demo?.state?.role || "Administrator"
    : "Administrator";
  return (
    <header className="v-no-print sticky top-0 z-30 flex h-[72px] items-center justify-between gap-3 border-b border-[var(--v-border)] bg-[var(--v-panel)] px-4 sm:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open admin menu"
          aria-expanded={mobileOpen}
          className="rounded-lg p-2 lg:hidden"
        >
          <LuMenu size={24} />
        </button>
        <form
          action="/admin/dashboard/orders/searchOrders"
          className="hidden w-full max-w-md items-center gap-2 rounded-full px-4 py-2 v-soft md:flex"
        >
          <LuSearch aria-hidden className="v-muted" />
          <input
            type="search"
            name="q"
            aria-label="Search orders"
            placeholder="Search orders…"
            className="min-w-0 flex-1 bg-transparent py-1 text-sm outline-none"
          />
          <button type="submit" className="text-xs v-green">
            Search
          </button>
        </form>
        <Link
          href="/admin/dashboard/orders/searchOrders"
          aria-label="Search orders"
          className="rounded-lg p-2 md:hidden"
        >
          <LuSearch size={20} />
        </Link>
      </div>
      <div className="flex items-center gap-2 sm:gap-5">
        <ThemePicker />
        <Menu>
          <MenuButton
            className="flex items-center gap-2 rounded-full p-1 sm:pr-3"
            aria-label="Open admin profile menu"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full v-soft v-green">
              <LuUser size={20} />
            </span>
            <span className="hidden text-left md:block">
              <span className="block max-w-40 truncate text-sm font-semibold">
                {displayName}
              </span>
              <span className="block text-xs v-green">{role}</span>
            </span>
          </MenuButton>
          <MenuItems className="v-panel absolute right-4 top-16 z-40 w-56 p-2 focus:outline-none">
            <MenuItem>
              <Link className="admin-menu-item" href="/admin/dashboard/profile">
                Profile
              </Link>
            </MenuItem>
            <MenuItem>
              <Link
                className="admin-menu-item"
                href="/admin/dashboard/settings"
              >
                Settings
              </Link>
            </MenuItem>
            <MenuItem>
              <button
                className="v-button danger w-full"
                disabled={loggingOut}
                onClick={onLogout}
              >
                <LuLogOut />
                {loggingOut ? "Signing out…" : "Sign out"}
              </button>
            </MenuItem>
          </MenuItems>
        </Menu>
      </div>
    </header>
  );
}
