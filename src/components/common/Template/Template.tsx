'use client'

import { useLocale, useTranslations } from 'next-intl'
import React, { useEffect, useState } from 'react'
import HeroSection from '@/components/common/Page/HeroSection'
import { Locale } from '@/interface'
import { usePaginatedDatas, useProjectType } from '@/hooks'
import { fetchProjects } from '@/hooks/fetchers/useProjectsFetcher'
import nProgress from 'nprogress'
import { fetchPublicProjects } from '@/hooks/fetchers/usePublicProjectsFetcher'
import { ProjectList } from '@/components/common/Project'
import ProjectType from '@/components/common/Project/ProjectType'
import { ChevronDown } from 'lucide-react'

const Template = ({ dataHeroSection }: { dataHeroSection: any }) => {
  const locale = useLocale() as Locale
  const [projectType, setProjectType] = useState<string | undefined>()
  const t = useTranslations('shop')

  const { items: projectTypes } = useProjectType()

  const kind = 'template'
  const {
    items: templateDatas,
    isLoading,
    isLoadingMore,
    loadMore,
    totalItems,
    mutate,
  } = usePaginatedDatas(
    'templates',
    { kind, projectType },
    fetchPublicProjects,
    {
      revalidateOnFocus: false,
    },
  )

  useEffect(() => {
    if (dataHeroSection) {
      nProgress.done()
    }
  }, [dataHeroSection])

  const remainingCount = totalItems - templateDatas.length

  return (
    <div className='mb-15'>
      {dataHeroSection?.heroSections?.map((h: any, i: number) => (
        <HeroSection key={i} section={h} locale={locale} index={i} />
      ))}

      <div className='max-w-screen-2xl mx-auto px-4 sm:px-6 mt-20'>
        <ProjectType
          projectTypes={projectTypes}
          onSelect={(id: any) => {
            setProjectType(id || undefined)
          }}
          selectedId={projectType}
        />

        <ProjectList templates={templateDatas} url='templates' />
      </div>

      {remainingCount > 0 && (
        <div className='container mx-auto flex justify-center mt-10 mb-10'>
          <button
            type='button'
            aria-label='seeMore'
            onClick={loadMore}
            disabled={isLoadingMore}
            className='px-7 py-3 bg-red-100 text-red-600 rounded-full disabled:opacity-50 cursor-pointer 
                    hover:bg-red-200 transition duration-300 mt-4 flex items-center gap-2 font-semibold'
          >
            {`${t('seeMore')} (${remainingCount})`}
            <ChevronDown size={20} />
          </button>
        </div>
      )}
    </div>
  )
}

export default Template
