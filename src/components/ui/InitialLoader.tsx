'use client'

import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Image from 'next/image'

import { selectIsAppLoading } from '@/redux'
import LogoImage from '@/assets/logo/icon_logo.png'

type Props = {
  children: React.ReactNode
}

export default function InitialLoader({ children }: Props) {
  const isLoading = useSelector(selectIsAppLoading)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    if (isLoading) {
      setShowContent(false)
    } else {
      timer = setTimeout(() => {
        setShowContent(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 300)
    }
    return () => clearTimeout(timer)
  }, [isLoading])

  if (!showContent) {
    return (
      <div className='fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-sm bg-[#101010]'>
        <div className='p-6 bg-[#101010] rounded-full flex items-center justify-center'>
          <div className='relative w-35 h-35'>
            {/* Spinner xoay */}
            <div className='absolute inset-0 rounded-full border-t-4 border-b-4 border-red-400 animate-spin'></div>
            {/* Logo tĩnh ở giữa */}
            <div className='absolute inset-0 flex items-center justify-center'>
              <Image
                src={LogoImage}
                alt='Logo'
                width={50}
                height={50}
                style={{ width: 'auto', height: 'auto' }}
                priority
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
