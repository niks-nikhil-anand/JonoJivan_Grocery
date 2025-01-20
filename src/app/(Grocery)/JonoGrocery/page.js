import Banner1 from '@/components/frontend/ui/(Banners)/Banner1'
import BannerText01 from '@/components/frontend/ui/(Banners)/BannerText01'
import Marquee from '@/components/frontend/ui/Marquee'
import SubscribeSection from '@/components/frontend/ui/SubscribeSection'
import DealsSection from '@/components/JonoGrocery/ui/DealsSEctions'
import HeroCarousel from '@/components/JonoGrocery/ui/HeroCarousel'
import WhyChooseUs from '@/components/JonoGrocery/ui/WhyChooseUs'
import React from 'react'

const page = () => {
  return (
    <div>
        <HeroCarousel/>
        <DealsSection/>
        <Marquee />
      <Banner1 />
      <WhyChooseUs/>
      <BannerText01/> 
        <SubscribeSection/>
    </div>
  )
}

export default page