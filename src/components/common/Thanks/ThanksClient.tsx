'use client'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import React from 'react'

const ThanksClient = () => {
  const t = useTranslations('thanks')

  return (
    <div>
      <>
        <div className='bg-black h-[135px] w-full' />
        <div className='min-h-screen bg-gray-50  flex flex-col items-center justify-center px-6 py-12 space-y-8'>
          <h1 className='text-4xl font-semibold md:text-5xl text-[#C74242]'>
            🎉 {t('thank_you')}
          </h1>
          <p className='text-lg max-w-xl text-center text-[#797370] text-[17px]'>
            {t('order_success')}
          </p>

          <div className='flex flex-col sm:flex-row gap-4'>
            <Link
              href='/'
              className='px-6 py-3 bg-gold text-[#C74242] border border-[#C74242] text-[17px] font-[400] rounded-full 
                      hover:bg-[#C74242] transition duration-300 hover:text-white'
            >
              {t('back_home')}
            </Link>
            <Link
              href='/e-shop'
              className='px-6 py-3 bg-[#C74242] text-white border border-[#C74242] rounded-full hover:bg-white
                      hover:text-[#C74242] transition duration-300 text-[17px] font-[400]'
            >
              {t('view_more_products')}
            </Link>
          </div>

          <div className='w-full max-w-md space-y-6 pt-12'>
            <h2 className='text-2xl font-medium text-center text-[#C74242]'>
              {t('you_can')}
            </h2>
            <ul className='list-disc list-inside space-y-3 pl-4 text-[#797370]'>
              <li>{t('check_email')}</li>
              <li>{t('review_after_receive')}</li>
              <li>{t('contact_if_need_support')}</li>
            </ul>
          </div>
        </div>
      </>
    </div>
  )
}

export default ThanksClient
