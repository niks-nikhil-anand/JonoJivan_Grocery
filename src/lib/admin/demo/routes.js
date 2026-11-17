export const BASE = "/admin/dashboard";
export const navigation = [
  ["Overview", [["Dashboard", ""]]],
  [
    "Wallet",
    [
      ["Wallet overview", "/wallet"],
      ["Accounts", "/wallet/accounts"],
      ["Transactions", "/wallet/transactions"],
      ["Top-ups", "/wallet/topups"],
      ["Withdrawals", "/wallet/withdrawals"],
      ["Refunds", "/wallet/refunds"],
      ["Adjustments", "/wallet/adjustments"],
      ["Cashback", "/wallet/cashback"],
      ["Wallet reports", "/wallet/reports"],
      ["Wallet settings", "/wallet/settings"],
    ],
  ],
  [
    "Commerce",
    [
      ["Orders", "/orders"],
      ["Returns", "/orders/returns"],
      ["Products", "/product/allProduct"],
      ["Add product", "/product/addProduct"],
      ["Inventory", "/inventory"],
      ["Categories", "/category/allCategory"],
      ["Add category", "/category/addCategory"],
      ["Add subcategory", "/category/addSubCategory"],
      ["Add sub-subcategory", "/category/addSubSubCatgeory"],
    ],
  ],
  [
    "People",
    [
      ["Customers", "/users"],
      ["Vendors", "/vendors"],
      ["Ration cards", "/rationCards"],
    ],
  ],
  [
    "Finance",
    [
      ["Finance overview", "/finance"],
      ["Payments", "/finance/transactions"],
      ["Refunds", "/finance/refunds"],
      ["Settlements", "/finance/settlements"],
      ["Expenses", "/finance/expenses"],
      ["Reports", "/finance/reports"],
      ["Reconciliation", "/finance/reconciliation"],
    ],
  ],
  [
    "Services",
    [
      ["Service overview", "/services"],
      ["Recharges", "/services/recharges"],
      ["Bill payments", "/services/bills"],
    ],
  ],
  [
    "Content & promotions",
    [
      ["Blogs", "/blog/allBlog"],
      ["Add blog", "/blog/addBlog"],
      ["Reviews", "/reviews"],
      ["Coupons", "/promotions/coupons"],
      ["Banners", "/promotions/banners"],
    ],
  ],
  [
    "Support",
    [
      ["Tickets", "/support/tickets"],
      ["Messages", "/support/messages"],
      ["Notifications", "/notifications"],
    ],
  ],
  [
    "Policies",
    [
      ["Privacy", "/policy/privacyPolicy"],
      ["Returns", "/policy/returnPolicy"],
      ["Shipping", "/policy/shippingPolicy"],
      ["Terms", "/policy/termsAndCondition"],
    ],
  ],
  [
    "Workspace",
    [
      ["Profile", "/profile"],
      ["Settings", "/settings"],
      ["Roles & permissions", "/settings/roles"],
      ["Audit log", "/settings/audit-log"],
    ],
  ],
];
const list = (title, entity, extra = {}) => ({
  title,
  entity,
  view: "list",
  ...extra,
});
export const routes = {
  "": { title: "Your store at a glance", view: "dashboard" },
  "/wallet": { title: "Wallet overview", view: "wallet" },
  "/wallet/accounts": list("Wallet accounts", "accounts"),
  "/wallet/transactions": list("Wallet transactions", "entries"),
  "/wallet/topups": list("Customer top-ups", "topups", {
    create: "createTopup",
  }),
  "/wallet/withdrawals": list("Vendor withdrawals", "withdrawals", {
    create: "createWithdrawal",
  }),
  "/wallet/refunds": list("Wallet refunds", "refunds", {
    create: "createRefund",
    filter: "wallet",
  }),
  "/wallet/adjustments": list("Balance adjustments", "adjustments", {
    create: "createAdjustment",
  }),
  "/wallet/cashback": list("Promotional cashback", "cashback", {
    create: "createCashback",
  }),
  "/wallet/reports": { title: "Wallet reports", view: "walletReport" },
  "/wallet/settings": {
    title: "Wallet settings",
    view: "settings",
    entity: "settings",
    form: "walletSettings",
  },
  "/finance": { title: "Finance overview", view: "finance" },
  "/finance/transactions": list("Payments", "payments"),
  "/finance/refunds": list("All refunds", "refunds", {
    create: "createRefund",
  }),
  "/finance/settlements": list("Vendor settlements", "settlements"),
  "/finance/expenses": list("Operating expenses", "expenses", {
    create: "save",
  }),
  "/finance/reports": { title: "Financial reports", view: "financeReport" },
  "/finance/reconciliation": list("Payment reconciliation", "payments", {
    filter: "unmatched",
  }),
  "/orders": list("Orders", "orders"),
  "/orders/searchOrders": list("Search orders", "orders"),
  "/orders/returns": list("Returns", "returns", { create: "save" }),
  "/product/allProduct": list("Products", "products", {
    addHref: "/product/addProduct",
  }),
  "/product/addProduct": {
    title: "Add product",
    view: "form",
    entity: "products",
  },
  "/inventory": list("Inventory", "products", { inventory: true }),
  "/category/allCategory": list("Categories", "categories", {
    addHref: "/category/addCategory",
  }),
  "/category/addCategory": {
    title: "Add category",
    entity: "categories",
    view: "form",
  },
  "/category/addSubCategory": {
    title: "Add subcategory",
    entity: "categories",
    view: "form",
  },
  "/category/addSubSubCatgeory": {
    title: "Add sub-subcategory",
    entity: "categories",
    view: "form",
  },
  "/users": list("Customers", "customers"),
  "/user/search": list("Search customers", "customers"),
  "/vendors": list("Vendors", "vendors"),
  "/rationCards": list("Ration card applications", "rationCards"),
  "/services": { title: "Recharge & bill services", view: "services" },
  "/services/recharges": list("Recharges", "services", { filter: "Recharge" }),
  "/services/bills": list("Bill payments", "services", { filter: "Bill" }),
  "/blog/allBlog": list("Blog posts", "blogs", { addHref: "/blog/addBlog" }),
  "/blog/addBlog": {
    title: "Write a blog post",
    entity: "blogs",
    view: "form",
  },
  "/review/addReview": { title: "Add review", entity: "reviews", view: "form" },
  "/reviews": list("Review moderation", "reviews", {
    addHref: "/review/addReview",
  }),
  "/promotions/coupons": list("Coupons", "coupons", { create: "save" }),
  "/promotions/banners": list("Promotional banners", "banners", {
    create: "save",
  }),
  "/support/tickets": list("Support tickets", "tickets", { create: "save" }),
  "/support/messages": list("Contact messages", "messages"),
  "/notifications": list("Notifications", "notifications"),
  "/settings": {
    title: "Store settings",
    view: "settings",
    entity: "settings",
  },
  "/profile": { title: "Admin profile", view: "settings", entity: "profile" },
  "/settings/roles": { title: "Roles & permissions", view: "roles" },
  "/settings/audit-log": list("Audit log", "audit"),
};
[
  "privacyPolicy",
  "returnPolicy",
  "shippingPolicy",
  "termsAndCondition",
].forEach((id, i) => {
  routes[`/policy/${id}`] = {
    title: [
      "Privacy policy",
      "Return policy",
      "Shipping policy",
      "Terms and conditions",
    ][i],
    entity: "policies",
    view: "form",
    id,
  };
});
const details = [
  ["wallet/accounts", "accounts"],
  ["wallet/transactions", "entries"],
  ["wallet/withdrawals", "withdrawals"],
  ["finance/settlements", "settlements"],
  ["orders/returns", "returns"],
  ["orders", "orders"],
  ["product", "products"],
  ["category", "categories"],
  ["users", "customers"],
  ["vendors", "vendors"],
  ["rationCards", "rationCards"],
  ["services/transactions", "services"],
  ["blog", "blogs"],
  ["support/tickets", "tickets"],
];
export function resolveRoute(pathname) {
  const path = pathname.replace(BASE, "").replace(/\/$/, "");
  if (routes[path]) return routes[path];
  for (const [prefix, entity] of details) {
    const match = path.match(new RegExp(`^/${prefix}/([^/]+)(/edit)?$`));
    if (match) {
      if (match[2] && !["products", "categories", "blogs"].includes(entity))
        return null;
      return {
        title: `${match[2] ? "Edit" : "View"} ${entity === "entries" ? "transaction" : entity.replace(/s$/, "")}`,
        entity,
        id: decodeURIComponent(match[1]),
        view: match[2] ? "form" : "detail",
      };
    }
  }
  return null;
}
export function detailHref(entity, id) {
  const prefixes = {
    accounts: "/wallet/accounts",
    entries: "/wallet/transactions",
    withdrawals: "/wallet/withdrawals",
    settlements: "/finance/settlements",
    orders: "/orders",
    returns: "/orders/returns",
    products: "/product",
    categories: "/category",
    customers: "/users",
    vendors: "/vendors",
    rationCards: "/rationCards",
    services: "/services/transactions",
    blogs: "/blog",
    tickets: "/support/tickets",
  };
  return prefixes[entity]
    ? `${BASE}${prefixes[entity]}/${encodeURIComponent(id)}`
    : null;
}
export const listPaths = {
  products: "/product/allProduct",
  categories: "/category/allCategory",
  blogs: "/blog/allBlog",
  reviews: "/reviews",
  policies: "/settings",
};
