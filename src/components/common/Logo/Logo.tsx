'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import clsx from 'clsx'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

import { ILogoProps } from '@/interface'
import { useLogos } from '@/hooks'

const Logo = ({ scrolled = false }: ILogoProps) => {
  const [loaded, setLoaded] = useState(false)
  const { items: logos, isLoading } = useLogos()

  const { urlLogoDark, urlLogoWhite } = useMemo(() => {
    const dark = logos.find(l => l.logoType === 'logoWhite')
    const white = logos.find(l => l.logoType === 'logoBlack')
    return {
      urlLogoDark: dark?.imageUrls?.[0] || '',
      urlLogoWhite: white?.imageUrls?.[0] || '',
    }
  }, [logos])

  useEffect(() => {
    // Reset load state when URLs change
    setLoaded(false)
  }, [urlLogoDark, urlLogoWhite])

  const handleLoad = () => setLoaded(true)

  return (
    <Link href='/' className='flex items-center relative w-[200px] h-[70px]'>
      {isLoading ? (
        <Skeleton width={200} height={70} />
      ) : (
        <>
          {urlLogoDark && (
            <Image
              src={urlLogoDark}
              alt='Logo Dark'
              fill
              sizes='(max-width: 768px) 100vw, 200px'
              className={clsx(
                'object-contain transition-opacity duration-500',
                {
                  'opacity-0': scrolled || !loaded,
                  'opacity-100': !scrolled && loaded,
                },
              )}
              priority
              onLoadingComplete={handleLoad}
              placeholder='empty'
              unoptimized={false}
            />
          )}
          {urlLogoWhite && (
            <Image
              src={urlLogoWhite}
              alt='Logo Light'
              fill
              sizes='(max-width: 768px) 100vw, 200px'
              className={clsx(
                'object-contain transition-opacity duration-500 absolute inset-0',
                {
                  'opacity-100': scrolled && loaded,
                  'opacity-0': !scrolled || !loaded,
                },
              )}
              priority
              onLoadingComplete={handleLoad}
              placeholder='empty'
              unoptimized={false}
            />
          )}
        </>
      )}
    </Link>
  )
}

export default Logo
