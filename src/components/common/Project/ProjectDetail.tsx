'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { ChevronRight, MapPin } from 'lucide-react'

import {
  Breadcrumb as UIBreadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { routing } from '@/i18n'
import { useGetContentTranslation } from '@/hooks'

import { useLocale, useTranslations } from 'next-intl'
import { Locale } from '@/interface'
import ProjectSlider from '@/components/common/Project/ProjectSlider'
import Link from 'next/link'

interface ProductDetailProps {
  data: any
}

const ProjectDetail = ({ data }: ProductDetailProps) => {
  const locale = useLocale() as Locale

  const t = useTranslations()

  const pathname = usePathname()
  const pathSegments = pathname.split('/').filter(Boolean)

  const isLocalePrefixed = routing.locales.includes(
    pathSegments[0] as (typeof routing.locales)[number],
  )
  const breadcrumbSegments = isLocalePrefixed
    ? pathSegments.slice(1)
    : pathSegments

  const productDetail = useGetContentTranslation(data, locale)

  return (
    <>
      <div className='max-w-screen-2xl mx-auto px-4 sm:px-6 xl:mb-20 mb-10'>
        {/* Breadcrumb */}
        <div className='py-4'>
          <UIBreadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href='/' className='text-gray-500'>
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>

              {breadcrumbSegments.map((seg, idx) => {
                const href =
                  '/' + breadcrumbSegments.slice(0, idx + 1).join('/')
                const isLast = idx === breadcrumbSegments.length - 1
                return (
                  <React.Fragment key={href}>
                    <BreadcrumbSeparator>
                      <ChevronRight className='w-5 h-5' />
                    </BreadcrumbSeparator>

                    <BreadcrumbItem>
                      {isLast ? (
                        <BreadcrumbPage>{seg}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={href} className='text-gray-500'>
                          {seg}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </React.Fragment>
                )
              })}
            </BreadcrumbList>
          </UIBreadcrumb>
        </div>
        <div className='grid grid-cols-1 xl:grid-cols-3 gap-6'>
          {/* Left: Main slider */}
          <div className='col-span-1 xl:col-span-2'>
            <ProjectSlider data={data} />
          </div>

          {/* Right: Details panel */}
          <div className='col-span-1'>
            <div className='max-w-4xl flex flex-col lg:flex-row gap-8 '>
              {/* Thông tin sản phẩm */}
              <div className='flex-1 flex flex-col'>
                <div className='flex items-center mt-2'>
                  <span className='ml-2 text-gray-500 uppercase font-semibold text-sm'>
                    {data?.code}
                  </span>
                </div>
                <h1 className='text-3xl font-semibold'>
                  {productDetail?.projectName}
                </h1>

                <p className='ml-2 text-gray-500 uppercase font-semibold text-sm flex items-center gap-1'>
                  <MapPin className='w-4 h-4' />
                  {data?.location}
                </p>

                <div className='mt-4 items-baseline flex flex-col space-x-2'></div>

                {Array.isArray(productDetail.description) ? (
                  <ol className='list-decimal pl-5'>
                    {productDetail.description.map((item: any, idx: any) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ol>
                ) : (
                  <div
                    className='mt-4 prose list-decimal pl-5'
                    dangerouslySetInnerHTML={{
                      __html: productDetail.description ?? '',
                    }}
                  />
                )}

                <div className='w-full'>
                  <Link href='/contact-us' passHref>
                    <button
                      type='button'
                      aria-label='contact-us'
                      className='mt-6 px-[35px] py-[15px] font-[400] capitalize cursor-pointer
                               bg-[#C74242] text-[17px] text-white rounded-full
                               hover:bg-white border hover:border-[#C74242] hover:text-[#C74242] transition'
                    >
                      {t('contact.GetinTouch')}
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProjectDetail
