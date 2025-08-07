import { notFound } from 'next/navigation'
import React from 'react'
import { Metadata } from 'next'
import { localeToIdMap } from '@/constants'
import { Locale, Translation } from '@/interface'
import { getProductBySlug, getRelatedProductBySlug } from '@/lib'
import { ProductDetail } from '@/components'

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string }
}): Promise<Metadata> {
  const { locale, slug } = params
  let data: any
  try {
    data = await getProductBySlug(slug)
  } catch (err: any) {
    if (err.response?.status === 404) {
      return { title: 'Product Not Found' }
    }
    throw err
  }

  const langId = localeToIdMap[locale] || localeToIdMap['vi']
  const seoTrans = data.translations.find((t: Translation) =>
    typeof t.language === 'string'
      ? t.language === langId
      : t.language &&
        typeof t.language === 'object' &&
        '_id' in t.language &&
        (t.language as { _id: string })._id === langId,
  )

  const title = seoTrans?.productName
    ? `Vigroup - ${seoTrans.productName}`
    : 'E-Shop - Vigroup'

  return {
    title,
    description: seoTrans?.seoDescription || '',
    openGraph: {
      title,
      description: seoTrans?.seoDescription || '',
      url: 'https://vigroup.cz',
      siteName: 'ViGroup',
      locale,
      type: 'website',
    },
  }
}

// Default page component must accept both locale and slug in params
export default async function detailProductPage({
  params,
}: {
  params: { locale: Locale; slug: string }
}) {
  const { locale, slug } = await params

  let data
  let dataRelatedProducts
  try {
    data = await getProductBySlug(slug)
    dataRelatedProducts = await getRelatedProductBySlug(slug)
  } catch (err: any) {
    if (err.response?.status === 404) return notFound()
    throw err
  }

  return (
    <>
      <div className='bg-black h-[135px] w-full'></div>
      <ProductDetail
        locale={locale}
        data={data}
        dataRelatedProducts={dataRelatedProducts}
      />
    </>
  )
}
