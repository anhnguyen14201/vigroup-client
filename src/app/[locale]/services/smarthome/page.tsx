// app/about/page.tsx
import React, { cache } from 'react'
import { AboutContent } from '@/components'
import { Metadata } from 'next'
import { Translation } from '@/interface'
import { getPageBySlug } from '@/lib'
import { localeToIdMap } from '@/constants'

const getPageCached = cache(getPageBySlug)

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  // fetch toàn bộ page data

  const data = (await getPageBySlug('smarthome')) as any

  // lấy ObjectId tương ứng locale
  const langId = localeToIdMap[locale] || localeToIdMap['vi']

  // tìm bản dịch SEO
  const seoTrans = data.translations.find(
    (t: Translation) => t.language === langId,
  )

  return {
    title: `${'Vigroup - ' + seoTrans?.seoTitle || 'Vigroup - Smart Home'}`,
    description: seoTrans?.seoDescription || '',
    openGraph: {
      title: `${'Vigroup - ' + seoTrans?.seoTitle || 'Vigroup - Smart Home'}`,
      description: seoTrans?.seoDescription || '',
      url: 'https://vigroup.cz',
      siteName: 'ViGroup',
      locale,
      type: 'website',
    },
  }
}

const SmarthomePage = async () => {
  const data = await getPageCached('smarthome')

  return (
    <>
      <AboutContent data={data} />
    </>
  )
}

export default SmarthomePage
