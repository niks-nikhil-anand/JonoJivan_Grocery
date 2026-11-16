export const ADMIN_DEMO_TRANSACTIONS = [
  { id: "TXN-24108", date: "2026-11-16 10:42", source: "Grocery order", customer: "Priya Sharma", method: "UPI · Razorpay", amount: 2480, status: "Paid" },
  { id: "TXN-24107", date: "2026-11-16 10:18", source: "Mobile recharge", customer: "Arjun Das", method: "UPI · Razorpay", amount: 399, status: "Paid" },
  { id: "TXN-24106", date: "2026-11-16 09:54", source: "Grocery order", customer: "Meera Devi", method: "Cash on delivery", amount: 1265, status: "Pending" },
  { id: "TXN-24105", date: "2026-11-16 09:20", source: "DTH recharge", customer: "Rahul Nath", method: "UPI · Razorpay", amount: 599, status: "Paid" },
  { id: "TXN-24104", date: "2026-11-15 19:45", source: "Grocery order", customer: "Anita Bora", method: "Card · Razorpay", amount: 3480, status: "Refunded" },
  { id: "TXN-24103", date: "2026-11-15 18:32", source: "Mobile recharge", customer: "Sanjay Roy", method: "UPI · Razorpay", amount: 249, status: "Paid" },
  { id: "TXN-24102", date: "2026-11-15 17:08", source: "Grocery order", customer: "Kaberi Das", method: "Cash on delivery", amount: 875, status: "Pending" },
  { id: "TXN-24101", date: "2026-11-15 15:51", source: "Grocery order", customer: "Nayan Ali", method: "UPI · Razorpay", amount: 1740, status: "Paid" },
];

export const ADMIN_DEMO_REFUNDS = [
  { id: "RFD-0082", date: "2026-11-16", customer: "Anita Bora", reference: "ORD-11904", reason: "Item unavailable", amount: 3480, status: "Processed" },
  { id: "RFD-0081", date: "2026-11-15", customer: "Rupam Saikia", reference: "ORD-11901", reason: "Duplicate payment", amount: 599, status: "Pending" },
  { id: "RFD-0080", date: "2026-11-14", customer: "Bina Das", reference: "TXN-24088", reason: "Recharge failed", amount: 249, status: "Review" },
  { id: "RFD-0079", date: "2026-11-12", customer: "Rakesh Nath", reference: "ORD-11874", reason: "Order cancelled", amount: 1260, status: "Processed" },
];

export const ADMIN_DEMO_SETTLEMENTS = [
  { id: "STL-11016", period: "Nov 16 · 00:00–12:00", channel: "Razorpay", transactions: 42, gross: 28450, fees: 712, net: 27738, status: "Processing" },
  { id: "STL-11015", period: "Nov 15 · 00:00–23:59", channel: "Razorpay", transactions: 86, gross: 62840, fees: 1571, net: 61269, status: "Settled" },
  { id: "STL-11014", period: "Nov 14 · 00:00–23:59", channel: "Razorpay", transactions: 73, gross: 51390, fees: 1285, net: 50105, status: "Settled" },
  { id: "STL-11013", period: "Nov 13 · 00:00–23:59", channel: "Cash on delivery", transactions: 31, gross: 24120, fees: 0, net: 24120, status: "Pending" },
];

export const ADMIN_DEMO_EXPENSES = [
  { id: "EXP-041", date: "2026-11-16", category: "Delivery", description: "Local delivery partners", vendor: "Neighbourhood Fleet", amount: 4250, status: "Recorded" },
  { id: "EXP-040", date: "2026-11-15", category: "Packaging", description: "Paper bags and cartons", vendor: "GreenPack Supplies", amount: 2860, status: "Recorded" },
  { id: "EXP-039", date: "2026-11-14", category: "Marketing", description: "Weekend campaign", vendor: "JonoJivan Promo", amount: 5000, status: "Awaiting review" },
  { id: "EXP-038", date: "2026-11-12", category: "Operations", description: "Cold storage maintenance", vendor: "FreshStore Service", amount: 3200, status: "Recorded" },
  { id: "EXP-037", date: "2026-11-10", category: "Utilities", description: "Warehouse electricity", vendor: "Assam Power", amount: 4680, status: "Recorded" },
];

export const ADMIN_DEMO_MONTHS = [
  { label: "Jun", sales: 38 }, { label: "Jul", sales: 52 }, { label: "Aug", sales: 47 },
  { label: "Sep", sales: 66 }, { label: "Oct", sales: 73 }, { label: "Nov", sales: 88 },
];

