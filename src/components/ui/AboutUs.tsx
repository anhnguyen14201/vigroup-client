'use client'

import dynamic from 'next/dynamic'
import React, { useMemo } from 'react'
import { useLocale } from 'next-intl'
import type { Locale } from '@/interface'

// Động import component nặng (có thể chứa Markdown, HTML phức tạp…)
const ArticleSection = dynamic(
  () => import('@/components/common/Page/ArticleSection'),
  {
    // Không ssr để chỉ tải khi cần trên client
    ssr: false,
    // Hiển thị skeleton nếu muốn
    loading: () => (
      <div className='max-w-screen-2xl mx-auto px-4 sm:px-6'>
        {/* có thể dùng Skeleton hoặc placeholder ở đây */}
        <div className='h-64 bg-gray-100 animate-pulse rounded-lg'></div>
      </div>
    ),
  },
)

interface AboutUsProps {
  dataAboutContent: any | null
}

// React.memo giúp tránh render lại nếu props không đổi
const AboutUs: React.FC<AboutUsProps> = React.memo(({ dataAboutContent }) => {
  const locale = useLocale() as Locale

  // Memo article để giữ reference không đổi nếu nội dung không thay đổi
  const article = useMemo(() => dataAboutContent, [dataAboutContent])

  if (!article) return null

  return (
    <div className='max-w-screen-2xl mx-auto px-4 sm:px-6'>
      {/* Key không cần đặt nếu ArticleSection đã memo */}
      <ArticleSection article={article} locale={locale} isLast />
    </div>
  )
})

AboutUs.displayName = 'AboutUs'
export default AboutUs
