import React from 'react'
import { getTranslations } from 'next-intl/server'
import { ThanksClient } from '@/components'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale })
  return {
    title: `Vigroup - ${t('shop.thankTitle')}`,
  }
}

const ThanksPage = () => {
  return <ThanksClient />
}

export default ThanksPage
