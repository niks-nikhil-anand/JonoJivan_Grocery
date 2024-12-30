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
import ProductCardVegetables from "@/components/frontend/ui/ProductSectionVegetables";
import LatestProducts from "@/components/frontend/ui/LatestProduct";
import VeticalScrollProducts from "@/components/frontend/ui/DailyNeedsProducts";

export default function Home() {
  return (
    <>
      <HeroSection />
      <Marquee />
      <ProductCardVegetables />
      <CategoriesSection />
      <WhoWeAre />
      <VeticalScrollProducts />
      <Marquee />
      <Banner1 />
      <ProductCardVegetables />
      <BannerText01 />
      <LatestProducts />
      <Banner2 />
      <BannerText02 />
    </>
  );
}
