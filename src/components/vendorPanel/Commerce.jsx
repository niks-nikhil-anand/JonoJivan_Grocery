"use client";
/* Product uploads are already hosted and optimized by Cloudinary. */
/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LuPlus,
  LuPackage,
  LuShoppingCart,
  LuIndianRupee,
  LuStar,
  LuArrowUpRight,
  LuPrinter,
} from "react-icons/lu";
import {
  api,
  useData,
  DataState,
  PageHeader,
  Stat,
  ListTable,
  Badge,
  Empty,
  Notice,
  money,
  date,
  label,
  base,
} from "./ui";
const productColumns = [
  {
    title: "Product",
    render: (p) => (
      <Link
        className="flex min-w-48 items-center gap-3 font-semibold"
        href={`${base}/product/${p.id}`}
      >
        <ProductImage src={p.featuredImageUrl} name={p.name} />
        <span>
          {p.name}
          <span className="mt-1 block text-xs font-normal v-muted">
            {p.category?.name}
          </span>
        </span>
      </Link>
    ),
  },
  {
    title: "Price",
    render: (p) => (
      <span className="whitespace-nowrap">{money(p.salePrice)}</span>
    ),
  },
  {
    title: "Stock",
    render: (p) => (
      <span className={p.stock < 10 ? "v-green font-semibold" : ""}>
        {p.stock} units
      </span>
    ),
  },
  { title: "Status", render: (p) => <Badge value={p.status} /> },
  {
    title: "Action",
    render: (p) => (
      <Link className="v-link" href={`${base}/product/${p.id}/edit`}>
        Edit<span className="sr-only"> {p.name}</span>
      </Link>
    ),
  },
];
const orderColumns = [
  {
    title: "Order",
    render: (o) => (
      <Link
        className="v-link whitespace-nowrap"
        href={`${base}/orders/${o.id}`}
      >
        {o.invoiceNo}
      </Link>
    ),
  },
  {
    title: "Placed",
    render: (o) => (
      <span className="whitespace-nowrap">{date(o.orderedAt)}</span>
    ),
  },
  {
    title: "Your items",
    render: (o) => o.items.reduce((s, i) => s + i.quantity, 0),
  },
  { title: "Item subtotal", render: (o) => money(o.subtotal) },
  { title: "Fulfillment", render: (o) => <Badge value={o.status} /> },
  { title: "Payment", render: (o) => <Badge value={o.paymentStatus} /> },
];
export function ProductImage({ src, name, large = false }) {
  const [broken, setBroken] = useState(false);
  return src && !broken ? (
    /* eslint-disable-next-line @next/next/no-img-element */ <img
      src={src}
      alt={large ? name : ""}
      onError={() => setBroken(true)}
      className={
        large
          ? "aspect-square w-full rounded-2xl object-contain v-soft"
          : "h-11 w-11 shrink-0 rounded-lg object-cover v-soft"
      }
    />
  ) : (
    <div
      className={`flex items-center justify-center rounded-xl v-soft v-muted ${large ? "aspect-square" : "h-11 w-11 shrink-0"}`}
    >
      <LuPackage size={large ? 60 : 22} aria-hidden />
    </div>
  );
}
export function Dashboard() {
  const products = useData("products"),
    orders = useData("orders"),
    [range, setRange] = useState("30");
  const p = products.data || [],
    all = orders.data || [],
    start = range === "all" ? 0 : Date.now() - Number(range) * 86400000,
    o = all.filter((row) => new Date(row.orderedAt).getTime() >= start);
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - 5 + i);
    const total = all
      .filter(
        (row) =>
          new Date(row.orderedAt).getMonth() === d.getMonth() &&
          new Date(row.orderedAt).getFullYear() === d.getFullYear() &&
          row.status !== "CANCELLED",
      )
      .reduce((s, row) => s + row.subtotal, 0);
    return { name: d.toLocaleDateString("en-IN", { month: "short" }), total };
  });
  const max = Math.max(1, ...months.map((m) => m.total));
  return (
    <DataState state={products}>
      <DataState state={orders}>
        <PageHeader
          title="Your store, at a glance"
          description="Keep your products fresh and your orders moving."
          action={
            <Link className="v-button" href={`${base}/product/addProduct`}>
              <LuPlus />
              Add product
            </Link>
          }
        />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[.15em] v-green">
            Store overview
          </p>
          <select
            aria-label="Dashboard reporting period"
            className="v-input !w-auto"
            value={range}
            onChange={(e) => setRange(e.target.value)}
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="all">All time</option>
          </select>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Stat
            title="Item sales"
            value={money(
              o
                .filter((r) => r.status !== "CANCELLED")
                .reduce((s, r) => s + r.subtotal, 0),
            )}
            hint="Your order items · excludes cancelled orders"
            icon={LuIndianRupee}
          />
          <Stat
            title="Orders"
            value={o.length}
            hint={`${o.filter((r) => !["DELIVERED", "CANCELLED"].includes(r.status)).length} awaiting fulfillment`}
            icon={LuShoppingCart}
          />
          <Stat
            title="Products"
            value={p.length}
            hint={`${p.filter((r) => r.status === "ACTIVE").length} active in your catalog`}
            icon={LuPackage}
          />
          <Stat
            title="Low stock"
            value={p.filter((r) => r.stock < 10).length}
            hint="Products with fewer than 10 units"
          />
        </div>
        <div className="grid gap-5 xl:grid-cols-[1.45fr_1fr]">
          <section className="v-panel p-5 sm:p-6">
            <h2 className="text-lg font-semibold">Sales overview</h2>
            <p className="mt-1 text-sm v-muted">
              Your item sales over the last six months
            </p>
            <div
              className="mt-6 flex h-52 items-end gap-3"
              role="img"
              aria-label={months
                .map((m) => `${m.name}: ${money(m.total)}`)
                .join(", ")}
            >
              {months.map((m) => (
                <div
                  key={m.name}
                  className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"
                >
                  <span className="text-[10px] v-muted">{money(m.total)}</span>
                  <div
                    className="w-full max-w-12 rounded-t-lg bg-brand-600"
                    style={{
                      height: `${Math.max(2, (m.total / max) * 130)}px`,
                    }}
                  />
                  <span className="text-xs v-muted">{m.name}</span>
                </div>
              ))}
            </div>
          </section>
          <section className="v-panel p-5 sm:p-6">
            <h2 className="text-lg font-semibold">Inventory watch</h2>
            <p className="mt-1 text-sm v-muted">
              A little attention goes a long way.
            </p>
            {p.filter((r) => r.stock < 10).length ? (
              <div className="mt-5 space-y-3">
                {p
                  .filter((r) => r.stock < 10)
                  .slice(0, 4)
                  .map((r) => (
                    <Link
                      key={r.id}
                      href={`${base}/product/${r.id}/edit`}
                      className="flex items-center justify-between gap-3 rounded-xl p-3 v-soft"
                    >
                      <span className="truncate text-sm font-medium">
                        {r.name}
                      </span>
                      <span className="shrink-0 text-xs v-green">
                        {r.stock} left
                      </span>
                    </Link>
                  ))}
              </div>
            ) : (
              <Empty
                title="All clear"
                description="Low-stock products will appear here."
              />
            )}
          </section>
        </div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent orders</h2>
          <Link
            className="v-link flex items-center gap-1 text-sm"
            href={`${base}/orders`}
          >
            View all
            <LuArrowUpRight />
          </Link>
        </div>
        <ListTable
          rows={o.slice(0, 10)}
          columns={orderColumns}
          searchText={(r) => r.invoiceNo}
          emptyTitle="Your first order starts here"
          emptyDescription="Orders containing your products will appear here."
        />
      </DataState>
    </DataState>
  );
}
export function Products({ query = "" }) {
  const state = useData("products");
  return (
    <DataState state={state}>
      <PageHeader
        title="Products"
        description="Manage your catalog, stock, and product information."
        action={
          <Link className="v-button" href={`${base}/product/addProduct`}>
            <LuPlus />
            Add product
          </Link>
        }
      />
      <ListTable
        rows={state.data || []}
        columns={productColumns}
        searchText={(r) => `${r.name} ${r.category?.name}`}
        statuses={["ACTIVE", "IN_REVIEW", "INACTIVE", "OUT_OF_STOCK"]}
        initialSearch={query}
        emptyTitle="Build your first shelf"
        emptyDescription="Add a product with photos, pricing, and stock to get started."
      />
    </DataState>
  );
}
export function Orders({ query = "" }) {
  const state = useData("orders");
  return (
    <DataState state={state}>
      <PageHeader
        title="Orders"
        description="Track and fulfill orders containing your products."
      />
      <ListTable
        rows={state.data || []}
        columns={orderColumns}
        searchText={(r) => r.invoiceNo}
        dateKey="orderedAt"
        statuses={[
          "PENDING",
          "ORDER_PLACED",
          "PROCESSING",
          "PICKED_UP",
          "OUT_FOR_DELIVERY",
          "DELIVERED",
          "CANCELLED",
        ]}
        initialSearch={query}
        emptyTitle="No orders yet"
        emptyDescription="Your incoming orders will appear here, ready to fulfill."
      />
    </DataState>
  );
}
export function ProductDetail({ id }) {
  const state = useData(`products/${id}`),
    [confirm, setConfirm] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const p = state.data;
  async function archive() {
    setBusy(true);
    setError("");
    try {
      await api(`products/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ action: "archive" }),
      });
      setConfirm(false);
      state.reload();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <DataState state={state}>
      {p && (
        <>
          <PageHeader
            title={p.name}
            parent={{ href: `${base}/product/allProduct`, label: "Products" }}
            description="Product information and publishing status."
            action={
              <Link className="v-button" href={`${base}/product/${id}/edit`}>
                Edit product
              </Link>
            }
          />
          <Notice error={error} />
          <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
            <section className="v-panel p-5">
              <ProductImage src={p.featuredImageUrl} name={p.name} large />
              <div className="mt-4 flex flex-wrap gap-3">
                {p.images.map((src) => (
                  <ProductImage key={src} src={src} name={p.name} />
                ))}
              </div>
            </section>
            <section className="v-panel space-y-6 p-6">
              <Badge value={p.status} />
              <div>
                <p className="text-3xl font-bold">{money(p.salePrice)}</p>
                <p className="mt-2 text-sm v-muted">
                  Original price: {money(p.originalPrice)}
                </p>
              </div>
              <dl className="grid grid-cols-2 gap-5 text-sm">
                {[
                  ["Stock", `${p.stock} units`],
                  ["Pack size", `${p.weightValue} ${p.weightUnit}`],
                  ["Category", p.category.name],
                  ["Subcategory", p.subCategory.name],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="v-muted">{k}</dt>
                    <dd className="mt-1 font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
              <div>
                <h2 className="font-semibold">Description</h2>
                <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-7 v-muted">
                  {typeof p.description === "string"
                    ? p.description
                    : JSON.stringify(p.description)}
                </p>
              </div>
              {p.tags.length > 0 && (
                <p className="text-sm v-muted">Tags: {p.tags.join(", ")}</p>
              )}
              {p.status !== "INACTIVE" &&
                (confirm ? (
                  <div className="rounded-xl border p-4 v-border">
                    <p className="mb-3 text-sm">
                      Archive this product? It will no longer be available in
                      the store.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        className="v-button danger"
                        disabled={busy}
                        onClick={archive}
                      >
                        {busy ? "Archiving…" : "Confirm archive"}
                      </button>
                      <button
                        className="v-button secondary"
                        disabled={busy}
                        onClick={() => setConfirm(false)}
                      >
                        Keep product
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    className="v-button danger"
                    onClick={() => setConfirm(true)}
                  >
                    Archive product
                  </button>
                ))}
            </section>
          </div>
        </>
      )}
    </DataState>
  );
}
export function OrderDetail({ id }) {
  const state = useData(`orders/${id}`),
    [status, setStatus] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [success, setSuccess] = useState("");
  const o = state.data;
  async function update(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      await api(`orders/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setStatus("");
      setSuccess("Fulfillment updated for your items.");
      state.reload();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <DataState state={state}>
      {o && (
        <>
          <PageHeader
            title={`Order ${o.invoiceNo}`}
            description={`Placed ${date(o.orderedAt)} · Your items only`}
            parent={{ href: `${base}/orders`, label: "Orders" }}
            action={
              <button
                className="v-button secondary v-no-print"
                onClick={() => window.print()}
              >
                <LuPrinter />
                Print packing slip
              </button>
            }
          />
          <Notice error={error} success={success} />
          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <section className="v-panel overflow-hidden">
              <div className="flex flex-wrap gap-3 border-b p-5 v-border">
                <Badge value={o.status} />
                <Badge value={o.paymentStatus} />
              </div>
              <div className="overflow-x-auto">
                <table className="v-table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Quantity</th>
                      <th>Unit price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {o.items.map((i) => (
                      <tr key={i.id}>
                        <td>{i.product.name}</td>
                        <td>{i.quantity}</td>
                        <td>{money(i.unitPrice)}</td>
                        <td>{money(Number(i.unitPrice) * i.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between p-5 font-semibold">
                <span>Your item subtotal</span>
                <span>{money(o.subtotal)}</span>
              </div>
              <p className="px-5 pb-5 text-xs leading-5 v-muted">
                Item prices recorded in the order’s cart. This packing slip
                excludes order-wide shipping, discounts, and other vendors’
                items.
              </p>
            </section>
            <div className="space-y-5">
              <section className="v-panel p-5">
                <h2 className="font-semibold">Delivery details</h2>
                <address className="mt-3 whitespace-pre-line text-sm not-italic leading-7 v-muted">
                  {o.address.firstName} {o.address.lastName}
                  {"\n"}
                  {o.address.addressLine1}
                  {"\n"}
                  {o.address.apartment}
                  {"\n"}
                  {o.address.city}, {o.address.state} {o.address.postalCode}
                  {"\n"}
                  {o.address.mobileNumber}
                </address>
                <p className="mt-4 text-xs v-muted">
                  Payment method: {label(o.paymentMethod)}
                </p>
              </section>
              <section className="v-panel p-5 v-no-print">
                <h2 className="font-semibold">Update fulfillment</h2>
                <p className="mt-2 text-sm leading-6 v-muted">
                  Updates apply to your items. Payment status is managed by the
                  payment system.
                </p>
                {o.nextStatuses.length ? (
                  <form onSubmit={update} className="mt-4 space-y-3">
                    <select
                      aria-label="Next fulfillment status"
                      required
                      className="v-input"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="">Choose next status</option>
                      {o.nextStatuses.map((s) => (
                        <option key={s} value={s}>
                          {label(s)}
                        </option>
                      ))}
                    </select>
                    <button className="v-button w-full" disabled={busy}>
                      {busy ? "Updating…" : "Update status"}
                    </button>
                  </form>
                ) : (
                  <p className="mt-4 text-sm v-green">
                    This order is {label(o.status).toLowerCase()}.
                  </p>
                )}
              </section>
            </div>
          </div>
          <section className="v-panel p-5">
            <h2 className="font-semibold">Fulfillment timeline</h2>
            <ol className="mt-4 space-y-4">
              <li className="border-l-2 pl-4 v-border">
                <p className="text-sm font-medium">Order placed</p>
                <p className="text-xs v-muted">{date(o.orderedAt)}</p>
              </li>
              {o.history.map((h, i) => (
                <li key={i} className="border-l-2 border-brand-600 pl-4">
                  <p className="text-sm font-medium">{label(h.status)}</p>
                  <p className="text-xs v-muted">{date(h.at)}</p>
                </li>
              ))}
            </ol>
          </section>
        </>
      )}
    </DataState>
  );
}
export function Reviews() {
  const state = useData("reviews"),
    rows = state.data || [];
  return (
    <DataState state={state}>
      <PageHeader
        title="Customer reviews"
        description="See what customers are saying about your products."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Stat
          title="Average customer rating"
          value={
            rows.length
              ? `${(rows.reduce((s, r) => s + r.rating, 0) / rows.length).toFixed(1)} / 5`
              : "No ratings yet"
          }
          icon={LuStar}
        />
        <Stat title="Total reviews" value={rows.length} />
      </div>
      <ListTable
        rows={rows}
        searchText={(r) => `${r.product.name} ${r.title} ${r.body}`}
        statusKey="rating"
        statuses={["1", "2", "3", "4", "5"]}
        columns={[
          {
            title: "Product",
            render: (r) => (
              <Link className="v-link" href={`${base}/product/${r.product.id}`}>
                {r.product.name}
              </Link>
            ),
          },
          {
            title: "Rating",
            render: (r) => (
              <span className="whitespace-nowrap v-green">
                {r.rating} / 5 ★
              </span>
            ),
          },
          {
            title: "Review",
            render: (r) => (
              <div className="min-w-56 max-w-md">
                <p className="font-medium">{r.title}</p>
                <p className="mt-1 whitespace-pre-wrap text-sm v-muted">
                  {r.body}
                </p>
                <p className="mt-2 text-xs v-muted">
                  {r.name} · {date(r.createdAt)}
                </p>
              </div>
            ),
          },
        ]}
        emptyTitle="Feedback will grow here"
        emptyDescription="Reviews of your products appear here after customers submit them."
      />
    </DataState>
  );
}
export function SearchPage({ query }) {
  const router = useRouter();
  const [q, setQ] = useState(query);
  return (
    <>
      <PageHeader
        title="Search workspace"
        description="Find products by name and orders by invoice number."
      />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          router.push(`${base}/search?q=${encodeURIComponent(q)}`);
        }}
        className="flex gap-3"
      >
        <input
          className="v-input"
          aria-label="Search query"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button className="v-button">Search</button>
      </form>
      {query ? (
        <>
          <Products query={query} />
          <Orders query={query} />
        </>
      ) : (
        <Empty
          title="What are you looking for?"
          description="Enter a product name or order number to search your workspace."
        />
      )}
    </>
  );
}
