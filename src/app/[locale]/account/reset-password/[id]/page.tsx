import { ResetPassword } from '@/components'
import { getTranslations } from 'next-intl/server'
import React from 'react'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale })
  return {
    title: `Vigroup - ${t('account.resetPassword')}`,
  }
}

const page = () => {
  return <ResetPassword />
}

export default page
