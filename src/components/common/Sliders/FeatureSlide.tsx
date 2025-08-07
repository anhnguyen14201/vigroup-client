'use client'

import React, { useRef, useState, useEffect } from 'react'
import { motion, useMotionValue, useAnimation } from 'framer-motion'
import { useLocale, useTranslations } from 'next-intl'
import { IProduct, Locale } from '@/interface'
import { useGetContentTranslation } from '@/hooks'
import clsx from 'clsx'
import {
  calculateDiscountPercentage,
  calculatePriceExcludingTax,
  formatCurrency,
} from '@/utils'
import Link from 'next/link'
import Image from 'next/image'

interface FeatureSlideProps {
  datas: IProduct[]
}

const getStatusMap = (t: ReturnType<typeof useTranslations>) => ({
  'In Stock': { label: t('inStock'), color: 'text-green-600' },
  'Low Stock': { label: t('lowStock'), color: 'text-yellow-600' },
  'Out of Stock': { label: t('outOfStock'), color: 'text-red-600' },
})

const FeatureSlide: React.FC<FeatureSlideProps> = React.memo(({ datas }) => {
  const locale = useLocale() as Locale
  const t = useTranslations('shop')
  const carouselRef = useRef<HTMLDivElement>(null)
  const [itemWidth, setItemWidth] = useState(0)
  const [dragWidth, setDragWidth] = useState(0)
  const [visibleCount, setVisibleCount] = useState(1)
  const [pages, setPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(0)
  const gap = 24 // px for column gap

  const x = useMotionValue(0)
  const controls = useAnimation()

  useEffect(() => {
    const ref = carouselRef.current
    if (!ref) return
    const scrollW = ref.scrollWidth
    const offsetW = ref.offsetWidth
    setDragWidth(scrollW - offsetW)

    const first = ref.querySelector('.carousel-item') as HTMLElement
    if (first) {
      const w = first.offsetWidth
      setItemWidth(w + gap)
      const count = Math.max(Math.floor(offsetW / w), 1)
      setVisibleCount(count)
      setPages(Math.ceil(datas.length / count))
    }
  }, [datas])

  // update currentPage on drag
  useEffect(() => {
    const maxStartIndex = Math.max(datas.length - visibleCount, 0)
    return x.onChange(latest => {
      const rawIndex = Math.round(-latest / itemWidth)
      let page: number
      if (rawIndex >= maxStartIndex) {
        page = pages - 1
      } else {
        page = Math.floor(rawIndex / visibleCount)
      }
      if (page !== currentPage && page >= 0) {
        setCurrentPage(page)
      }
    })
  }, [x, itemWidth, visibleCount, pages, currentPage, datas.length])

  const handleDotClick = (pageIdx: number) => {
    const targetIndex = pageIdx * visibleCount
    const maxIndex = Math.max(datas.length - visibleCount, 0)
    const clampedIndex = Math.min(targetIndex, maxIndex)
    const dest = -clampedIndex * itemWidth
    controls.start({
      x: dest,
      transition: { type: 'tween', ease: 'easeOut', duration: 0.5 },
    })
    setCurrentPage(pageIdx)
  }

  const statusMap: Record<string, { label: string; color: string }> = {
    'In Stock': { label: t('inStock'), color: 'text-green-600' },
    'Low Stock': { label: t('lowStock'), color: 'text-yellow-600' },
    'Out of Stock': { label: t('outOfStock'), color: 'text-red-600' },
  }

  return (
    <div>
      <div
        className='w-full overflow-hidden cursor-grab'
        style={{ columnGap: `${gap}px` }}
        ref={carouselRef}
      >
        <motion.div
          className='flex gap-6 p-4'
          style={{ x }}
          drag='x'
          dragConstraints={{ right: 0, left: -dragWidth }}
          animate={controls}
          whileTap={{ cursor: 'grabbing' }}
        >
          {datas.map(product => {
            const dataTrans = useGetContentTranslation(product, locale)
            const status = product.stockStatus
            const { label, color } = statusMap[status] || {
              label: status,
              color: 'text-gray-500',
            }

            return (
              <div
                key={product._id}
                className='carousel-item min-w-[240px] max-w-[240px] relative bg-white p-5 rounded-2xl border hover:border-red-400 transition duration-300 flex flex-col justify-between flex-shrink-0'
              >
                <div className='absolute top-0 left-0 flex flex-col items-start'>
                  {product.isNewArrival && (
                    <div className='bg-green-200 text-green-600 text-sm px-5 py-0.5 rounded-br-2xl mb-1 rounded-tl-2xl'>
                      {t('isNewArrival')}
                    </div>
                  )}
                  {product.isFeatured && (
                    <div
                      className={clsx(
                        'bg-blue-200 text-blue-600 text-sm px-5 py-0.5 rounded-br-2xl',
                        product.isNewArrival ? '' : 'rounded-tl-2xl',
                      )}
                    >
                      {t('isFeatured')}
                    </div>
                  )}
                </div>
                {product.discount > 0 && (
                  <div className='absolute top-0 right-0 bg-red-200 text-red-600 text-sm px-5 py-0.5 rounded-bl-2xl rounded-tr-2xl'>
                    -{' '}
                    {calculateDiscountPercentage(
                      product.price,
                      product.discount,
                    )}{' '}
                    %
                  </div>
                )}

                <Link href={`/e-shop/${dataTrans.slug}`} passHref>
                  <div className='flex flex-col items-center p-5'>
                    <div className='h-48 flex items-center relative'>
                      <Image
                        src={product.thumbnailUrls?.[0] || '/placeholder.png'}
                        alt={dataTrans.productName || ''}
                        width={200}
                        height={100}
                        priority
                        className='object-cover rounded-lg'
                      />
                    </div>
                    <h2 className='font-semibold text-gray-800 mb-2'>
                      {dataTrans.productName}
                    </h2>

                    {product.discount > 0 && (
                      <p className='text-sm text-gray-600 font-semibold line-through'>
                        {formatCurrency(product.price, 203)}
                      </p>
                    )}
                    <p className='text-lg font-bold text-red-600'>
                      {product.discount > 0
                        ? formatCurrency(product.discount, 203)
                        : formatCurrency(product.price, 203)}
                    </p>
                    <p className='text-xs font-semibold text-gray-600'>
                      {formatCurrency(
                        calculatePriceExcludingTax(
                          product.discount > 0
                            ? product.discount
                            : product.price,
                          product.tax,
                        ),
                        203,
                      )}{' '}
                      {t('tax')}
                    </p>

                    <p className={`font-semibold text-sm ${color}`}>{label}</p>
                  </div>
                </Link>

                <button
                  type='button'
                  aria-label='seeMore'
                  className={clsx(
                    (product.quantity <= 0 || product.price <= 0) &&
                      'cursor-not-allowed opacity-50',
                    'mt-4 w-full text-white py-2 px-1 cursor-pointer border hover:border-[#C74242] rounded-lg font-semibold hover:text-[#C74242] hover:bg-white bg-[#C74242] duration-300 transition',
                  )}
                  disabled={product.quantity <= 0 || product.price <= 0}
                >
                  {t('addToCart')}
                </button>
              </div>
            )
          })}
        </motion.div>
      </div>

      {/* Dots navigation per page */}
      <div className='flex justify-center items-center mt-4 mb-4'>
        {Array.from({ length: pages }).map((_, idx) => (
          <button
            type='button'
            key={idx}
            className={clsx(
              'w-2 h-2 mx-3 rounded-full transition-all cursor-pointer',
              currentPage === idx ? 'bg-[#C74242] scale-125' : 'bg-gray-300',
            )}
            onClick={() => handleDotClick(idx)}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  )
})

FeatureSlide.displayName = 'FeatureSlide' // For better debugging in React DevTools
export default FeatureSlide
