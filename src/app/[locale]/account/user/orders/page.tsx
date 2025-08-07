import React from 'react'
import { getTranslations } from 'next-intl/server'
import { OrderFrontEnd } from '@/components'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale })
  return {
    title: `Vigroup - ${t('order.order')}`,
  }
}

const OrderPage = () => {
  return (
    <div className=''>
      <OrderFrontEnd />
    </div>
  )
}

export default OrderPage
