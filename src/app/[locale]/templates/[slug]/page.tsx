import ProjectDetail from '@/components/common/Project/ProjectDetail'
import { localeToIdMap } from '@/constants'
import { Translation } from '@/interface'
import { getProjectBySlug } from '@/lib'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'
export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string }
}): Promise<Metadata> {
  const { locale, slug } = await params
  let data: any
  try {
    data = await getProjectBySlug(slug)
  } catch (err: any) {
    // Nếu không tìm thấy, trả về mặc định hoặc notFound
    if (err.response?.status === 404) {
      return {
        title: 'Product Not Found',
      }
    }
    throw err
  }

  // lấy ObjectId tương ứng locale
  const langId = localeToIdMap[locale] || localeToIdMap['vi']

  // tìm bản dịch SEO
  const seoTrans = data.translations.find((t: Translation) =>
    typeof t.language === 'string'
      ? t.language === langId
      : t.language &&
        typeof t.language === 'object' &&
        '_id' in t.language &&
        (t.language as { _id: string })._id === langId,
  )

  return {
    title: `${'Vigroup - ' + seoTrans?.projectName || 'Vigroup - Template'}`,
    description: seoTrans?.seoDescription || '',
    openGraph: {
      title: `${'Vigroup - ' + seoTrans?.projectName || 'Vigroup - Template'}`,
      description: seoTrans?.seoDescription || '',
    },
  }
}

const TemplateDetailPage = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params

  let data
  try {
    data = await getProjectBySlug(slug)
  } catch (err: any) {
    // Nếu slug không tồn tại, redirect qua 404 của Next.js
    if (err.response?.status === 404) return notFound()
    throw err
  }

  return (
    <>
      <div className='bg-black h-[135px] w-full'></div>
      <ProjectDetail data={data} />
    </>
  )
}

export default TemplateDetailPage
