'use client'

import { useLocale } from 'next-intl'
import nProgress from 'nprogress'
import React, { useEffect } from 'react'
import dynamic from 'next/dynamic'

import { Locale } from '@/interface'
import HeroSection from '@/components/common/Page/HeroSection'

const FeatureService = dynamic(
  () =>
    import('@/components/common/Services').then(mod => ({
      default: mod.FeatureService,
    })),
  { ssr: false },
)
const ServiceClient = ({ datas, dataSmarthome, dataAir, dataDesign }: any) => {
  const locale = useLocale() as Locale
  useEffect(() => {
    if (datas) {
      nProgress.done()
    }
  }, [datas])
  return (
    <>
      {datas.heroSections?.map((h: any, i: number) => (
        <HeroSection key={i} section={h} locale={locale} index={i} />
      ))}

      <div className='max-w-screen-2xl mx-auto px-4 sm:px-6 mb-25'>
        <FeatureService
          dataSmarthome={dataSmarthome}
          dataAir={dataAir}
          dataDesign={dataDesign}
        />
      </div>
    </>
  )
}

export default ServiceClient
