'use client'

import React, { Suspense, lazy, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

// Lazy-load heavy components
const LogoBanner = lazy(() => import('@/components/ui/LogoBanner'))
const ProjectFeature = lazy(() =>
  import('@/components/common/Sliders').then(mod => ({
    default: mod.ProjectFeature,
  })),
)

import { usePaginatedDatas } from '@/hooks'
import { fetchPublicProjects } from '@/hooks/fetchers'

// Move variants outside component to avoid re-creation
const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const FeatureProjects = React.memo(function FeatureProjects() {
  const t = useTranslations('service')

  // Memoize API params
  const kind = useMemo(() => 'project', [])

  // Destructure only items to minimize re-renders
  const { items: templateDatas } = usePaginatedDatas(
    'projects',
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
          {t('projects')}
        </p>
        <h1 className='font-oswald mb-[15px] uppercase tracking-[2px] text-[50px] font-light'>
          {t('ourWorks')}
        </h1>
      </motion.div>

      <Suspense
        fallback={
          <div className='h-64 flex items-center justify-center'>
            Loading projects...
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
          <ProjectFeature datas={templateDatas} url='projects' />
        </motion.div>
      </Suspense>
    </div>
  )
})

FeatureProjects.displayName = 'FeatureProjects'

export default FeatureProjects
