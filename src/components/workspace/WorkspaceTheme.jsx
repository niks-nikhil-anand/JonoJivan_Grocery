"use client";
import { createContext, useContext, useState } from "react";
import { LuSun, LuMoon, LuMonitor } from "react-icons/lu";
import "./theme.css";
const ThemeContext = createContext(null);
export const useWorkspaceTheme = () => useContext(ThemeContext);
export const validTheme = (value) =>
  ["light", "dark", "system"].includes(value) ? value : "system";

export function WorkspaceTheme({
  initialTheme = "system",
  cookieName,
  className = "",
  children,
}) {
  const [theme, updateTheme] = useState(validTheme(initialTheme));
  const setTheme = (value) => {
    const next = validTheme(value);
    updateTheme(next);
    document.cookie = `${cookieName}=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;
  };
  // The server supplies the cookie preference. System colors are resolved by CSS
  // before hydration, avoiding a light flash and keeping the storefront untouched.
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className={`workspace-theme ${className}`} data-theme={theme}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
export function ThemePicker() {
  const { theme, setTheme } = useWorkspaceTheme();
  const Icon =
    theme === "dark" ? LuMoon : theme === "light" ? LuSun : LuMonitor;
  return (
    <label className="flex items-center gap-2">
      <span className="sr-only">Color theme</span>
      <Icon aria-hidden />
      <select
        aria-label="Color theme"
        className="v-input !min-h-10 !w-auto !py-2 !text-xs"
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
      >
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </label>
  );
}
