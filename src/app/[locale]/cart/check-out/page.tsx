import React from 'react'

import { PaymentPageClient } from '@/components'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale })
  return {
    title: `Vigroup - ${t('shop.checkout')}`,
  }
}

export default function PaymentPage() {
  return <PaymentPageClient />
}
