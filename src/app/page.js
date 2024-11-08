import HeroSection from "@/components/frontend/ui/HeroSection";
import WhoWeAre from "@/components/frontend/ui/WhoWeAre";
import ProductCard from "@/components/frontend/ui/ProductForSale";
import CategoriesSection from "@/components/frontend/ui/CategorySection";
import Marquee from "@/components/frontend/ui/Marquee";

// Banner Components
import Banner1 from "@/components/frontend/ui/(Banners)/Banner1";
import Banner2 from "@/components/frontend/ui/(Banners)/Banner2";
import BannerText01 from "@/components/frontend/ui/(Banners)/BannerText01";
import BannerText02 from "@/components/frontend/ui/(Banners)/BannerText02";

export default function Home() {
  return (
    <>
      {/* Hero and Section components */}
      <HeroSection />
      <WhoWeAre />
      <ProductCard />
      <CategoriesSection />
      <Marquee />
      
      {/* Banner Components */}
      <Banner1 />
      <BannerText01 />
      <BannerText02 />
      <Banner2 />
    </>
  );
}