export const ADMIN_DEMO_CATEGORIES = [
  { name: "Fresh produce", products: 48, stock: "Healthy", amount: 186400 },
  { name: "Staples & grains", products: 36, stock: "Healthy", amount: 154200 },
  { name: "Dairy & bakery", products: 29, stock: "Needs attention", amount: 98500 },
  { name: "Snacks & beverages", products: 41, stock: "Healthy", amount: 112850 },
];

export const ADMIN_DEMO_PRODUCTS = [
  { id: "JJ-1001", name: "Assam Joha Rice · 5 kg", category: "Staples & grains", stock: 34, price: 640, status: "Active" },
  { id: "JJ-1002", name: "Fresh Assam Oranges · 1 kg", category: "Fresh produce", stock: 8, price: 120, status: "Low stock" },
  { id: "JJ-1003", name: "Full Cream Milk · 1 L", category: "Dairy & bakery", stock: 46, price: 72, status: "Active" },
  { id: "JJ-1004", name: "Mustard Oil · 1 L", category: "Staples & grains", stock: 0, price: 185, status: "Out of stock" },
];

export const ADMIN_DEMO_USERS = [
  { id: "CUS-2048", name: "Priya Sharma", email: "priya.sharma@example.com", orders: 18, spent: 24860, status: "Active" },
  { id: "CUS-2047", name: "Arjun Das", email: "arjun.das@example.com", orders: 9, spent: 8420, status: "Active" },
  { id: "CUS-2046", name: "Meera Devi", email: "meera.devi@example.com", orders: 3, spent: 3190, status: "New" },
  { id: "CUS-2045", name: "Rahul Nath", email: "rahul.nath@example.com", orders: 12, spent: 16980, status: "Active" },
];

export const ADMIN_DEMO_ORDERS = [
  { id: "ORD-11908", customer: "Priya Sharma", date: "Nov 16, 10:42 AM", items: 6, payment: "Paid · UPI", amount: 2480, status: "Processing" },
  { id: "ORD-11907", customer: "Arjun Das", date: "Nov 16, 10:18 AM", items: 2, payment: "Paid · UPI", amount: 399, status: "Delivered" },
  { id: "ORD-11906", customer: "Meera Devi", date: "Nov 16, 09:54 AM", items: 4, payment: "COD", amount: 1265, status: "Pending" },
  { id: "ORD-11905", customer: "Rahul Nath", date: "Nov 15, 08:32 PM", items: 5, payment: "Paid · Card", amount: 1850, status: "Delivered" },
  { id: "ORD-11904", customer: "Anita Bora", date: "Nov 15, 07:45 PM", items: 8, payment: "Refunded", amount: 3480, status: "Cancelled" },
];

export const ADMIN_DEMO_BLOGS = [
  { id: "BLOG-028", title: "Seasonal greens from Assam farms", category: "Fresh produce", author: "JonoJivan Team", updated: "Nov 15, 2026", status: "Published" },
  { id: "BLOG-027", title: "How to store rice and pulses", category: "Kitchen tips", author: "JonoJivan Team", updated: "Nov 12, 2026", status: "Published" },
  { id: "BLOG-026", title: "A guide to everyday pantry staples", category: "Buying guides", author: "JonoJivan Team", updated: "Nov 09, 2026", status: "Draft" },
];

export const ADMIN_DEMO_REVIEWS = [
  { id: "REV-901", product: "Assam Joha Rice · 5 kg", customer: "Priya Sharma", rating: 5, comment: "Fragrant rice and quick delivery.", date: "Nov 16, 2026", status: "Approved" },
  { id: "REV-900", product: "Fresh Assam Oranges · 1 kg", customer: "Arjun Das", rating: 4, comment: "Fresh and nicely packed.", date: "Nov 15, 2026", status: "Pending" },
  { id: "REV-899", product: "Full Cream Milk · 1 L", customer: "Meera Devi", rating: 5, comment: "Delivered cold and on time.", date: "Nov 14, 2026", status: "Approved" },
];

export const ADMIN_DEMO_RATION_CARDS = [
  { id: "RC-1208", name: "Mina Das", card: "**** **** 4782", household: 4, district: "Nagaon", updated: "Nov 16, 2026", status: "Verified" },
  { id: "RC-1207", name: "Ratan Ali", card: "**** **** 9016", household: 5, district: "Nagaon", updated: "Nov 15, 2026", status: "In review" },
  { id: "RC-1206", name: "Kaberi Nath", card: "**** **** 3140", household: 3, district: "Morigaon", updated: "Nov 13, 2026", status: "Verified" },
];
