'use client'

import React, { useMemo } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'

import { useGetContentTranslation } from '@/hooks'
import type { Locale } from '@/interface'
const Breadcrumb = dynamic(() => import('@/components/common/Breadcrumb'), {
  ssr: false,
})

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

interface HeroSectionProps {
  section: any
  locale: Locale
  index: number
}

const HeroSection: React.FC<HeroSectionProps> = React.memo(
  ({ section, locale, index }) => {
    const heroT = useGetContentTranslation(section, locale)
    const urls = useMemo(
      () => (Array.isArray(section.imageUrls) ? section.imageUrls : []),
      [section.imageUrls],
    )
    if (!urls.length) return null
    const previewUrl = urls[0]
    const { scrollYProgress } = useScroll()
    const parallaxY = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
    return (
      <div
        key={index}
        className='relative w-full h-[50vh] sm:h-[60vh] overflow-hidden mb-8'
      >
        <motion.div
          style={{ y: parallaxY }}
          className='absolute inset-0 w-full h-full'
        >
          <Image
            src={previewUrl}
            alt={`Hero ${index}`}
            fill
            priority
            className='object-cover'
          />
        </motion.div>
        <div className='absolute inset-0 bg-black/60' />
        <div className='absolute inset-0 flex flex-col justify-center items-center text-center px-6'>
          {heroT.heroSectionLabel && (
            <motion.p
              className='text-sm md:text-lg font-oswald text-white uppercase tracking-[3px] mb-5'
              variants={textVariants}
              initial='hidden'
              animate='visible'
              transition={{ duration: 0.6, delay: index * 0.3 }}
            >
              {heroT.heroSectionLabel}
            </motion.p>
          )}
          {heroT.heroHeading && (
            <motion.h2
              className='text-md sm:text-3xl md:text-4xl lg:text-[50px] font-oswald text-[#C74242] uppercase tracking-[2px]'
              variants={textVariants}
              initial='hidden'
              animate='visible'
              transition={{ duration: 0.6, delay: index * 0.3 + 0.2 }}
            >
              {heroT.heroHeading}
            </motion.h2>
          )}
          <div className='mt-5'>
            <Breadcrumb />
          </div>
        </div>
      </div>
    )
  },
)

HeroSection.displayName = 'HeroSection'

export default HeroSection
