'use client'

import React, { Suspense, lazy, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

// Lazy-load components to split bundle
const LogoBanner = lazy(() => import('@/components/ui/LogoBanner'))
const ProjectFeature = lazy(() =>
  import('@/components/common/Sliders').then(mod => ({
    default: mod.ProjectFeature,
  })),
)

import { usePaginatedDatas } from '@/hooks'
import { fetchPublicProjects } from '@/hooks/fetchers'

// Stable motion variants
const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const FeatureTemplates = React.memo(function FeatureTemplates() {
  const t = useTranslations('service')

  // Memoize static params
  const kind = useMemo(() => 'template', [])

  // Only select `items` to minimize re-renders
  const { items: templateDatas } = usePaginatedDatas(
    'templates',
    { kind },
    fetchPublicProjects,
    { revalidateOnFocus: false },
  )

  return (
    <div className='max-w-screen-2xl mx-auto px-4 sm:px-6 mb-25'>
      <Suspense
        fallback={
          <div className='h-40 flex items-center justify-center'>
            Loading banner...
          </div>
        }
      >
        <motion.div
          className='m-auto text-center mt-20'
          variants={itemVariants}
          initial='hidden'
          whileInView='enter'
          viewport={{ once: true, amount: 0.3 }}
        >
          <LogoBanner />
        </motion.div>
      </Suspense>

      <motion.div
        className='m-auto text-center mt-20'
        variants={itemVariants}
        initial='hidden'
        whileInView='enter'
        viewport={{ once: true, amount: 0.3 }}
      >
        <p className='font-oswald text-[#C74242] text-[15px] mb-[15px] font-light tracking-[4px] uppercase'>
          {t('designTemplates')}
        </p>
        <h1 className='font-oswald mb-[15px] uppercase tracking-[2px] text-[50px] font-light'>
          {t('ourDesignSamples')}
        </h1>
      </motion.div>

      <Suspense
        fallback={
          <div className='h-64 flex items-center justify-center'>
            Loading templates...
          </div>
        }
      >
        <motion.div
          className='mt-10'
          variants={itemVariants}
          initial='hidden'
          whileInView='enter'
          viewport={{ once: true, amount: 0.3 }}
        >
          <ProjectFeature datas={templateDatas} url='templates' />
        </motion.div>
      </Suspense>
    </div>
  )
})

FeatureTemplates.displayName = 'FeatureTemplates'

export default FeatureTemplates
