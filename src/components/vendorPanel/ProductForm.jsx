"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LuCheck,
  LuUpload,
  LuX,
  LuArrowLeft,
  LuArrowRight,
} from "react-icons/lu";
import {
  api,
  useData,
  DataState,
  PageHeader,
  Field,
  Notice,
  money,
  base,
} from "./ui";
import { ProductImage } from "./Commerce";
const blank = {
  name: "",
  description: "",
  categoryId: "",
  subCategoryId: "",
  salePrice: "",
  originalPrice: "",
  stock: "",
  weightValue: "",
  weightUnit: "kg",
  featuredImageUrl: "",
  images: [],
  tags: "",
};
const steps = [
  "Product details",
  "Pricing & stock",
  "Product images",
  "Review & submit",
];
export default function ProductForm({ id }) {
  const categories = useData("categories");
  return (
    <DataState state={categories}>
      {id ? (
        <ExistingProduct id={id} categories={categories.data || []} />
      ) : (
        <Editor categories={categories.data || []} />
      )}
    </DataState>
  );
}
function ExistingProduct({ id, categories }) {
  const state = useData(`products/${id}`);
  return (
    <DataState state={state}>
      {state.data && (
        <Editor
          id={id}
          categories={categories}
          initial={{
            ...state.data,
            description:
              typeof state.data.description === "string"
                ? state.data.description
                : JSON.stringify(state.data.description),
            tags: state.data.tags.join(", "),
          }}
        />
      )}
    </DataState>
  );
}
function Editor({ id, categories, initial = blank }) {
  const [form, setForm] = useState(initial),
    [step, setStep] = useState(0),
    [busy, setBusy] = useState(false),
    [uploading, setUploading] = useState(false),
    [error, setError] = useState(""),
    [dirty, setDirty] = useState(false);
  const router = useRouter(),
    formRef = useRef(null),
    titleRef = useRef(null);
  const category = categories.find((c) => c.id === form.categoryId);
  const update = (key, value) => {
    setForm((old) => ({
      ...old,
      [key]: value,
      ...(key === "categoryId" ? { subCategoryId: "" } : {}),
    }));
    setDirty(true);
  };
  useEffect(() => {
    if (!dirty) return;
    const before = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    const click = (e) => {
      const a = e.target.closest("a");
      if (
        a &&
        a.href !== window.location.href &&
        !window.confirm(
          "Leave this page? Your unsaved product changes will be lost.",
        )
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener("beforeunload", before);
    document.addEventListener("click", click, true);
    return () => {
      window.removeEventListener("beforeunload", before);
      document.removeEventListener("click", click, true);
    };
  }, [dirty]);
  async function upload(e, cover) {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (!files.length) return;
    setError("");
    if (!cover && form.images.length + files.length > 8) {
      setError("You can add up to eight gallery images.");
      return;
    }
    setUploading(true);
    try {
      const urls = [];
      for (const file of files) {
        if (
          !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
          file.size > 5 * 1024 * 1024
        )
          throw new Error("Choose JPG, PNG, or WebP images under 5 MB.");
        const body = new FormData();
        body.set("file", file);
        urls.push((await api("uploads", { method: "POST", body })).url);
      }
      update(
        cover ? "featuredImageUrl" : "images",
        cover ? urls[0] : [...form.images, ...urls],
      );
    } catch (e) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  }
  function advance(e) {
    e.preventDefault();
    setError("");
    if (step === 1 && Number(form.salePrice) > Number(form.originalPrice)) {
      setError("Sale price cannot exceed original price.");
      return;
    }
    if (step === 2 && !form.featuredImageUrl) {
      setError("Add a cover image before continuing.");
      return;
    }
    if (step < 3) {
      setStep(step + 1);
      setTimeout(() => titleRef.current?.focus(), 0);
    } else save();
  }
  async function save() {
    setBusy(true);
    setError("");
    try {
      const result = await api(id ? `products/${id}` : "products", {
        method: id ? "PATCH" : "POST",
        body: JSON.stringify(form),
      });
      setDirty(false);
      router.push(`${base}/product/${result.id}`);
      router.refresh();
    } catch (e) {
      setError(e.message);
      setBusy(false);
    }
  }
  const input = (key, type = "text", props = {}) => (
    <input
      className="v-input"
      type={type}
      value={form[key]}
      onChange={(e) => update(key, e.target.value)}
      {...props}
    />
  );
  return (
    <>
      <PageHeader
        title={id ? "Edit product" : "Add a new product"}
        description="Good details help customers find exactly what they need."
        parent={{ href: `${base}/product/allProduct`, label: "Products" }}
      />
      <div className="grid gap-6 xl:grid-cols-[1fr_280px]">
        <div className="min-w-0">
          <ol className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {steps.map((name, i) => (
              <li
                key={name}
                aria-current={step === i ? "step" : undefined}
                className={`flex items-center gap-2 rounded-xl border p-3 text-xs font-medium ${step === i ? "border-brand-600 v-green" : "v-border v-muted"}`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${i <= step ? "bg-brand-700 text-white" : "v-soft"}`}
                >
                  {i < step ? <LuCheck /> : i + 1}
                </span>
                {name}
              </li>
            ))}
          </ol>
          <form ref={formRef} onSubmit={advance} className="v-panel p-5 sm:p-7">
            <h2
              ref={titleRef}
              tabIndex={-1}
              className="mb-2 text-lg font-semibold"
            >
              {steps[step]}
            </h2>
            <p className="mb-6 text-sm v-muted">
              Step {step + 1} of 4 ·{" "}
              {step === 3
                ? "Check your details before sending for review."
                : "Fields marked * are required."}
            </p>
            <div className="space-y-5">
              <Notice error={error} />
              {step === 0 && (
                <>
                  <Field label="Product name *">
                    {input("name", "text", {
                      required: true,
                      maxLength: 200,
                      placeholder: "e.g. Fresh green apples",
                    })}
                  </Field>
                  <Field
                    label="Description *"
                    hint="Describe the product, its quality, and what is included."
                  >
                    <textarea
                      className="v-input min-h-36"
                      required
                      maxLength={10000}
                      value={form.description}
                      onChange={(e) => update("description", e.target.value)}
                    />
                  </Field>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Category *">
                      <select
                        className="v-input"
                        required
                        value={form.categoryId}
                        onChange={(e) => update("categoryId", e.target.value)}
                      >
                        <option value="">Select category</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Subcategory *">
                      <select
                        className="v-input"
                        required
                        disabled={!category}
                        value={form.subCategoryId}
                        onChange={(e) =>
                          update("subCategoryId", e.target.value)
                        }
                      >
                        <option value="">Select subcategory</option>
                        {category?.subcategories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>
                  {!categories.length && (
                    <p className="v-error">
                      No categories are available. Contact support to set up
                      your product category.
                    </p>
                  )}
                  <Field label="Tags" hint="Separate tags with commas.">
                    {input("tags", "text", {
                      maxLength: 500,
                      placeholder: "Fresh, organic, seasonal",
                    })}
                  </Field>
                </>
              )}
              {step === 1 && (
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Original price (₹) *">
                    {input("originalPrice", "number", {
                      required: true,
                      min: 0,
                      max: 999999999,
                      step: "0.01",
                    })}
                  </Field>
                  <Field label="Sale price (₹) *">
                    {input("salePrice", "number", {
                      required: true,
                      min: 0,
                      max: form.originalPrice || 999999999,
                      step: "0.01",
                    })}
                  </Field>
                  <Field label="Available stock *">
                    {input("stock", "number", {
                      required: true,
                      min: 0,
                      max: 1000000,
                      step: 1,
                    })}
                  </Field>
                  <Field label="Weight / pack quantity *">
                    {input("weightValue", "number", {
                      required: true,
                      min: 0.01,
                      max: 99999999,
                      step: "0.01",
                    })}
                  </Field>
                  <Field label="Unit *">
                    <select
                      className="v-input"
                      value={form.weightUnit}
                      onChange={(e) => update("weightUnit", e.target.value)}
                    >
                      {["kg", "g", "l", "ml", "piece", "pack"].map((u) => (
                        <option key={u}>{u}</option>
                      ))}
                    </select>
                  </Field>
                </div>
              )}
              {step === 2 && (
                <>
                  <Field
                    label="Cover image *"
                    hint="JPG, PNG, or WebP · Up to 5 MB"
                  >
                    <div className="rounded-xl border border-dashed p-5 v-border">
                      {form.featuredImageUrl && (
                        <div className="mb-4 max-w-40">
                          <ProductImage
                            src={form.featuredImageUrl}
                            name={form.name}
                            large
                          />
                        </div>
                      )}
                      <LuUpload
                        className="mb-3 v-green"
                        size={24}
                        aria-hidden
                      />
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        disabled={uploading}
                        onChange={(e) => upload(e, true)}
                        className="block w-full min-w-0 text-xs"
                      />
                    </div>
                  </Field>
                  <Field
                    label="Gallery images"
                    hint="Optional · Up to eight images"
                  >
                    <input
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/webp"
                      disabled={uploading}
                      onChange={(e) => upload(e, false)}
                      className="v-input"
                    />
                  </Field>
                  <div className="flex flex-wrap gap-3">
                    {form.images.map((src, i) => (
                      <div key={src + i} className="relative w-24">
                        <ProductImage src={src} name={form.name} large />
                        <button
                          type="button"
                          aria-label={`Remove gallery image ${i + 1}`}
                          onClick={() =>
                            update(
                              "images",
                              form.images.filter((_, index) => index !== i),
                            )
                          }
                          className="absolute right-0 top-0 rounded-full bg-slate-900 p-2 text-white"
                        >
                          <LuX />
                        </button>
                      </div>
                    ))}
                  </div>
                  {uploading && (
                    <p role="status" className="text-sm v-green">
                      Uploading images…
                    </p>
                  )}
                </>
              )}
              {step === 3 && (
                <>
                  <div className="flex flex-col gap-5 rounded-xl p-4 v-soft sm:flex-row">
                    <div className="w-32 shrink-0">
                      <ProductImage
                        src={form.featuredImageUrl}
                        name={form.name}
                        large
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold">{form.name}</h3>
                      <p className="mt-1 text-sm v-muted">
                        {category?.name} /{" "}
                        {
                          category?.subcategories.find(
                            (s) => s.id === form.subCategoryId,
                          )?.name
                        }
                      </p>
                      <p className="mt-3 text-xl font-bold">
                        {money(form.salePrice)}
                      </p>
                      <p className="mt-1 text-sm v-muted">
                        {form.stock} in stock · {form.weightValue}{" "}
                        {form.weightUnit}
                      </p>
                    </div>
                  </div>
                  <p className="whitespace-pre-wrap break-words text-sm leading-7 v-muted">
                    {form.description}
                  </p>
                  <p className="rounded-xl p-4 text-sm leading-6 v-soft">
                    {id ? "Your changes" : "Your new product"} will be submitted
                    for review before appearing in the store.
                  </p>
                </>
              )}
            </div>
            <div className="mt-8 flex flex-wrap justify-between gap-3 border-t pt-5 v-border">
              <button
                type="button"
                className="v-button secondary"
                disabled={busy || uploading}
                onClick={() => {
                  if (step) {
                    setStep(step - 1);
                    setError("");
                  } else if (
                    !dirty ||
                    window.confirm("Discard your unsaved changes?")
                  ) {
                    setDirty(false);
                    router.push(`${base}/product/allProduct`);
                  }
                }}
              >
                <LuArrowLeft />
                {step ? "Back" : "Cancel"}
              </button>
              <button className="v-button" disabled={busy || uploading}>
                {busy
                  ? "Saving product…"
                  : step === 3
                    ? "Submit for review"
                    : "Continue"}
                {!busy && <LuArrowRight />}
              </button>
            </div>
          </form>
        </div>
        <aside className="space-y-5">
          <section className="v-panel p-5">
            <span className="text-xs font-semibold uppercase tracking-widest v-green">
              A better product page
            </span>
            <h2 className="mt-3 font-semibold">
              Make a great first impression.
            </h2>
            <ul className="mt-4 space-y-4 text-sm leading-6 v-muted">
              <li>Use a clear name that shoppers can recognize.</li>
              <li>Keep prices and available stock accurate.</li>
              <li>Choose bright, focused photos of the actual product.</li>
              <li>Include pack size and useful product details.</li>
            </ul>
          </section>
          <Link
            className="v-link block px-2 text-sm"
            href={`${base}/tickets/new`}
          >
            Need a hand? Contact support →
          </Link>
        </aside>
      </div>
    </>
  );
}
