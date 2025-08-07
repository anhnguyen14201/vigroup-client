import { Quote } from '@/components'
import React from 'react'

export const metadata = {
  title: 'Quản lý hóa đơn',
}

const InvoicePage = () => {
  return (
    <div className='flex flex-1'>
      <div className='flex flex-1 flex-col gap-4 p-5'>
        <div className='grid auto-rows-min gap-4 h-full'>
          <Quote />
          {/*           <Invoice />
           */}{' '}
        </div>
        {/*         <div className='min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min' />
         */}
      </div>
    </div>
  )
}

export default InvoicePage
