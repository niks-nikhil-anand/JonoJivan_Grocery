import { Suspense } from "react";
import SignInView from "@/components/auth/SignInView";

export const metadata = {
  title: "Sign in | JonoJivan",
  description: "Sign in to your JonoJivan account to track orders and check out faster.",
  robots: { index: false, follow: true },
};

export default function SignInPage() {
  return (
    <Suspense fallback={<main className="min-h-[70vh] bg-cream" />}>
      <SignInView />
    </Suspense>
  );
}
