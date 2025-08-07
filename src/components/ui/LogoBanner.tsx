'use client'

import React, { useMemo } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'

import { useLogos } from '@/hooks'

const LogoBanner: React.FC = React.memo(() => {
  const { items: logos = [], isLoading, error } = useLogos()

  // Memoize small logo lookup
  const smallLogoUrl = useMemo(() => {
    if (isLoading || error) return '/placeholder-logo.png'
    const logoItem = logos.find((item: any) => item.logoType === 'logoSmall')
    return logoItem?.imageUrls?.[0] || '/placeholder-logo.png'
  }, [logos, isLoading, error])

  return (
    <div className='flex items-center justify-center'>
      <span className='relative flex items-center'>
        <span className='before:block before:h-[1px] before:w-20 before:bg-[#C74242] before:mr-4' />
        <Image
          src={smallLogoUrl}
          alt='Company logo'
          width={32}
          height={32}
          sizes='32px'
          className='w-8 h-8 object-contain'
          priority={false}
          placeholder='blur'
          blurDataURL='/placeholder-logo.png'
        />
        <span className='after:block after:h-[1px] after:w-20 after:bg-[#C74242] after:ml-4' />
      </span>
    </div>
  )
})

LogoBanner.displayName = 'LogoBanner'
export default LogoBanner
