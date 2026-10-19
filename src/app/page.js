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

// Re-generate the page at most every 5 minutes so new products/prices appear
// without a redeploy, while visitors still get a fast cached page.
export const revalidate = 300;

/*
 * Story arc: Hook → Ease → Choice → Trust → Habit
 *  ① Hero  ② Quick actions  ③ Recharge widget  ④ Categories  ⑤ Deals
 *  ⑥ Recharge plans  ⑦ How it works  ⑧ Why us  ⑨ Just added
 *  ⑩ Cross-sell  ⑪ Reviews  ⑫ WhatsApp  ⑬ FAQ
 */
export default async function Home() {
  const [categories, deals, justAdded] = await Promise.all([getCategories(), getDeals(), getJustAdded()]);

  return (
    <main className="bg-cream">
      <Hero />
      <QuickActions />
      <RechargeWidget />
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
    </main>
  );
}
