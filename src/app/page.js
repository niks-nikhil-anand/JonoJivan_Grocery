import Banner1 from "@/components/frontend/ui/(Banners)/Banner1";
import Banner2 from "@/components/frontend/ui/(Banners)/Banner2";
import BannerText01 from "@/components/frontend/ui/(Banners)/BannerText01";
import FeaturesList from "@/components/frontend/ui/(Banners)/BannerText02";
import CategoriesSection from "@/components/frontend/ui/CategorySection";
import DailyNeedsProducts from "@/components/frontend/ui/DailyNeedsProducts";
import HeroSection from "@/components/frontend/ui/HeroSection";
import LatestProducts from "@/components/frontend/ui/LatestProduct";
import Marquee from "@/components/frontend/ui/Marquee";
import ProductCardVegetables from "@/components/frontend/ui/ProductSectionVegetables";
import ProductsOnSale from "@/components/frontend/ui/ProductsOnSale";
import TwoCategories from "@/components/frontend/ui/TwoCategories";
import WhoWeAre from "@/components/frontend/ui/WhoWeAre";


export default function Home() {
  return (
    <>
      <HeroSection />
      {/* <Marquee /> */}
      <ProductCardVegetables />
      <CategoriesSection />
      <WhoWeAre />
      <DailyNeedsProducts />
      <Marquee />
      <Banner1 />
      <TwoCategories />
      <BannerText01 />
      <LatestProducts />
      <FeaturesList />
      <ProductsOnSale/>
      <Banner2 />
    </>
  );
}
