'use client'

import React, { FC, useMemo } from 'react'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { ArrowUpRight } from 'lucide-react'
import Skeleton from 'react-loading-skeleton'
import { AnimatePresence, motion } from 'framer-motion'

import { useGetContentTranslation } from '@/hooks'
import { LogoBanner } from '@/components/ui'
import type { Locale } from '@/interface'
import 'react-loading-skeleton/dist/skeleton.css'

interface FeatureServiceProps {
  dataSmarthome: any
  dataAir: any
  dataDesign: any
}

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  enter: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
}

// Config để map cards
const serviceCards = [
  {
    key: 'design',
    dataKey: 'dataDesign',
    href: '/services/construction-design-consultancy',
  },
  { key: 'smarthome', dataKey: 'dataSmarthome', href: '/services/smarthome' },
  {
    key: 'air',
    dataKey: 'dataAir',
    href: '/services/air-conditioning-heat-pumps',
  },
]

const FeatureService: FC<FeatureServiceProps> = React.memo(
  ({ dataSmarthome, dataAir, dataDesign }) => {
    const locale = useLocale() as Locale
    const t = useTranslations('service')

    // Memo translations để tránh gọi hook lặp lại
    const translations = useMemo(() => {
      return {
        design: useGetContentTranslation(dataDesign, locale),
        smarthome: useGetContentTranslation(dataSmarthome, locale),
        air: useGetContentTranslation(dataAir, locale),
      }
    }, [dataDesign, dataSmarthome, dataAir, locale])

    // Kiểm tra loading: nếu bất kỳ seoTitle nào chưa có, vẫn loading
    const isLoading = useMemo(
      () =>
        !(
          translations.design.seoTitle &&
          translations.smarthome.seoTitle &&
          translations.air.seoTitle
        ),
      [translations],
    )

    if (isLoading) {
      return (
        <>
          {/* Skeleton cho logo và tiêu đề */}
          <motion.div
            className='m-auto text-center mt-20'
            variants={itemVariants}
            initial='hidden'
            whileInView='enter'
            viewport={{ once: true, amount: 0.3 }}
          >
            <Skeleton width={150} height={30} />
          </motion.div>
          <motion.div
            className='m-auto text-center mt-6'
            variants={itemVariants}
            initial='hidden'
            whileInView='enter'
            viewport={{ once: true, amount: 0.3 }}
          >
            <Skeleton width={200} height={20} className='mb-2' />
            <Skeleton width={300} height={40} />
          </motion.div>
          {/* Skeleton cho 3 cards */}
          <div className='mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {serviceCards.map((_, idx) => (
              <div key={idx}>
                <Skeleton height={200} className='rounded-xl mb-4' />
                <Skeleton width={120} height={20} className='mb-2' />
                <Skeleton width={200} height={24} />
              </div>
            ))}
          </div>
        </>
      )
    }

    return (
      <>
        {/* LogoBanner */}
        <motion.div
          className='m-auto text-center mt-20'
          variants={itemVariants}
          initial='hidden'
          whileInView='enter'
          viewport={{ once: true, amount: 0.3 }}
        >
          <LogoBanner />
        </motion.div>

        {/* Heading chính */}
        <motion.div
          className='m-auto text-center mt-20'
          variants={itemVariants}
          initial='hidden'
          whileInView='enter'
          viewport={{ once: true, amount: 0.3 }}
        >
          <p className='font-oswald text-[#C74242] text-[15px] mb-[15px] font-light tracking-[4px] uppercase'>
            {t('bestFeatures')}
          </p>
          <h1 className='font-oswald mb-[15px] uppercase tracking-[2px] text-[50px] font-light'>
            {t('ourServices')}
          </h1>
        </motion.div>

        {/* Danh sách service cards */}
        <div className='mt-10'>
          <AnimatePresence>
            <motion.div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {serviceCards.map(({ key, dataKey, href }) => {
                const { seoTitle, seoDescription } =
                  translations[key as keyof typeof translations]
                return (
                  <Link href={href} key={key}>
                    <motion.div
                      className='relative group overflow-hidden rounded-l-3xl rounded-t-3xl cursor-pointer'
                      variants={itemVariants}
                      initial='hidden'
                      whileInView='enter'
                      viewport={{ once: true, amount: 0.3 }}
                    >
                      <div className='w-full h-90 bg-[#f9f6f3] rounded-l-3xl rounded-t-3xl overflow-hidden'>
                        <button
                          type='button'
                          aria-label={'viewDetails'}
                          className='absolute -bottom-1.5 -right-1.5 bg-white w-25 h-25 rounded-tl-[50%] before:content-[""] before:absolute before:bottom-1.5 before:-left-5 before:w-5 before:h-5 before:bg-transparent before:rounded-br-3xl before:shadow-[0.313rem_0.313rem_0_0.313rem_#fff] after:content-[""] after:absolute after:-top-5 after:right-1.5 after:w-5 after:h-5 after:bg-transparent after:rounded-br-3xl after:shadow-[0.313rem_0.313rem_0_0.313rem_#fff]'
                        >
                          <div className='absolute inset-4 rounded-full bg-[#C74242] flex items-center justify-center transition-transform duration-500 ease-in-out group-hover:scale-105'>
                            <ArrowUpRight className='w-5 h-5 text-white' />
                          </div>
                        </button>

                        <div className='absolute inset-0 px-10 pt-12 pb-24'>
                          <h2 className='text-[21px] font-light uppercase tracking-[2px] font-oswald mb-4'>
                            {seoTitle}
                          </h2>
                          <p className='text-lg font-light text-[#797370]'>
                            {seoDescription}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                )
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </>
    )
  },
)

FeatureService.displayName = 'FeatureService'
export default FeatureService
