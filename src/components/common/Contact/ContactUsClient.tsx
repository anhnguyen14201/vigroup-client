'use client'

import React, { useEffect, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import nProgress from 'nprogress'
import HeroSection from '@/components/common/Page/HeroSection'
import { FiMail, FiMapPin, FiPhone } from 'react-icons/fi'
import { Locale } from '@/interface'
import { motion } from 'framer-motion'
import { usePublicInfor } from '@/hooks'
import { formatPhone } from '@/utils'

export default function ContactUsClient({ datas }: any) {
  const locale = useLocale() as Locale
  const { heroSections } = datas
  const { items: infor } = usePublicInfor()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  useEffect(() => {
    if (datas) nProgress.done()
  }, [datas])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }
  const t = useTranslations('contact')

  const emailItem = infor?.find(item => item.inforType === 'email')
  const email = emailItem?.desc ?? 'Chưa có email'

  const phoneItem = infor?.find(item => item.inforType === 'phone')
  const phone = phoneItem?.desc ?? 'Chưa có số điện thoại'

  const addressItem = infor?.find(item => item.inforType === 'address')
  const address = addressItem?.desc ?? 'Chưa có địa chỉ'
  const urlAddess = addressItem?.url ?? 'Chưa có địa chỉ'

  return (
    <div className='flex flex-col space-y-24'>
      {/* Hero Sections */}
      <div className='lg:relative'>
        {heroSections.map((section: any, idx: number) => (
          <HeroSection
            key={idx}
            section={section}
            locale={locale}
            index={idx}
          />
        ))}

        {/* Floating Info Cards */}
        <div className='lg:absolute inset-x-0 bottom-0 transform lg:translate-y-1/3 px-6'>
          <div className='max-w-screen-xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {[
              {
                icon: <FiMail />,
                label: 'E-mail',
                value: email,
              },
              {
                icon: <FiMapPin />,
                label: t('OurAddress'),
                value: address,
              },
              {
                icon: <FiPhone />,
                label: t('CallUs'),
                value: formatPhone(phone),
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0 }}
                whileHover={{ y: -5 }}
                className='group bg-[#f9f6f3] text-[#101010] cursor-pointer dark:bg-gray-800 
                   rounded-3xl py-[45px] px-[30px] flex items-start transition
                   space-x-4 flex-col hover:bg-[#C74242] hover:text-white'
              >
                {/* Icon với group-hover */}
                <div className='text-4xl text-[#C74242] group-hover:text-white mt-1 mb-[15px]'>
                  {item.icon}
                </div>

                <h4
                  className='text-[21px] uppercase font-light mb-[5px] 
                     tracking-[2px] font-oswald 
                     group-hover:text-white'
                >
                  {item.label}
                </h4>
                <p className='mt-1 text-lg text-[#797370] font-light group-hover:text-white'>
                  {item.value}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Form & Map */}
      <div className='z-10 px-6 mt-20 mb-20'>
        <div className='max-w-screen-2xl mx-auto grid grid-cols-1 xl:grid-cols-2 gap-30'>
          {/* Contact Form */}
          <motion.form
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className='space-y-6'
          >
            <h3
              className='text-[#101010] tracking-[2px]
                        dark:text-white text-center uppercase text-[21px]'
            >
              {t('GetinTouch')}
            </h3>
            <input
              name='name'
              type='text'
              required
              placeholder={t('YourName')}
              value={formData.name}
              onChange={handleChange}
              className='w-full bg-[#f9f6f3] dark:bg-[#797370] rounded-full px-6 py-5 focus:ring-gold focus:outline-none
                        mb-[15px] text-[17px]'
            />
            <input
              name='email'
              type='email'
              required
              placeholder={t('YourEmail')}
              value={formData.email}
              onChange={handleChange}
              className='w-full bg-[#f9f6f3] dark:bg-[#797370] rounded-full px-6 py-5 focus:ring-gold focus:outline-none
                        mb-[15px] text-[17px]'
            />
            <input
              name='subject'
              type='text'
              required
              placeholder={t('Subject')}
              value={formData.subject}
              onChange={handleChange}
              className='w-full bg-[#f9f6f3] dark:bg-[#797370] rounded-full px-6 py-5 focus:ring-gold focus:outline-none
                        mb-[15px] text-[17px]'
            />
            <textarea
              name='message'
              rows={6}
              required
              placeholder={t('Message')}
              value={formData.message}
              onChange={handleChange}
              className='w-full bg-[#f9f6f3] dark:bg-gray-700 rounded-2xl px-6 py-4 focus:ring-gold focus:outline-none
                        mb-[15px] text-[17px]'
            />
            <button
              aria-label='Send'
              type='submit'
              className={`bg-[#C74242] text-white rounded-full py-[20px] cursor-pointer border 
                      hover:border-[#C74242] hover:bg-white hover:text-[#C74242]
                         disabled:opacity-50 disabled:cursor-not-allowed text-[17px] px-[50px] font-[400]`}
            >
              {t('SendMessage')}
            </button>
          </motion.form>

          {/* Map Embed */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className='space-y-6'
          >
            <h3
              className='text-[#101010] tracking-[2px]
                        dark:text-white text-center uppercase text-[21px]'
            >
              {t('Location')}
            </h3>
            <div className='w-full h-[530px] rounded-3xl overflow-hidden'>
              <iframe
                src={urlAddess}
                width='100%'
                height='100%'
                style={{ border: 0 }}
                allowFullScreen
                loading='lazy'
                referrerPolicy='no-referrer-when-downgrade'
              ></iframe>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
