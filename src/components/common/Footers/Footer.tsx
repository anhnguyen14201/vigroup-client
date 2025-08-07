'use client'
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTiktok,
  FaTwitter,
  FaYoutube,
} from 'react-icons/fa'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import nProgress from 'nprogress'
import Skeleton from 'react-loading-skeleton'
import { useLocale, useTranslations } from 'next-intl'

import 'react-loading-skeleton/dist/skeleton.css'

import { Locale } from '@/interface'
import { useGetContentTranslation, useLogos, usePublicInfor } from '@/hooks'
import { getPageBySlug } from '@/lib'
import { formatPhone } from '@/utils'

const Footer = () => {
  const { items: logos } = useLogos()
  const { items: infor } = usePublicInfor()
  type HomeType = { data: unknown } | undefined
  const [home, setHome] = useState<HomeType>(undefined)
  const locale = useLocale() as Locale

  const t = useTranslations()

  const logoDark = logos?.find((logo: any) => logo?.logoType === 'logoWhite')

  const emailItem = infor.find(item => item.inforType === 'email')
  const email = emailItem?.desc ?? ''

  const phoneItem = infor.find(item => item.inforType === 'phone')
  const phone = phoneItem?.desc ?? ''

  const socialTypes = [
    'facebook',
    'instagram',
    'youtube',
    'twitter',
    'tiktok',
    'linkedIn',
  ]

  const ICON_MAP: Record<string, React.ComponentType<any>> = {
    facebook: FaFacebookF,
    instagram: FaInstagram,
    youtube: FaYoutube,
    twitter: FaTwitter,
    tiktok: FaTiktok,
    linkedIn: FaLinkedinIn,
  }

  const socialLinks = infor?.filter((item: any) =>
    socialTypes.includes(item.inforType),
  )

  const [bgLoaded, setBgLoaded] = useState(false)

  useEffect(() => {
    async function fetchHome() {
      nProgress.start()
      try {
        const res = await getPageBySlug('home')
        setHome(res as HomeType)
      } catch {
      } finally {
        nProgress.done()
      }
    }
    fetchHome()
  }, [])

  const data =
    (home && (home as { heroSections?: any[] }).heroSections?.[0]) || undefined
  const dataBanner = useGetContentTranslation(data, locale)
  const content = useGetContentTranslation(logoDark, locale)

  // Trigger skeleton until imageUrl available
  useEffect(() => {
    if (data?.imageUrls?.[0]) {
      setBgLoaded(true)
    }
  }, [data])

  return (
    <>
      {/* Hero / Contact Us with Skeleton */}
      <section
        id='contact-us'
        className='relative flex items-center w-full text-[#f5f5f5] min-h-[500px]'
      >
        {!bgLoaded ? (
          <Skeleton height={500} className='absolute inset-0' />
        ) : (
          <section className='relative flex items-center w-full text-[#f5f5f5] min-h-[500px]'>
            <Image
              src={data?.imageUrls[0] || '/fallback.jpg'}
              alt='Hero background'
              fill
              className='object-cover'
              sizes='(min-width: 1024px) 50vw, 100vw'
              priority // vì đây là LCP element
              placeholder='empty'
            />

            <div
              aria-hidden='true'
              className={
                `absolute inset-0 bg-black will-change-opacity transition-opacity ` +
                `duration-300 ease-in-out ${
                  bgLoaded ? 'opacity-60' : 'opacity-0'
                }`
              }
            />
            <div className='relative max-w-screen-2xl  mx-auto px-4 grid grid-cols-1 xl:grid-cols-2 gap-12'>
              <div className='flex flex-col justify-center'>
                <p className='uppercase text-sm text-[#BE212F] mb-2'>
                  {dataBanner?.heroSectionLabel || <Skeleton width={100} />}
                </p>
                <h2
                  style={{
                    minHeight: '4.5rem',
                  }}
                  className='text-4xl sm:text-5xl font-bold text-white mb-4'
                >
                  {dataBanner?.heroHeading || <Skeleton width={200} />}
                </h2>
                <div className='mt-6 space-x-6 text-[#f5f5f5] flex flex-col sm:flex-row'>
                  <div className='space-x-6'>
                    {email ? (
                      <a href={`mailto:${email}`}>{email}</a>
                    ) : (
                      <Skeleton width={150} />
                    )}
                    <span>|</span>
                  </div>
                  <div className='space-x-6'>
                    {phone ? (
                      <a href={`tel:${phone}`}>{formatPhone(phone)}</a>
                    ) : (
                      <Skeleton width={120} />
                    )}
                    <span>|</span>
                  </div>
                  <Link href='/contact-us' className='hover:text-[#BE212F]'>
                    {t('navigation.contact')} →
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}
      </section>

      {/* Footer with Skeleton for Logo/Text */}
      <footer className='bg-[#101010] text-[#f5f5f5] pt-16 min-h-[300px]'>
        <div className='max-w-screen-2xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12'>
          <div className='space-y-4'>
            {logoDark?.imageUrls?.[0] ? (
              <div className='w-[200px] h-[50px] relative'>
                <Image
                  src={logoDark?.imageUrls[0]}
                  alt='Vigroup logo'
                  width={200}
                  height={50}
                  loading='lazy' // lazy-load mặc định
                  placeholder='empty'
                  priority={false}
                  className='object-contain'
                />
              </div>
            ) : (
              <Skeleton width={200} height={50} />
            )}
            {content?.desc ? (
              <p className='text-[#f5f5f5]'>{content.desc}</p>
            ) : (
              <Skeleton count={2} />
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h1 className='text-white font-semibold mb-4'>
              {t('footer.quickLinks')}
            </h1>
            <div className='space-y-2 flex flex-col'>
              {['shop', 'services', 'projects', 'template', 'contact'].map(
                key => (
                  <Link
                    key={key}
                    href={`/${
                      key === 'contact'
                        ? 'contact-us'
                        : key === 'template'
                        ? 'templates'
                        : key
                    }`}
                    className='text-[#f5f5f5] hover:text-[#BE212F]'
                  >
                    {t(`navigation.${key}`)}
                  </Link>
                ),
              )}
            </div>
          </div>

          {/* Subscribe */}
          <div>
            <h1 className='text-white font-semibold mb-4'>
              {t('footer.subscribe')}
            </h1>
            <p className='text-[#f5f5f5] mb-4'>{t('footer.content')}</p>

            <div className='flex space-x-2'>
              {socialLinks?.map((item: any) => {
                const Icon = ICON_MAP[item.inforType]
                const url = item.url
                if (!Icon || !url) return null
                return (
                  <div
                    key={item.inforType}
                    className='w-10 h-10 rounded-full bg-[#BE212F] text-white hover:bg-beige-600 cursor-pointer flex items-center justify-center transition-colors hover:bg-white hover:text-[#BE212F] duration-300'
                  >
                    <Link
                      href={url}
                      passHref
                      legacyBehavior
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <Icon className='w-5 h-5' />
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <div className='border-t border-gray-800 mt-16 py-6'>
          <div className='max-w-6xl mx-auto px-4 text-center text-gray-300'>
            © 2025 <span className='text-[#BE212F]'>Vigroup</span> . All rights
            reserved.
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer
