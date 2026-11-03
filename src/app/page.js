import Hero from "@/components/home/Hero";
import QuickActions from "@/components/home/QuickActions";
import RechargeWidget from "@/components/home/RechargeWidget";
import Categories from "@/components/home/Categories";
import ProductShelf from "@/components/home/ProductShelf";
import RechargePlans from "@/components/home/RechargePlans";
import HowItWorks from "@/components/home/HowItWorks";
import WhyUs from "@/components/home/WhyUs";
import CrossSell from "@/components/home/CrossSell";
import Reviews from "@/components/home/Reviews";
import StayConnected from "@/components/home/StayConnected";
import Faq from "@/components/home/Faq";
import Section from "@/components/home/ui/Section";
import { getCategories, getDeals, getJustAdded } from "@/lib/homeData";

// Load current storefront data at request time; builds do not query the database.
export const dynamic = "force-dynamic";

/*
 * Story arc: Hook → Ease → Choice → Trust → Habit
 *  ① Hero  ② Quick actions  ③ Recharge widget  ④ Categories  ⑤ Deals
 *  ⑥ Recharge plans  ⑦ How it works  ⑧ Why us  ⑨ Just added
 *  ⑩ Cross-sell  ⑪ Reviews  ⑫ WhatsApp  ⑬ FAQ
 */
async function StorefrontContent() {
  const [categories, deals, justAdded] = await Promise.all([getCategories(), getDeals(), getJustAdded()]);

  return (
    <>
      <Categories categories={categories} />

      {deals.length > 0 && (
        <Section
          id="deals"
          tone="offer"
          eyebrow="Today's deals"
          title="Best prices on everyday essentials."
          subtitle="Marked-down prices on items you buy every week — while stock lasts."
          action={{ href: "/product/shopAllProducts", label: "See all" }}
          className="bg-white"
        >
          <ProductShelf products={deals} layout="grid" />
        </Section>
      )}

      <RechargePlans />
      <HowItWorks />
      <WhyUs />

      {justAdded.length > 0 && (
        <Section
          eyebrow="Just added"
          title="New on the shelves."
          subtitle="The latest additions to the JonoJivan store."
          action={{ href: "/product/shopAllProducts", label: "Shop all" }}
        >
          <ProductShelf products={justAdded} layout="rail" />
        </Section>
      )}

      <CrossSell />
      <Reviews />
      <StayConnected />
      <Faq />
    </>
  );
}

function StorefrontFallback() {
  return (
    <div className="space-y-8 px-4 py-12 sm:px-6 lg:px-8" aria-label="Loading store content" role="status">
      <div className="mx-auto h-64 max-w-7xl animate-pulse rounded-3xl bg-white" />
      <div className="mx-auto h-48 max-w-7xl animate-pulse rounded-3xl bg-white" />
    </div>
  );
}

export default function Home() {
  return (
    <main className="bg-cream">
      <Hero />
      <QuickActions />
      <RechargeWidget />
      <Suspense fallback={<StorefrontFallback />}>
        <StorefrontContent />
      </Suspense>
    </main>
  );
}
import { Suspense } from "react";
