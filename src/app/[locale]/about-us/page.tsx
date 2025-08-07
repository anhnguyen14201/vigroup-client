// app/about/page.tsx
import React from 'react'
import { AboutContent } from '@/components'
import { Metadata } from 'next'
import { Translation } from '@/interface'
import { getPageBySlug } from '@/lib'
import { localeToIdMap } from '@/constants'

// Cache fetched data globally to avoid repeated fetch
let cachedAbout: any = null

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const { locale } = await params

  // Fetch once and cache
  if (!cachedAbout) {
    cachedAbout = await getPageBySlug('aboutUs')
  }
  const data = cachedAbout as any

  const langId = localeToIdMap[locale] ?? localeToIdMap['vi']
  const seoTrans = data.translations.find(
    (t: Translation) => t.language === langId,
  )

  const title = seoTrans?.seoTitle
    ? `Vigroup - ${seoTrans.seoTitle}`
    : 'Vigroup - About Us'
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

// Use React Server Component with streaming or suspense for AboutContent
export default async function AboutPage() {
  // Reuse cache
  const data = cachedAbout ?? (await getPageBySlug('aboutUs'))

  return <AboutContent data={data} />
}
