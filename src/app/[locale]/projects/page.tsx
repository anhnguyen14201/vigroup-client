import React from 'react'
import { Metadata } from 'next'
import { Translation } from '@/interface'
import { getPageBySlug } from '@/lib'
import { localeToIdMap } from '@/constants'
import { Project } from '@/components'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  // Lần gọi đầu tiên sẽ fetch và cache
  const data = (await getPageBySlug('projects')) as any
  const langId = localeToIdMap[locale] || localeToIdMap['vi']
  const seoTrans = data.translations.find(
    (t: Translation) => t.language === langId,
  )

  return {
    title: `${'Vigroup - ' + seoTrans?.seoTitle || 'Vigroup - Projects'}`,
    description: seoTrans?.seoDescription || '',
    openGraph: {
      title: `${'Vigroup - ' + seoTrans?.seoTitle || 'Vigroup - Projects'}`,
      description: seoTrans?.seoDescription || '',
    },
  }
}

const ProjectPage = async () => {
  const data = await getPageBySlug('projects')

  return <Project dataHeroSection={data} />
}

export default ProjectPage
