'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { Check, PlayIcon } from 'lucide-react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import 'react-loading-skeleton/dist/skeleton.css'

const LogoBanner = dynamic(() => import('@/components/ui/LogoBanner'), {
  ssr: false,
})
const Skeleton = dynamic(() => import('react-loading-skeleton'), { ssr: false })
import { useGetContentTranslation } from '@/hooks'
import { Locale } from '@/interface'
import { getEmbedUrl } from '@/utils'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import dynamic from 'next/dynamic'
interface ArticleSectionProps {
  article: any
  locale: Locale
  isLast: boolean
}

const fadeVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const ArticleSection: React.FC<ArticleSectionProps> = React.memo(
  ({ article, locale, isLast }) => {
    const artT = useGetContentTranslation(article, locale)
    const preview = Array.isArray(article.imageUrls)
      ? article.imageUrls[0]
      : null
    const embedUrl = getEmbedUrl(article.videoUrl)
    const posClass =
      article.position?.[0] !== 'left' ? 'lg:flex-row-reverse' : ''

    // loading state until preview and text ready
    const [isLoading, setIsLoading] = useState(true)
    const checkReady = useCallback(() => {
      if (
        preview &&
        artT.heading &&
        artT.subtext &&
        Array.isArray(artT.features)
      ) {
        setIsLoading(false)
      }
    }, [preview, artT])

    useEffect(() => {
      checkReady()
    }, [checkReady])

    // Skeleton placeholder
    if (isLoading) {
      return (
        <div className='max-w-screen-2xl mx-auto px-4 py-12 sm:py-16 lg:py-28'>
          <Skeleton height={300} className='mb-6 rounded-xl' />
          <Skeleton width={120} height={20} className='mb-2' />
          <Skeleton width={200} height={30} className='mb-4' />
          <Skeleton count={3} className='mb-2' />
          <div className='mt-4 flex space-x-4'>
            <Skeleton circle width={40} height={40} />
            <Skeleton circle width={40} height={40} />
            <Skeleton circle width={40} height={40} />
          </div>
        </div>
      )
    }

    return (
      <>
        <div
          className={`flex max-w-screen-2xl mx-auto px-4 sm:px-6 flex-col lg:flex-row items-stretch py-12 sm:py-16 lg:py-28 bg-white rounded-xl ${posClass}`}
        >
          {preview && (
            <motion.div
              className='w-full lg:w-[50%] flex-shrink-0 mb-6 lg:mb-0'
              variants={{
                hidden: { opacity: 0, x: -50 },
                visible: { opacity: 1, x: 0 },
              }}
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1, ease: 'easeOut' }}
            >
              <Dialog>
                <DialogTrigger asChild>
                  <button
                    type='button'
                    aria-label='Play video'
                    className={`relative w-full h-64 md:h-96 lg:h-full overflow-hidden cursor-pointer group rounded-3xl ${
                      article.videoUrl ? 'rounded-bl-[0px]' : ''
                    }`}
                  >
                    <div className='w-full h-full overflow-hidden rounded-3xl relative group-hover:scale-105 transition-transform duration-500 ease-in-out'>
                      <Image
                        src={preview}
                        alt={artT.heading}
                        fill
                        priority
                        sizes='(max-width: 768px) 100vw, 50vw'
                        className='object-cover'
                      />
                    </div>
                    {article.videoUrl && (
                      <div className='absolute -bottom-1.5 -left-1.5 bg-white w-15 h-15 md:w-25 md:h-25 rounded-tr-[50%] before:content-[" "] before:absolute before:bottom-1.5 before:-right-5 before:w-5 before:h-5 before:bg-transparent before:rounded-bl-3xl before:shadow-[-0.313rem_0.313rem_0_0.313rem_#fff] after:content-[" "] after:absolute after:-top-5 after:left-1.5 after:w-5 after:h-5 after:bg-transparent after:rounded-bl-3xl after:shadow-[-0.313rem_0.313rem_0_0.313rem_#fff]'>
                        <div className='absolute md:inset-4 inset-2.5 rounded-full bg-[#C74242] flex items-center justify-center cursor-pointer transition-transform duration-500 ease-in-out group-hover:scale-105'>
                          <PlayIcon
                            className='w-5 h-5 text-white'
                            aria-hidden='true'
                          />
                        </div>
                      </div>
                    )}
                  </button>
                </DialogTrigger>
                {article.videoUrl && (
                  <DialogContent className='aspect-video bg-transparent border-none p-0'>
                    <DialogHeader>
                      <DialogTitle />
                    </DialogHeader>
                    <div className='relative w-full h-0 pb-[56.25%]'>
                      <iframe
                        src={embedUrl}
                        title={artT.heading}
                        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                        allowFullScreen
                        className='absolute inset-0 w-full h-full rounded'
                      />
                    </div>
                  </DialogContent>
                )}
              </Dialog>
            </motion.div>
          )}
          <div className='hidden lg:block lg:w-[10%]' />

          <motion.div
            className='w-full lg:w-[40%] mb-10 py-10'
            variants={{
              hidden: { opacity: 0, x: 50 },
              visible: { opacity: 1, x: 0 },
            }}
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
          >
            <p className='mb-4 text-xs sm:text-sm font-oswald uppercase tracking-[3px] text-[#C74242]'>
              {artT.sectionLabel}
            </p>
            <h2 className='text-xl sm:text-2xl md:text-3xl lg:text-[50px] font-oswald uppercase tracking-[2px] text-[#C74242] mb-4'>
              {artT.heading}
            </h2>
            <p className='text-sm sm:text-base text-[#797370] mb-4'>
              {artT.subtext}
            </p>
            <ul className='space-y-2'>
              {artT.features.map((f: string, idx: number) => (
                <li key={idx} className='flex items-start gap-2 sm:gap-4'>
                  <Check className='w-4 h-4 text-[#C74242] flex-shrink-0 mt-1' />
                  <span className='text-sm sm:text-base text-[#797370]'>
                    {f}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
        {!isLast && <LogoBanner />}
      </>
    )
  },
)
ArticleSection.displayName = 'ArticleSection'

export default ArticleSection
