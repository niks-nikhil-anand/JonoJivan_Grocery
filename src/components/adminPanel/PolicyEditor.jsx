"use client";
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import DOMPurify from "dompurify";
import { AdminPage, AdminPageHeader } from "./AdminPage";
import "react-quill/dist/quill.snow.css";
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => (
    <div className="h-80 animate-pulse rounded-xl v-soft" role="status">
      Loading editor…
    </div>
  ),
});
const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "link"],
    ["clean"],
  ],
};
export default function PolicyEditor({ title, endpoint }) {
  const [content, setContent] = useState(""),
    [loading, setLoading] = useState(true),
    [saving, setSaving] = useState(false),
    [error, setError] = useState(""),
    [success, setSuccess] = useState(""),
    [retry, setRetry] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    fetch(`/api/admin/dashboard/policy/${endpoint}`, {
      signal: controller.signal,
      cache: "no-store",
    })
      .then(async (res) => {
        if (res.status === 404) return null;
        if (!res.ok) throw new Error("Unable to load the saved policy.");
        return res.json();
      })
      .then((data) => {
        if (!controller.signal.aborted) {
          setContent(typeof data?.content === "string" ? data.content : "");
          setLoading(false);
        }
      })
      .catch((e) => {
        if (e.name !== "AbortError") {
          setError(e.message);
          setLoading(false);
        }
      });
    return () => controller.abort();
  }, [endpoint, retry]);
  const preview = useMemo(
    () => (typeof window === "undefined" ? "" : DOMPurify.sanitize(content)),
    [content],
  );
  async function save(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (
      !content
        .replace(/<[^>]*>/g, "")
        .replace(/&nbsp;/g, " ")
        .trim()
    ) {
      setError("Add policy content before saving.");
      return;
    }
    setSaving(true);
    try {
      const body = new FormData();
      body.set("content", preview);
      const res = await fetch(`/api/admin/dashboard/policy/${endpoint}`, {
        method: "POST",
        body,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Unable to save the policy.");
      setSuccess(`${title} saved successfully.`);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }
  return (
    <AdminPage>
      <AdminPageHeader
        title={title}
        description="Edit your store policy and check the preview before publishing."
      />
      {error && (
        <div role="alert" className="v-error">
          {error}{" "}
          <button
            type="button"
            className="ml-2 underline"
            onClick={() => setRetry((r) => r + 1)}
          >
            Reload saved policy
          </button>
        </div>
      )}
      {success && (
        <p role="status" className="v-success">
          {success}
        </p>
      )}
      <div className="grid min-w-0 gap-6 xl:grid-cols-2">
        <form onSubmit={save} className="v-panel min-w-0 space-y-5 p-5 sm:p-6">
          <div>
            <h2 id="policy-editor-heading" className="text-lg font-semibold">
              Policy content
            </h2>
            <p className="mt-1 text-sm v-muted">
              Format headings, lists, and links using the toolbar.
            </p>
          </div>
          {loading ? (
            <div
              role="status"
              className="h-80 animate-pulse rounded-xl p-5 v-soft"
            >
              Loading saved policy…
            </div>
          ) : (
            <ReactQuill
              aria-labelledby="policy-editor-heading"
              value={content}
              onChange={(value) => {
                setContent(value);
                setSuccess("");
              }}
              modules={modules}
              theme="snow"
              readOnly={saving}
            />
          )}
          <button disabled={loading || saving} className="v-button">
            {saving ? "Saving…" : `Save ${title.toLowerCase()}`}
          </button>
        </form>
        <section className="v-panel min-w-0 p-5 sm:p-6">
          <h2 className="text-lg font-semibold">Live preview</h2>
          <p className="mb-5 mt-1 text-sm v-muted">
            How your formatted content reads.
          </p>
          {content.replace(/<[^>]*>/g, "").trim() ? (
            <div
              className="prose admin-prose max-w-none break-words"
              dangerouslySetInnerHTML={{ __html: preview }}
            />
          ) : (
            <p className="rounded-xl p-5 text-sm v-muted v-soft">
              Start writing to see your policy here.
            </p>
          )}
        </section>
      </div>
    </AdminPage>
  );
}
