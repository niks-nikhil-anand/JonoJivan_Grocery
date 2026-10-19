"use client";
// Tiny wrapper around the existing localStorage cart (`cart` = [{ id, quantity }])
// used by the product page and /product/cart. Same format, so the homepage
// "Add" buttons and the cart page stay in sync.
import { useEffect, useState, useCallback } from "react";

const KEY = "cart";
const EVENT = "jj:cart-updated";

export function readCart() {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCart(cart) {
  try {
    localStorage.setItem(KEY, JSON.stringify(cart));
    window.dispatchEvent(new Event(EVENT));
  } catch {
    /* storage unavailable (private mode) – ignore */
  }
}

export function setQuantity(id, quantity) {
  const cart = readCart();
  const idx = cart.findIndex((item) => item.id === id);
  if (quantity <= 0) {
    if (idx !== -1) cart.splice(idx, 1);
  } else if (idx === -1) {
    cart.push({ id, quantity });
  } else {
    cart[idx].quantity = quantity;
  }
  writeCart(cart);
}

function subscribe(cb) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

/** Quantity of one product in the cart (0 if absent). */
export function useCartQuantity(id) {
  const [qty, setQty] = useState(0);
  useEffect(() => {
    const sync = () => setQty(readCart().find((i) => i.id === id)?.quantity || 0);
    sync();
    return subscribe(sync);
  }, [id]);
  const update = useCallback((next) => setQuantity(id, next), [id]);
  return [qty, update];
}

/** Total number of items in the cart, for badges. */
export function useCartCount() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const sync = () => setCount(readCart().reduce((n, i) => n + (Number(i.quantity) || 0), 0));
    sync();
    return subscribe(sync);
  }, []);
  return count;
}
