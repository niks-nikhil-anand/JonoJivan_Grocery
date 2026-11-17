import { cookies } from "next/headers";
import {
  WorkspaceTheme,
  ThemePicker,
} from "@/components/workspace/WorkspaceTheme";
import "@/components/adminPanel/admin.css";
export default function Layout({ children }) {
  return (
    <WorkspaceTheme
      cookieName="admin-theme"
      initialTheme={cookies().get("admin-theme")?.value}
      className="admin-workspace"
    >
      <div className="flex justify-end px-5 pt-5">
        <ThemePicker />
      </div>
      {children}
    </WorkspaceTheme>
  );
}
