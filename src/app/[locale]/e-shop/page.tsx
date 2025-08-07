// app/store/page.tsx ('use client' not needed for RSC)

import React from 'react'
import { Metadata } from 'next'
import { Translation } from '@/interface'
import { getBrands, getCategories, getPageBySlug } from '@/lib'
import { localeToIdMap } from '@/constants'
import { EShopPage } from '@/components'

// Cache page data to avoid duplicate fetches
let cachedStoreData: any = null

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const { locale } = await params

  // Lazy-init cache
  if (!cachedStoreData) {
    cachedStoreData = await getPageBySlug('e-shop')
  }
  const data = cachedStoreData as any
  const langId = localeToIdMap[locale] ?? localeToIdMap['vi']
  const seoTrans = data.translations.find(
    (t: Translation) => t.language === langId,
  )

  const title = seoTrans?.seoTitle
    ? `Vigroup - ${seoTrans.seoTitle}`
    : 'Vigroup - E-Shop'
  const description = seoTrans?.seoDescription ?? ''

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: 'https://vigroup.cz',
      siteName: 'ViGroup',
      locale,
      type: 'website',
    },
  }
}

const StorePage = async () => {
  // Parallelize all fetches
  const [storeData, brands, categories] = await Promise.all([
    cachedStoreData ?? getPageBySlug('e-shop'),
    getBrands(),
    getCategories(),
  ])

  // Warm cache if needed
  if (!cachedStoreData) cachedStoreData = storeData

  return (
    <EShopPage
      dataHeroSection={storeData}
      dataBrands={brands}
      dataCategories={categories}
    />
  )
}

export default StorePage
