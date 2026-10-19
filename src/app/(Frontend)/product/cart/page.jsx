import CartView from "@/components/cart/CartView";

export const metadata = {
  title: "Your Cart | JonoJivan",
  robots: { index: false, follow: true },
};

// The cart lives in the browser (localStorage), so the page is a thin shell
// around the interactive CartView.
export default function CartPage() {
  return <CartView />;
}
