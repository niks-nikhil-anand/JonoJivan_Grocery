export const transitions = {
  PENDING: ["PROCESSING", "CANCELLED"],
  ORDER_PLACED: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["PICKED_UP", "CANCELLED"],
  PICKED_UP: ["OUT_FOR_DELIVERY"],
  OUT_FOR_DELIVERY: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
};
export function moneyInput(value) {
  const number = Number(value);
  if (
    value === "" ||
    value == null ||
    !Number.isFinite(number) ||
    number < 0 ||
    number > 999999999 ||
    Math.abs(number * 100 - Math.round(number * 100)) > 0.00001
  )
    throw new Error("Enter a valid amount with up to two decimal places.");
  return number;
}
export const productScope = (vendorId) => ({
  users: { some: { id: vendorId } },
});
export const orderScope = (vendorId) => ({
  cart: { items: { some: { product: productScope(vendorId) } } },
});
