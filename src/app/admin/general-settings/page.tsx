import {
  InforCompanyManager,
  InforManager,
  LogoManager,
  SlideManager,
} from '@/components'
import React from 'react'

export const metadata = {
  title: 'Cài đặt chung',
}

export default function GeneralSettingPage() {
  return (
    <div className='flex flex-1'>
      <div className='flex flex-1 flex-col gap-4 p-5'>
        <div className='columns-3 gap-4 space-y-4'>
          {/* Preview placeholders */}
          <div className='break-inside-avoid'>
            <SlideManager />
          </div>
          <div className='break-inside-avoid'>
            <LogoManager />
          </div>
          <div className='break-inside-avoid'>
            <InforManager />
          </div>
          <div className='break-inside-avoid'>
            <InforCompanyManager />
          </div>
          {/*           <div className='break-inside-avoid'>
            <Pages />
          </div> */}
        </div>
      </div>
    </div>
  )
}
