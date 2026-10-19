// Shop filter/sort options shared by the server query and the client UI.
// (Kept free of server imports so client components can use it.)

export const SORT_OPTIONS = [
  { id: "newest", label: "Newest" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "discount", label: "Biggest discount" },
];

export const PRICE_RANGES = [
  { id: "0-50", label: "Under ₹50", min: 0, max: 50 },
  { id: "50-100", label: "₹50 – ₹100", min: 50, max: 100 },
  { id: "100-250", label: "₹100 – ₹250", min: 100, max: 250 },
  { id: "250-500", label: "₹250 – ₹500", min: 250, max: 500 },
  { id: "500-", label: "Over ₹500", min: 500, max: null },
];

export const PAGE_SIZE = 20;
