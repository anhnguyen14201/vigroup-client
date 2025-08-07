// app/about/page.tsx
import React, { cache } from 'react'
import { AboutContent } from '@/components'
import { Metadata } from 'next'
import { ITranslation } from '@/interface'
import { localeToIdMap } from '@/constants'
import { getPageBySlug } from '@/lib'

const getPageCached = cache(getPageBySlug)

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  // fetch toàn bộ page data
  const data = (await getPageBySlug('air-conditioning-heat-pumps')) as any

  // lấy ObjectId tương ứng locale
  const langId = localeToIdMap[locale] || localeToIdMap['vi']

  // tìm bản dịch SEO
  const seoTrans = data.translations.find(
    (t: ITranslation) => t.language === langId,
  )

  return {
    title: `${
      'Vigroup - ' + seoTrans?.seoTitle ||
      'Vigroup - Air conditioning and heat pump systems'
    }`,
    description: seoTrans?.seoDescription || '',
    openGraph: {
      title: `${
        'Vigroup - ' + seoTrans?.seoTitle ||
        'Vigroup - Air conditioning and heat pump systems'
      }`,
      description: seoTrans?.seoDescription || '',
      url: 'https://vigroup.cz',
      siteName: 'ViGroup',
      locale,
      type: 'website',
    },
  }
}

const page = async () => {
  const data = await getPageCached('air-conditioning-heat-pumps')

  return (
    <>
      <AboutContent data={data} />
    </>
  )
}

export default page
