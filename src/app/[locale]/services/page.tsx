import { ServiceClient } from '@/components'
import { localeToIdMap } from '@/constants'
import { Translation } from '@/interface'
import { getPageBySlug } from '@/lib'
import { Metadata } from 'next'
import React, { cache } from 'react'

const getPageCached = cache(getPageBySlug)

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  // Lần gọi đầu tiên sẽ fetch và cache
  const data = (await getPageBySlug('services')) as any
  const langId = localeToIdMap[locale] || localeToIdMap['vi']
  const seoTrans = data.translations.find(
    (t: Translation) => t.language === langId,
  )

  return {
    title: `${'Vigroup - ' + seoTrans?.seoTitle || 'Vigroup - Services'}`,
    description: seoTrans?.seoDescription || '',
    openGraph: {
      title: `${'Vigroup - ' + seoTrans?.seoTitle || 'Vigroup - Services'}`,
      description: seoTrans?.seoDescription || '',
      url: 'https://vigroup.cz',
      siteName: 'ViGroup',
      locale,
      type: 'website',
    },
  }
}
const ServicesPage = async () => {
  const [data, dataSmarthome, dataAir, dataDesign] = await Promise.all([
    getPageCached('services'),
    getPageCached('smarthome'),
    getPageCached('air-conditioning-heat-pumps'),
    getPageCached('construction-design-consultancy'),
  ])

  return (
    <ServiceClient
      datas={data}
      dataSmarthome={dataSmarthome}
      dataAir={dataAir}
      dataDesign={dataDesign}
    />
  )
}

export default ServicesPage
