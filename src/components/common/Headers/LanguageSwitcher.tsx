'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useLocale } from 'next-intl'
import Image from 'next/image'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

import { ILanguage, UseLanguageResult } from '@/interface'
import { useLanguage } from '@/hooks'

const LanguageSwitcher = () => {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const { items: languages } = useLanguage() as UseLanguageResult

  // Local loading state: true until languages loaded
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    if (languages && languages.length > 0) {
      setIsLoading(false)
    }
  }, [languages])

  // Giả sử URL có cấu trúc /[locale]/... => loại bỏ phần locale
  const currentPath = pathname.split('/').slice(2).join('/') || ''

  const changeLanguage = (lng: string) => {
    if (lng !== locale) {
      router.push(`/${lng}/${currentPath}`)
    }
  }

  // Nếu đang load, hiển thị skeleton badges
  if (isLoading) {
    return (
      <div className='flex space-x-1'>
        {Array(2)
          .fill(null)
          .map((_, idx) => (
            <Skeleton key={idx} circle width={24} height={24} />
          ))}
      </div>
    )
  }

  return (
    <div className='flex space-x-1'>
      {languages.map((language: ILanguage) => {
        const { code, name, iconUrl } = language
        const isActive = locale === code

        return (
          <button
            type='button'
            key={code}
            onClick={() => changeLanguage(code)}
            className={`relative flex items-center justify-center p-0.5 rounded-full transition-opacity 
                        duration-300 cursor-pointer 
                        ${
                          isActive
                            ? 'opacity-100 border border-[#C74242]'
                            : 'opacity-50 border border-transparent hover:border-[#C74242] hover:opacity-80 hover:duration-500'
                        }`}
            title={name}
            aria-label={`Switch to ${name}`}
          >
            {iconUrl ? (
              <Image
                src={iconUrl[0]}
                width={20}
                height={20}
                sizes='20px'
                priority
                alt={name}
                className='rounded-full object-cover'
                loading='eager'
              />
            ) : (
              <Skeleton circle width={20} height={20} />
            )}
          </button>
        )
      })}
    </div>
  )
}

export default LanguageSwitcher
