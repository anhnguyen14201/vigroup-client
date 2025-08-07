import React from 'react'
import { Template } from '@/components'
import { Metadata } from 'next'
import { Translation } from '@/interface'
import { getPageBySlug } from '@/lib'
import { localeToIdMap } from '@/constants'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  // Lần gọi đầu tiên sẽ fetch và cache
  const data = (await getPageBySlug('templates')) as any
  const langId = localeToIdMap[locale] || localeToIdMap['vi']
  const seoTrans = data.translations.find(
    (t: Translation) => t.language === langId,
  )

  return {
    title: `${'Vigroup - ' + seoTrans?.seoTitle || 'Vigroup - Templates'}`,
    description: seoTrans?.seoDescription || '',
    openGraph: {
      title: `${'Vigroup - ' + seoTrans?.seoTitle || 'Vigroup - Templates'}`,
      description: seoTrans?.seoDescription || '',
      url: 'https://vigroup.cz',
      siteName: 'ViGroup',
      locale,
      type: 'website',
    },
  }
}
const TemplatePage = async () => {
  const data = await getPageBySlug('templates')

  return <Template dataHeroSection={data} />
}

export default TemplatePage
