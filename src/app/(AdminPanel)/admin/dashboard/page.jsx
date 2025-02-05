import DashboardCard from '@/components/adminPanel/ui/Dashboard/DashboardCard'
import RecentOrders from '@/components/adminPanel/ui/Dashboard/RecentOrders'
import React from 'react'

const page = () => {
  return (
    <div className='max-w-full mx-auto p-4 bg-gray-50  rounded-lg w-full h-[90vh]  overflow-y-auto max-h-[86vh] custom-scrollbar flex flex-col gap-5'>
      <div className='flex gap-5 '>
      <DashboardCard/>
      <DashboardCard/>
      <DashboardCard/>
      <DashboardCard/>
      </div>
      <div className='flex gap-5'>
        <RecentOrders/>
        <RecentOrders/>
      </div>
      
    </div>
  )
}

export default page