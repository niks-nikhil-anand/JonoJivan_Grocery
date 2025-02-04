import Banner1 from "@/components/frontend/ui/(Banners)/Banner1";
import Banner2 from "@/components/frontend/ui/(Banners)/Banner2";
import BannerText01 from "@/components/frontend/ui/(Banners)/BannerText01";
import FeaturesList from "@/components/frontend/ui/(Banners)/BannerText02";
import CategoriesSection from "@/components/frontend/ui/CategorySection";
import DailyNeedsProducts from "@/components/frontend/ui/DailyNeedsProducts";
import FeaturedSection from "@/components/frontend/ui/FeaturedSection";
import HeroSection from "@/components/frontend/ui/HeroSection";
import LatestProducts from "@/components/frontend/ui/LatestProduct";
import Marquee from "@/components/frontend/ui/Marquee";
import ProductCardVegetables from "@/components/frontend/ui/ProductSectionVegetables";
import ProductsOnSale from "@/components/frontend/ui/ProductsOnSale";
import SubscribeSection from "@/components/frontend/ui/SubscribeSection";
import TempCategories from "@/components/frontend/ui/TempCategories";
import TwoCategories from "@/components/frontend/ui/TwoCategories";
import WhoWeAre from "@/components/frontend/ui/WhoWeAre";


export default function Home() {
  return (
    <>
      <HeroSection />
      <Marquee />
      <ProductCardVegetables />
      <CategoriesSection />
      <TempCategories/>
      <WhoWeAre />
      <DailyNeedsProducts />
      <FeaturedSection/>
       <Marquee />
      <Banner1 /> 
      <TwoCategories />
      <BannerText01 />
      <LatestProducts />
      <FeaturesList />
      <ProductsOnSale/>
      <SubscribeSection />
    </>
  );
}
