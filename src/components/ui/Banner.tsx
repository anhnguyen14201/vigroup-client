'use client'

import React from 'react'
import image from '@/assets/images/Architecture.png'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Breadcrumb } from '@/components/common'
import { IBannerProps } from '@/interface'
import Image from 'next/image'

const Banner = ({ title }: IBannerProps) => {
  // Hiệu ứng parallax cho background
  const { scrollYProgress } = useScroll()
  const parallaxY = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  return (
    <div className='relative w-full h-[35vh] overflow-hidden'>
      <motion.div
        style={{ y: parallaxY }}
        className='absolute inset-0 w-full h-full'
      >
        <Image
          src={image.src}
          alt='header-bg-copyright'
          fill // cho phép ảnh đổ đầy container
          className='object-cover'
          priority // nếu đây là background quan trọng cần load sớm
        />
      </motion.div>
      <div className='absolute inset-0 bg-black opacity-50'></div>
      <div className='absolute inset-0 flex-col p-4 mt-20 flex items-center justify-center'>
        <h1 className='text-white text-4xl font-bold capitalize z-10'>
          {title}
        </h1>
        <div className='text-white text-lg text-center font-semibold capitalize z-10 mt-5'>
          <Breadcrumb />
        </div>
      </div>
    </div>
  )
}

export default Banner
