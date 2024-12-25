import Banner1 from '@/components/frontend/ui/(Banners)/Banner1'
import Banner2 from '@/components/frontend/ui/(Banners)/Banner2'
import BannerText01 from '@/components/frontend/ui/(Banners)/BannerText01'
import BannerText02 from '@/components/frontend/ui/(Banners)/BannerText02'
import HeroSection from '@/components/frontend/ui/HeroSection'
import Marquee from '@/components/frontend/ui/Marquee'
import WhoWeAre from '@/components/frontend/ui/WhoWeAre'
import CategorySectionUser from '@/components/users/ui/CategorySectionUser'
import FruitsVegetablesUser from '@/components/users/ui/FruitsVegetablesUser'
import LatestProductUser from '@/components/users/ui/LatestProductUser'
import ProductCardUser from '@/components/users/ui/LatestProductUser'
import React from 'react'

const page = () => {
  return (
    <div>
    <HeroSection/>
    <Marquee />
    <FruitsVegetablesUser/>
    <CategorySectionUser/>
    <WhoWeAre/>
    <ProductCardUser/>
    <Marquee/>
    <Banner1/>
    <LatestProductUser/>
    <BannerText01/>
    <BannerText02/>
    <Banner2/>
    </div>
  )
}

export default page