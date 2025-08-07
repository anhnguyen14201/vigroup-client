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

const Project = ({ dataHeroSection }: { dataHeroSection: any }) => {
  const locale = useLocale() as Locale
  const [projectType, setProjectType] = useState<string | undefined>()
  const t = useTranslations('shop')

  const { items: projectTypes } = useProjectType()

  const kind = 'project'
  const {
    items: templateDatas,
    isLoading,
    isLoadingMore,
    loadMore,
    totalItems,
    mutate,
  } = usePaginatedDatas(
    'projects',
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

        <ProjectList templates={templateDatas} url='projects' />
      </div>

      {remainingCount > 0 && (
        <div className='container mx-auto flex justify-center mt-10 mb-10'>
          <button
            type='button'
            aria-label='seeMore'
            onClick={loadMore}
            disabled={isLoadingMore}
            className='px-[35px] py-[20px] bg-[#C74242] text-[17px] text-white border rounded-full disabled:opacity-50 cursor-pointer 
                    hover:bg-white hover:text-[#C74242] hover:border-[#C74242] transition duration-300 mt-4 flex items-center gap-2 font-[400]'
          >
            {`${t('seeMore')} (${remainingCount})`}
            <ChevronDown size={20} />
          </button>
        </div>
      )}
    </div>
  )
}

export default Project
