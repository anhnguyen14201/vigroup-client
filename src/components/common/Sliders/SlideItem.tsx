'use client'

import { FC, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useGetContentTranslation } from '@/hooks'
import { useLocale } from 'next-intl'
import { entranceVariants } from '@/utils'
import type { Locale } from '@/interface'

interface SlideItemProps {
  slide: any
  isActive: boolean
}

export const SlideItem: FC<SlideItemProps> = ({ slide, isActive }) => {
  const locale = useLocale() as Locale

  // Translated content
  const { title, desc, buttonText } = useGetContentTranslation(slide, locale)

  // loading state until image and text ready
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    if (slide.imageUrls?.[0] && title != null && desc != null) {
      setIsLoading(false)
    }
  }, [slide, title, desc])

  // omit skeleton when actual content loaded
  if (isLoading) {
    return (
      <div className='relative w-full h-[500px]'>
        <Skeleton height='100%' />
        <div className='absolute inset-0 p-6 flex flex-col justify-center container mx-auto'>
          <Skeleton width={120} height={20} />
          <Skeleton width={300} height={40} style={{ margin: '16px 0' }} />
          <Skeleton count={3} width={Math.random() * (600 - 400) + 400} />
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Background */}
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: isActive ? 1 : 1.1 }}
        transition={{ duration: 5, ease: 'easeInOut' }}
        className='absolute inset-0'
      >
        {slide.imageUrls[0] && (
          <Image
            src={slide.imageUrls[0]}
            alt={title}
            fill
            quality={100}
            priority
            placeholder='empty'
            sizes='(max-width: 768px) 100vw, 50vw'
            className='object-cover w-full h-full'
          />
        )}
      </motion.div>

      {/* Overlay tối */}
      <div className='absolute inset-0 bg-black/60' />

      {/* Text content */}
      <div className='absolute inset-0 flex items-center container mx-auto px-6'>
        <div className='xl:w-1/2'>
          <motion.h1
            variants={entranceVariants.heading}
            initial='inactive'
            animate={isActive ? 'active' : 'inactive'}
            className='text-white text-[15px] font-light mb-4 uppercase tracking-[4px] font-oswald'
          >
            {slide.label || title}
          </motion.h1>
          <motion.h1
            variants={entranceVariants.heading}
            initial='inactive'
            animate={isActive ? 'active' : 'inactive'}
            className='text-white md:text-[85px] text-3xl mb-4 uppercase font-light tracking-[4px] font-oswald'
          >
            {title}
          </motion.h1>
          <motion.p
            variants={entranceVariants.paragraph}
            initial='inactive'
            animate={isActive ? 'active' : 'inactive'}
            className='text-white text-[17px] ml-[5px] pl-[70px] max-w-4xl font-extralight relative
                       after:absolute after:left-0 after:top-[15px] after:bg-white after:w-10 after:h-px'
          >
            {desc}
          </motion.p>
          {buttonText && (
            <motion.div
              variants={entranceVariants.button}
              initial='inactive'
              animate={isActive ? 'active' : 'inactive'}
            >
              <Link href={slide.buttonUrl || '/'} passHref>
                <button
                  type='button'
                  aria-label={buttonText}
                  className='mt-6 px-[35px] py-[20px] font-[400] capitalize cursor-pointer
                             bg-[#C74242] text-[17px] text-white rounded-full
                             hover:bg-white hover:border-white hover:text-[#C74242] transition'
                >
                  {buttonText}
                </button>
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </>
  )
}
