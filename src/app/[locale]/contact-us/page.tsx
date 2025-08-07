import React from 'react'
import { localeToIdMap } from '@/constants'
import { Translation } from '@/interface'
import { getPageBySlug } from '@/lib'
import { Metadata } from 'next'
import { ContactUsClient } from '@/components'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  // Lần gọi đầu tiên sẽ fetch và cache
  const data = (await getPageBySlug('contactUs')) as any
  const langId = localeToIdMap[locale] || localeToIdMap['vi']
  const seoTrans = data.translations.find(
    (t: Translation) => t.language === langId,
  )

  return {
    title: `${'Vigroup - ' + seoTrans?.seoTitle || 'Vigroup - Contact Us'}`,
    description: seoTrans?.seoDescription || '',
    openGraph: {
      title: `${'Vigroup - ' + seoTrans?.seoTitle || 'Vigroup - Contact Us'}`,
      description: seoTrans?.seoDescription || '',
    },
  }
}
const ContactUsPage = async () => {
  const datas = await getPageBySlug('contactUs')

  return <ContactUsClient datas={datas} />
}

export default ContactUsPage
