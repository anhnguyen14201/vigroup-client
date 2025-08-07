import { getTranslations } from 'next-intl/server'
import { CartPageClient } from '@/components'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale })
  return {
    title: `Vigroup - ${t('shop.cart')}`,
  }
}

export default function CartPage() {
  return <CartPageClient />
}
