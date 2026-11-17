"use client";
import { useEffect, useState } from "react";
import { AdminPage, AdminPageHeader } from "./AdminPage";
export default function CategoryForm({ nested = false }) {
  const [categories, setCategories] = useState([]),
    [subcategories, setSubcategories] = useState([]),
    [category, setCategory] = useState(""),
    [sub, setSub] = useState(""),
    [loading, setLoading] = useState(true),
    [subLoading, setSubLoading] = useState(false),
    [saving, setSaving] = useState(false),
    [error, setError] = useState(""),
    [success, setSuccess] = useState(""),
    [retry, setRetry] = useState(0);
  const title = nested ? "Add sub-subcategory" : "Add subcategory";
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    fetch("/api/admin/dashboard/category", { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error("Unable to load categories.");
        return res.json();
      })
      .then((data) => {
        setCategories(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((e) => {
        if (e.name !== "AbortError") {
          setError(e.message);
          setLoading(false);
        }
      });
    return () => controller.abort();
  }, [retry]);
  useEffect(() => {
    setSub("");
    setSubcategories([]);
    if (!nested || !category) return;
    const controller = new AbortController();
    setSubLoading(true);
    setError("");
    fetch(`/api/admin/dashboard/category/${category}`, {
      signal: controller.signal,
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Unable to load subcategories.");
        return res.json();
      })
      .then(async (data) =>
        Promise.all(
          (data.subcategory || []).map(async (value) => {
            const id = typeof value === "string" ? value : value._id;
            const res = await fetch(`/api/admin/dashboard/subCatgeory/${id}`, {
              signal: controller.signal,
            });
            if (!res.ok) throw new Error("Unable to load subcategories.");
            return res.json();
          }),
        ),
      )
      .then((data) => {
        setSubcategories(data);
        setSubLoading(false);
      })
      .catch((e) => {
        if (e.name !== "AbortError") {
          setError(e.message);
          setSubLoading(false);
        }
      });
    return () => controller.abort();
  }, [category, nested, retry]);
  async function submit(e) {
    e.preventDefault();
    const form = e.currentTarget,
      body = new FormData(form);
    setError("");
    setSuccess("");
    const file = body.get("image");
    if (
      !file?.size ||
      file.size > 5 * 1024 * 1024 ||
      !["image/jpeg", "image/png", "image/webp"].includes(file.type)
    ) {
      setError("Choose a JPG, PNG, or WebP image under 5 MB.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(
        `/api/admin/dashboard/${nested ? "sub_subCategory" : "subCatgeory"}`,
        { method: "POST", body },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Unable to save this category.");
      setSuccess(
        `${nested ? "Sub-subcategory" : "Subcategory"} added successfully.`,
      );
      form.elements.name.value = "";
      form.elements.image.value = "";
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
        description="Organize products with a clear name and a recognizable image."
      />
      {error && (
        <p className="v-error" role="alert">
          {error}{" "}
          <button
            className="underline"
            type="button"
            onClick={() => setRetry((r) => r + 1)}
          >
            Retry loading
          </button>
        </p>
      )}
      {success && (
        <p className="v-success" role="status">
          {success}
        </p>
      )}
      <form
        onSubmit={submit}
        className="v-panel max-w-3xl space-y-5 p-5 sm:p-7"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-semibold">
            Parent category *
            <select
              name="category"
              required
              className="v-input mt-2"
              value={category}
              disabled={loading || saving}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">
                {loading ? "Loading categories…" : "Select a category"}
              </option>
              {categories.map((c) => (
                <option key={c._id || c.id} value={c._id || c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          {nested && (
            <label className="block text-sm font-semibold">
              Parent subcategory *
              <select
                required
                name="subCategory"
                className="v-input mt-2"
                value={sub}
                disabled={!category || subLoading || saving}
                onChange={(e) => setSub(e.target.value)}
              >
                <option value="">
                  {subLoading
                    ? "Loading subcategories…"
                    : "Select a subcategory"}
                </option>
                {subcategories.map((c) => (
                  <option key={c._id || c.id} value={c._id || c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
        {!loading && !categories.length && (
          <p className="rounded-xl p-4 text-sm v-soft v-muted">
            No parent categories are available yet.
          </p>
        )}
        <label className="block text-sm font-semibold">
          {nested ? "Sub-subcategory" : "Subcategory"} name *
          <input
            name="name"
            required
            maxLength={200}
            className="v-input mt-2"
            placeholder="Enter a category name"
          />
        </label>
        <label className="block text-sm font-semibold">
          Category image *
          <input
            name="image"
            required
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="v-input mt-2"
          />
          <span className="mt-2 block text-xs font-normal v-muted">
            JPG, PNG, or WebP · Maximum 5 MB
          </span>
        </label>
        <button
          disabled={loading || saving || !category || (nested && !sub)}
          className="v-button"
        >
          {saving ? "Saving…" : title}
        </button>
      </form>
    </AdminPage>
  );
}
