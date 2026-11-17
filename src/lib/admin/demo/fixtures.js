export const DEMO_VERSION = 3;
export const DEMO_DATE = "2026-11-18";
const stamp = (i = 0) =>
  `2026-11-${String(18 - (i % 17)).padStart(2, "0")}T09:30:00.000Z`;
const names = [
  "Priya Sharma",
  "Arjun Das",
  "Meera Devi",
  "Rahul Nath",
  "Anita Bora",
  "Sanjay Roy",
  "Kaberi Das",
  "Nayan Ali",
  "Rupam Saikia",
  "Maya Sen",
];
const productNames = [
  "Basmati rice",
  "Assam oranges",
  "Full cream milk",
  "Mustard oil",
  "Fresh tomatoes",
  "Whole wheat atta",
  "Green tea",
  "Dishwash liquid",
  "Bananas",
  "Brown bread",
];
export function createFixtures() {
  const customers = Array.from({ length: 20 }, (_, i) => ({
    id: `CUS-${i + 1}`,
    name: `${names[i % 10]}${i > 9 ? " Jr." : ""}`,
    email: `customer${i + 1}@example.com`,
    phone: "••••••1200",
    address: `${i + 1} Demo Lane, Guwahati`,
    status: i === 19 ? "Suspended" : "Active",
    createdAt: stamp(i),
  }));
  const vendors = Array.from({ length: 6 }, (_, i) => ({
    id: `VEN-${i + 1}`,
    name: [
      "Green Basket",
      "Assam Fresh",
      "Daily Dairy",
      "Home Essentials",
      "Tea Garden",
      "Grain House",
    ][i],
    email: `vendor${i + 1}@example.com`,
    destination: `demo${i + 1}@example`,
    status: i === 5 ? "Pending" : "Active",
    createdAt: stamp(i),
  }));
  const categories = [
    "Fresh produce",
    "Dairy",
    "Staples",
    "Beverages",
    "Home care",
    "Bakery",
    "Snacks",
    "Personal care",
  ].map((name, i) => ({
    id: `CAT-${i + 1}`,
    name,
    parentId: "",
    status: "Active",
    createdAt: stamp(i),
  }));
  categories.push(
    {
      id: "CAT-9",
      name: "Fruit",
      parentId: "CAT-1",
      status: "Active",
      createdAt: stamp(),
    },
    {
      id: "CAT-10",
      name: "Citrus",
      parentId: "CAT-9",
      status: "Active",
      createdAt: stamp(),
    },
  );
  const products = Array.from({ length: 40 }, (_, i) => ({
    id: `PRD-${i + 1}`,
    name: `${productNames[i % 10]} · ${i < 10 ? "1 kg / pack" : `${Math.floor(i / 10) + 1} pack`}`,
    categoryId: `CAT-${(i % 8) + 1}`,
    vendorId: `VEN-${(i % 6) + 1}`,
    price: (60 + i * 15) * 100,
    stock: i % 7 === 0 ? 0 : i % 5 === 0 ? 5 : 30 + i,
    status: "Active",
    image: "/images/admin-demo-product.svg",
    createdAt: stamp(i),
  }));
  const orders = Array.from({ length: 40 }, (_, i) => {
    const product = products[i];
    return {
      id: `ORD-${i + 1}`,
      name: `Order ${i + 1}`,
      customerId: `CUS-${(i % 20) + 1}`,
      vendorId: product.vendorId,
      productId: product.id,
      productName: product.name,
      unitPrice: product.price,
      quantity: 2,
      amount: product.price * 2,
      method: i % 3 === 0 ? "Wallet" : i % 3 === 1 ? "UPI" : "COD",
      status: [
        "Delivered",
        "Delivered",
        "Processing",
        "Shipped",
        "Pending",
        "Cancelled",
        "Returned",
        "Delivered",
      ][i % 8],
      paymentStatus:
        i % 3 === 2 && ![0, 1, 6, 7].includes(i % 8) ? "Pending" : "Paid",
      createdAt: stamp(i),
      history: [
        { status: "Placed", createdAt: stamp(i), note: "Demo order received" },
      ],
    };
  });
  orders.forEach((order) =>
    order.history.push({
      status: order.status,
      note: "Latest fulfillment update",
      createdAt: order.createdAt,
    }),
  );
  const accounts = [
    ...customers.map((c, i) => ({
      id: `WAL-C${i + 1}`,
      ownerId: c.id,
      name: c.name,
      type: "Customer",
      status: i === 19 ? "Frozen" : "Active",
      createdAt: stamp(i),
    })),
    ...vendors.map((v, i) => ({
      id: `WAL-V${i + 1}`,
      ownerId: v.id,
      name: v.name,
      type: "Vendor",
      status: "Active",
      createdAt: stamp(i),
    })),
  ];
  const entries = accounts.map((a, i) => ({
    id: `LED-OPEN-${i + 1}`,
    walletId: a.id,
    name: "Opening balance",
    kind: a.type === "Vendor" ? "Earnings" : "Top-up",
    amount: a.type === "Vendor" ? 1200000 : 1000000,
    sourceId: "OPENING",
    status: "Posted",
    createdAt: stamp(16),
  }));
  const payments = orders
    .filter((o) => o.paymentStatus === "Paid")
    .map((o) => ({
      id: `PAY-${o.id}`,
      name: `Payment for ${o.id}`,
      sourceId: o.id,
      customerId: o.customerId,
      amount: o.amount,
      method: o.method,
      status: "Paid",
      matched: true,
      createdAt: o.createdAt,
    }));
  orders
    .filter((o) => o.method === "Wallet")
    .forEach((o) =>
      entries.push({
        id: `LED-${o.id}`,
        walletId: `WAL-C${o.customerId.split("-")[1]}`,
        name: `Purchase ${o.id}`,
        kind: "Purchase",
        amount: -o.amount,
        sourceId: o.id,
        status: "Posted",
        createdAt: o.createdAt,
      }),
    );
  const usedOrders = new Set();
  const settlements = Array.from({ length: 8 }, (_, i) => {
    const vendorId = `VEN-${(i % 6) + 1}`;
    const batch = orders
      .filter(
        (o) =>
          o.vendorId === vendorId &&
          o.status === "Delivered" &&
          !usedOrders.has(o.id),
      )
      .slice(0, i < 6 ? 1 : 3);
    batch.forEach((o) => usedOrders.add(o.id));
    const amount = batch.reduce((sum, o) => sum + o.amount, 0);
    return {
      id: `SET-${i + 1}`,
      name: `Settlement ${i + 1}`,
      vendorId,
      orderIds: batch.map((o) => o.id),
      amount,
      fee: Math.round(amount * 0.05),
      status: i < 6 && amount > 0 ? "Posted" : "Draft",
      createdAt: stamp(),
    };
  });
  settlements
    .filter((s) => s.status === "Posted")
    .forEach((s) =>
      entries.push({
        id: `LED-${s.id}`,
        walletId: `WAL-V${s.vendorId.split("-")[1]}`,
        name: s.name,
        kind: "Settlement",
        amount: s.amount - s.fee,
        sourceId: s.id,
        status: "Posted",
        createdAt: s.createdAt,
      }),
    );
  const withdrawals = Array.from({ length: 12 }, (_, i) => ({
    id: `WD-${i + 1}`,
    walletId: `WAL-V${(i % 6) + 1}`,
    name: `Payout request ${i + 1}`,
    amount: (i + 1) * 10000,
    destination: `demo${(i % 6) + 1}@example`,
    status: ["Pending", "Approved", "Processing", "Paid", "Rejected", "Failed"][
      i % 6
    ],
    reason: i % 6 > 3 ? "Demo review outcome" : "",
    reference: i % 6 === 3 ? `DEMO-UTR-${i + 1}` : "",
    createdAt: stamp(i),
    history: [
      { status: "Pending", note: "Requested by vendor", createdAt: stamp(i) },
    ],
  }));
  const refunds = payments.slice(0, 10).map((p, i) => ({
    id: `REF-${i + 1}`,
    name: `Refund ${i + 1}`,
    paymentId: p.id,
    walletId: `WAL-C${p.customerId.split("-")[1]}`,
    amount: Math.floor(p.amount / 2),
    destination: i % 2 ? "Original payment" : "Wallet",
    reason: "Item unavailable",
    status: ["Pending", "Completed", "Rejected"][i % 3],
    createdAt: stamp(i),
  }));
  refunds
    .filter((r) => r.status === "Completed" && r.destination === "Wallet")
    .forEach((r) =>
      entries.push({
        id: `LED-${r.id}`,
        walletId: r.walletId,
        name: r.name,
        kind: "Refund",
        amount: r.amount,
        sourceId: r.id,
        status: "Posted",
        createdAt: r.createdAt,
      }),
    );
  // Small, traceable historical credits provide a useful multi-page ledger.
  for (let i = 0; i < 60; i++)
    entries.push({
      id: `LED-HIST-${i + 1}`,
      walletId: `WAL-C${(i % 20) + 1}`,
      name: "Historical demo top-up",
      kind: "Top-up",
      amount: 10000,
      sourceId: `TOP-HIST-${i + 1}`,
      status: "Posted",
      createdAt: stamp(i),
    });
  const topups = entries
    .filter((e) => e.kind === "Top-up" && e.sourceId.startsWith("TOP-"))
    .map((e) => ({
      id: e.sourceId,
      name: e.name,
      walletId: e.walletId,
      amount: e.amount,
      status: "Completed",
      createdAt: e.createdAt,
    }));
  topups.push(
    {
      id: "TOP-PENDING",
      name: "Awaiting confirmation",
      walletId: "WAL-C1",
      amount: 50000,
      status: "Pending",
      createdAt: stamp(),
    },
    {
      id: "TOP-FAILED",
      name: "Payment declined",
      walletId: "WAL-C2",
      amount: 20000,
      status: "Failed",
      createdAt: stamp(),
    },
  );
  const cashback = customers.slice(0, 8).map((c, i) => ({
    id: `CB-${i + 1}`,
    name: "Welcome reward",
    walletId: `WAL-C${i + 1}`,
    amount: 5000,
    status: ["Pending", "Earned", "Expired"][i % 3],
    expiresAt: "2026-12-18",
    createdAt: stamp(i),
  }));
  const services = Array.from({ length: 20 }, (_, i) => ({
    id: `SVC-${i + 1}`,
    name: [
      "Mobile recharge",
      "DTH recharge",
      "Electricity bill",
      "Broadband bill",
    ][i % 4],
    type: i % 4 < 2 ? "Recharge" : "Bill",
    customerId: `CUS-${(i % 20) + 1}`,
    provider: ["Demo Mobile", "Demo DTH", "Demo Electricity", "Demo Broadband"][
      i % 4
    ],
    identifier: "••••••1234",
    amount: [39900, 59900, 64900, 89900][i % 4],
    status: ["Completed", "Processing", "Failed", "Refunded"][i % 4],
    createdAt: stamp(i),
  }));
  services.forEach((service) => {
    service.history = [
      {
        status: "Submitted",
        note: "Payment received by demo provider",
        createdAt: service.createdAt,
      },
      {
        status: service.status,
        note: `Demo provider outcome: ${service.status}`,
        createdAt: service.createdAt,
      },
    ];
  });
  services
    .filter((s) => ["Completed", "Processing", "Refunded"].includes(s.status))
    .forEach((s) =>
      payments.push({
        id: `PAY-${s.id}`,
        name: s.name,
        sourceId: s.id,
        customerId: s.customerId,
        amount: s.amount,
        method: "UPI",
        status: "Paid",
        matched: s.status !== "Processing",
        createdAt: s.createdAt,
      }),
    );
  services
    .filter((s) => s.status === "Refunded")
    .forEach((s) =>
      refunds.push({
        id: `REF-${s.id}`,
        name: `Refund ${s.id}`,
        paymentId: `PAY-${s.id}`,
        walletId: `WAL-C${s.customerId.split("-")[1]}`,
        amount: s.amount,
        destination: "Original payment",
        reason: "Provider could not fulfill",
        status: "Completed",
        createdAt: s.createdAt,
      }),
    );
  return {
    version: DEMO_VERSION,
    processedActions: [],
    sequence: 1000,
    role: "Super admin",
    customers,
    vendors,
    categories,
    products,
    orders,
    accounts,
    entries,
    payments,
    withdrawals,
    refunds,
    settlements,
    topups,
    cashback,
    services,
    adjustments: [
      {
        id: "ADJ-1",
        walletId: "WAL-C1",
        name: "Goodwill credit",
        amount: 10000,
        reason: "Delivery delay",
        status: "Pending",
        actor: "Finance",
        createdAt: stamp(),
      },
    ],
    expenses: Array.from({ length: 12 }, (_, i) => ({
      id: `EXP-${i + 1}`,
      name: ["Delivery", "Packaging", "Warehouse rent"][i % 3],
      amount: (i + 1) * 15000,
      status: "Recorded",
      createdAt: stamp(i),
    })),
    returns: [
      {
        id: "RET-1",
        name: "Damaged packaging",
        orderId: "ORD-1",
        reason: "Package arrived damaged",
        status: "Pending",
        createdAt: stamp(),
      },
    ],
    tickets: Array.from({ length: 12 }, (_, i) => ({
      id: `TKT-${i + 1}`,
      name: ["Refund request", "Payout status", "Missing item"][i % 3],
      ownerId: i % 2 ? `VEN-${(i % 6) + 1}` : `CUS-${i + 1}`,
      priority: ["Normal", "High"][i % 2],
      assignee: "Support",
      status: i % 3 ? "Open" : "Resolved",
      messages: [
        {
          text: "Please help me with this demo request.",
          actor: "Customer",
          createdAt: stamp(i),
        },
      ],
      createdAt: stamp(i),
    })),
    messages: Array.from({ length: 8 }, (_, i) => ({
      id: `MSG-${i + 1}`,
      name: `Delivery enquiry ${i + 1}`,
      email: `visitor${i + 1}@example.com`,
      message: "Do you deliver to my area?",
      status: "Unread",
      createdAt: stamp(i),
    })),
    reviews: Array.from({ length: 20 }, (_, i) => ({
      id: `REV-${i + 1}`,
      name: ["Fresh and well packed", "Good value", "Delivery could be faster"][
        i % 3
      ],
      productId: `PRD-${i + 1}`,
      customerId: `CUS-${i + 1}`,
      rating: (i % 5) + 1,
      status: i % 3 ? "Published" : "Pending",
      createdAt: stamp(i),
    })),
    blogs: Array.from({ length: 6 }, (_, i) => ({
      id: `BLOG-${i + 1}`,
      name: [
        "Seasonal produce guide",
        "A healthier pantry",
        "Meet our growers",
        "Everyday meal planning",
        "Shopping locally",
        "Reducing food waste",
      ][i],
      content:
        "Fresh ingredients make everyday meals better. Explore seasonal produce, plan your weekly essentials, and store groceries carefully to keep them fresh for longer.",
      status: i % 2 ? "Draft" : "Published",
      createdAt: stamp(i),
    })),
    coupons: Array.from({ length: 6 }, (_, i) => ({
      id: `CPN-${i + 1}`,
      name: `FRESH${i + 1}0`,
      discount: (i + 1) * 5,
      limit: 100,
      expiresAt: i > 3 ? "2026-11-01" : "2026-12-31",
      status: i > 3 ? "Expired" : "Active",
      createdAt: stamp(i),
    })),
    banners: Array.from({ length: 4 }, (_, i) => ({
      id: `BAN-${i + 1}`,
      name: [
        "Fresh arrivals",
        "Weekly essentials",
        "Local favourites",
        "Save on your basket",
      ][i],
      content: "Discover fresh groceries for your family.",
      status: i ? "Active" : "Draft",
      createdAt: stamp(i),
    })),
    rationCards: Array.from({ length: 8 }, (_, i) => ({
      id: `RAT-${i + 1}`,
      name: customers[i].name,
      customerId: customers[i].id,
      identifier: "•••• •••• 1234",
      reason: "",
      status: ["Pending", "Approved", "Rejected"][i % 3],
      createdAt: stamp(i),
    })),
    policies: [
      "privacyPolicy",
      "returnPolicy",
      "shippingPolicy",
      "termsAndCondition",
    ].map((id, i) => ({
      id,
      name: [
        "Privacy policy",
        "Return policy",
        "Shipping policy",
        "Terms and conditions",
      ][i],
      content: [
        "We use account and order information to provide grocery delivery and support. This sample policy is for the admin demo only.",
        "Report damaged or missing items through support. Approved refunds return to the selected payment destination. This is sample policy content.",
        "Delivery availability and estimated arrival are shown at checkout. Our team will share order updates. This is sample policy content.",
        "Review your order and delivery details before confirming. Contact support with questions about products or services. These are sample terms.",
      ][i],
      status: "Published",
      createdAt: stamp(i),
    })),
    notifications: [
      {
        id: "NTF-1",
        name: "Withdrawal awaiting review",
        href: "/wallet/withdrawals/WD-1",
        status: "Unread",
        createdAt: stamp(),
      },
      {
        id: "NTF-2",
        name: "Stock needs attention",
        href: "/inventory",
        status: "Unread",
        createdAt: stamp(),
      },
    ],
    audit: [
      {
        id: "AUD-1",
        name: "Demo workspace initialized",
        actor: "System",
        reason: "Synthetic records loaded",
        status: "Recorded",
        createdAt: stamp(),
      },
    ],
    settings: {
      name: "JonoJivan Grocery",
      email: "store@example.com",
      withdrawalMinimum: 100,
      withdrawalMaximum: 10000000,
      cashbackPercent: 5,
      approvalRequired: true,
    },
    profile: { name: "Demo Administrator", email: "admin@example.com" },
  };
}
