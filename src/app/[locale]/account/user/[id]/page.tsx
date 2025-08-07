import ProtectedUserPageWrapper from '@/components/common/User/UserPage'
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
    title: `Vigroup - ${t('account.profile')}`,
  }
}

const page = () => {
  return <ProtectedUserPageWrapper />
}

export default page
