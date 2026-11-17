import Link from "next/link";
export function AdminPage({ children }) {
  return (
    <div className="admin-page">
      <div className="admin-container">{children}</div>
    </div>
  );
}
export function AdminPageHeader({ title, description, action }) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs v-muted">
          <Link href="/admin/dashboard" className="hover:underline">
            Workspace
          </Link>
          <span>/</span>
          <span>{title}</span>
        </div>
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-6 v-muted">
            {description}
          </p>
        )}
      </div>
      {action}
    </header>
  );
}

export function AdminStatus({status}) {
  const value=String(status||"");
  const tone=/^(paid|settled|processed|active|recorded|delivered|healthy|published|approved)$/i.test(value)?"good":/cancel|reject|inactive|out of stock|failed/i.test(value)?"bad":"info";
  return <span className={`v-badge ${tone}`}>{value}</span>;
}
