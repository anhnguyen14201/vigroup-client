'use client'

import React, { useEffect, useMemo } from 'react'
import nProgress from 'nprogress'
import { useLocale } from 'next-intl'
import dynamic from 'next/dynamic'

import type { Locale } from '@/interface'
import HeroSection from '@/components/common/Page/HeroSection'

// Dynamic import to reduce initial bundle

const ArticleSection = dynamic(
  () => import('@/components/common/Page/ArticleSection'),
  {
    ssr: false,
    loading: () => <div className='h-32 bg-gray-100 animate-pulse my-4' />,
  },
)

interface AboutContentProps {
  data: any & { heroSections: any[]; articles: any[] }
}

const AboutContent: React.FC<AboutContentProps> = React.memo(({ data }) => {
  const locale = useLocale() as Locale

  // Complete progress on mount
  useEffect(() => {
    nProgress.done()
  }, [])

  // Memoize sections arrays
  const heroList = useMemo(() => data.heroSections, [data.heroSections])
  const articleList = useMemo(() => data.articles, [data.articles])

  return (
    <>
      {heroList.map((section: any, idx: number) => (
        <HeroSection
          key={section._id || idx}
          section={section}
          locale={locale}
          index={idx}
        />
      ))}

      <div className='max-w-screen-2xl mx-auto px-4 sm:px-6'>
        {articleList.map((article: any, idx: number) => (
          <ArticleSection
            key={article._id || idx}
            article={article}
            locale={locale}
            isLast={idx === articleList.length - 1}
          />
        ))}
      </div>
    </>
  )
})

AboutContent.displayName = 'AboutContent'

export default AboutContent
