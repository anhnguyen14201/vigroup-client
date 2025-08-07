import { apiGetSlidePublic } from '@/api'
import {
  AboutUs,
  FeatureProjects,
  FeatureService,
  FeatureTemplates,
  Slider,
} from '@/components'
import { localeToIdMap } from '@/constants'
import { Translation } from '@/interface'
import { getPageBySlug } from '@/lib'
import { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  // Lần gọi đầu tiên sẽ fetch và cache
  const home = (await getPageBySlug('home')) as any
  const langId = localeToIdMap[locale] || localeToIdMap['vi']
  const seoTrans = home.translations.find(
    (t: Translation) => t.language === langId,
  )

  return {
    title: `${'Vigroup - ' + seoTrans?.seoTitle || 'Vigroup - Trang chủ'}`,
    description: seoTrans?.seoDescription || '',
    openGraph: {
      title: `${'Vigroup - ' + seoTrans?.seoTitle || 'Vigroup - Trang chủ'}`,
      description: seoTrans?.seoDescription || '',
      url: 'https://vigroup.cz',
      siteName: 'ViGroup',
      locale,
      type: 'website',
    },
  }
}

export default async function HomePage() {
  // Fetch data in parallel
  const [slideRes, aboutPage, smarthome, airPump, design] = await Promise.all([
    apiGetSlidePublic(),
    getPageBySlug('aboutUs'),
    getPageBySlug('smarthome'),
    getPageBySlug('air-conditioning-heat-pumps'),
    getPageBySlug('construction-design-consultancy'),
  ])

  const dataSlide = slideRes.data.data
  const dataAboutContent = (aboutPage as any).articles?.[0]
  const dataSmarthome = smarthome as any
  const dataAir = airPump as any
  const dataDesign = design as any

  return (
    <>
      <Slider dataSlide={dataSlide} />
      <AboutUs dataAboutContent={dataAboutContent} />
      <div className='max-w-screen-2xl mx-auto px-4 sm:px-6 mb-25'>
        <FeatureService
          dataSmarthome={dataSmarthome}
          dataAir={dataAir}
          dataDesign={dataDesign}
        />
      </div>
      <FeatureProjects />
      <FeatureTemplates />
    </>
  )
}
