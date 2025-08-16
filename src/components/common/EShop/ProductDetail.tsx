'use client'

import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import clsx from 'clsx'

import { routing } from '@/i18n'
import {
  calculateDiscountPercentage,
  calculatePriceExcludingTax,
  formatCurrency,
} from '@/utils'
import { useTranslations } from 'next-intl'
import type { Locale } from '@/interface'
import { addToCart } from '@/redux'
import { useDispatch } from 'react-redux'
import { useGetContentTranslation } from '@/hooks'
import {
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

// Dynamic imports for heavy components
const UIBreadcrumb = dynamic(
  () =>
    import('@/components/ui/breadcrumb').then(mod => ({
      default: mod.Breadcrumb,
    })),
  { ssr: false },
)
const BreadcrumbItem = dynamic(
  () =>
    import('@/components/ui/breadcrumb').then(mod => ({
      default: mod.Breadcrumb,
    })),
  { ssr: false },
)
const ImageSlider = dynamic(
  () =>
    import('@/components/common/Sliders').then(mod => ({
      default: mod.ImageSlider,
    })),
  { ssr: false },
)
const FeatureSlide = dynamic(
  () =>
    import('@/components/common/Sliders').then(mod => ({
      default: mod.FeatureSlide,
    })),
  { ssr: false },
)
const ChevronRight = dynamic(
  () => import('lucide-react').then(mod => ({ default: mod.ChevronRight })),
  { ssr: false },
)
const MinusIcon = dynamic(
  () => import('lucide-react').then(mod => ({ default: mod.MinusIcon })),
  { ssr: false },
)
const PlusIcon = dynamic(
  () => import('lucide-react').then(mod => ({ default: mod.PlusIcon })),
  { ssr: false },
)

interface ProductDetailProps {
  data: any
  dataRelatedProducts: any
  locale: Locale
}

const ProductDetail: React.FC<ProductDetailProps> = React.memo(
  ({ data, dataRelatedProducts, locale }) => {
    const t = useTranslations('shop')
    const dispatch = useDispatch()

    const pathname = usePathname()
    const pathSegments = pathname.split('/').filter(Boolean)

    const isLocalePrefixed = routing.locales.includes(
      pathSegments[0] as (typeof routing.locales)[number],
    )
    const breadcrumbSegments = isLocalePrefixed
      ? pathSegments.slice(1)
      : pathSegments

    const productDetail = useGetContentTranslation(data, locale)

    const [qty, setQty] = useState(1)

    function updateQty(delta: any) {
      setQty(q => Math.max(1, q + delta))
    }

    const [activeTab, setActiveTab] = useState<
      'detailedDescription' | 'technicalSpecifications'
    >('detailedDescription')

    const handleTab = (
      tab: 'detailedDescription' | 'technicalSpecifications',
    ) => {
      setActiveTab(tab)
    }

    const handleAddToCart = (product: any) => {
      dispatch(addToCart({ ...product, quantity: 1 }))
    }

    return (
      <>
        <div className='max-w-screen-xl mx-auto px-4 sm:px-6'>
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
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {/* Left: Main slider */}
            <ImageSlider data={data} />

            {/* Right: Details panel */}
            <div className='max-w-4xl mx-auto flex flex-col lg:flex-row gap-8'>
              {/* Thông tin sản phẩm */}
              <div className='flex-1 flex flex-col'>
                <div className='flex items-center mt-2'>
                  <span className='ml-2 text-gray-500 uppercase font-semibold text-sm'>
                    {data.code}
                  </span>
                </div>
                <h1 className='text-3xl font-bold'>
                  {productDetail?.productName}
                </h1>

                <div className='mt-4 items-baseline flex flex-col space-x-2'>
                  <div className='flex items-center gap-2'>
                    <div className='flex items-baseline gap-2'>
                      <span className='text-2xl font-semibold '>
                        {(data?.price ?? 0) > 0
                          ? (data?.discount ?? 0) > 0
                            ? formatCurrency(data?.discount ?? 0, 203)
                            : formatCurrency(data?.price ?? 0, 203)
                          : ``}
                      </span>
                      <span className='line-through text-gray-400'>
                        {(data?.discount ?? 0) > 0 &&
                          formatCurrency(data?.price ?? 0, 203)}
                      </span>
                    </div>
                    <span className='bg-red-100 text-red-700 text-sm px-2 py-1 rounded-full'>
                      -{' '}
                      {calculateDiscountPercentage(data?.price, data?.discount)}{' '}
                      %
                    </span>
                  </div>

                  <p className='text-md font-semibold text-gray-500 pl-5'>
                    {data?.discount > 0
                      ? formatCurrency(
                          calculatePriceExcludingTax(data?.discount, data?.tax),
                          203,
                        )
                      : formatCurrency(
                          calculatePriceExcludingTax(data?.price, data?.tax),
                          203,
                        )}{' '}
                    {t('tax')}
                  </p>
                </div>

                {Array.isArray(productDetail.shortDesc) ? (
                  <ol className='list-decimal pl-5'>
                    {productDetail.shortDesc.map((item: any, idx: any) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ol>
                ) : (
                  <div
                    className='mt-4 prose list-decimal pl-5'
                    dangerouslySetInnerHTML={{
                      __html: productDetail.shortDesc ?? '',
                    }}
                  />
                )}

                {/* Số lượng và nút thêm giỏ */}
                <div className='flex items-center space-x-4 mt-10'>
                  {/* Bộ tăng giảm số lượng (chiều cao 40px) */}
                  <div className='flex items-center border border-gray-300 bg-white rounded-full h-10'>
                    <button
                      type='button'
                      aria-label='Giảm số lượng'
                      onClick={() => updateQty(-1)}
                      className='w-10 h-full flex items-center justify-center text-gray-600 hover:bg-[#C74242] hover:text-white rounded-full focus:outline-none transition cursor-pointer'
                    >
                      <MinusIcon className='w-4 h-4' />
                    </button>

                    <span className='w-12 text-center text-gray-800 font-medium'>
                      {qty}
                    </span>

                    <button
                      type='button'
                      aria-label='Tăng số lượng'
                      onClick={() => updateQty(1)}
                      className='w-10 h-full flex items-center justify-center text-gray-600 hover:bg-[#C74242] hover:text-white rounded-full focus:outline-none transition cursor-pointer'
                    >
                      <PlusIcon className='w-4 h-4' />
                    </button>
                  </div>

                  {/* Nút thêm vào giỏ (cùng chiều cao 40px) */}
                  <button
                    type='button'
                    aria-label='add to cart'
                    onClick={() => handleAddToCart(productDetail)}
                    className={clsx(
                      data?.quantity <= 0 || data?.price <= 0
                        ? 'cursor-not-allowed opacity-50'
                        : 'cursor-pointer text-[17px]',
                      'text-white py-2 px-10 rounded-full font-[400] duration-300 transition',
                      'hover:text-[#C74242] hover:bg-white border hover:border-[#C74242] bg-[#C74242]',
                    )}
                    disabled={data?.quantity <= 0 || data?.price <= 0}
                  >
                    {t('addToCart')}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <section
            className='
            mx-auto
            flex flex-col
            items-center
            px-4 sm:px-6 lg:px-8
            py-8
          '
          >
            <div
              className='
              w-full
            '
            >
              {/* Tab Triggers */}
              <div className='relative border-b w-full sm:w-1/2 grid grid-cols-2'>
                {(
                  ['detailedDescription', 'technicalSpecifications'] as const
                ).map(tab => (
                  <button
                    type='button'
                    aria-label='tab'
                    key={tab}
                    className={clsx(
                      'py-3 text-center text-lg font-semibold cursor-pointer transition-colors',
                      activeTab === tab
                        ? 'text-[#C74242]'
                        : 'text-gray-600 hover:text-[#C74242]',
                    )}
                    onClick={() => handleTab(tab)}
                  >
                    {t(tab)}
                  </button>
                ))}

                {/* Underline */}
                <motion.div
                  layoutId='underline'
                  className='absolute bottom-0 h-0.5 bg-[#C74242]'
                  style={{
                    width: '50%', // 50% của vùng chứa (tức mỗi tab)
                    left: activeTab === 'detailedDescription' ? '0%' : '50%',
                  }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </div>

              {/* Tab Content */}
              <div className='p-4'>
                <AnimatePresence mode='wait'>
                  {activeTab === 'detailedDescription' ? (
                    <motion.div
                      key='detailedDescription'
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      {Array.isArray(productDetail.desc) ? (
                        <ul className='mt-4 list-disc list-inside pl-5'>
                          {productDetail.desc.map(
                            (item: string, idx: number) => (
                              <li
                                key={idx}
                                // giữ nguyên các span ẩn của Quill nếu có
                                dangerouslySetInnerHTML={{ __html: item }}
                              />
                            ),
                          )}
                        </ul>
                      ) : (
                        <div
                          className='mt-4 prose'
                          // nếu desc là 1 chuỗi HTML full <li>, ta wrap thành <ul>
                          dangerouslySetInnerHTML={{
                            __html: `
                            <ul class="list-disc list-inside pl-5">
                              ${productDetail.desc ?? ''}
                            </ul>
                          `,
                          }}
                        />
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key='technicalSpecifications'
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      {Array.isArray(productDetail.specifications) ? (
                        <ul className='mt-4 list-disc list-inside pl-5'>
                          {productDetail.specifications.map(
                            (item: string, idx: number) => (
                              <li
                                key={idx}
                                // giữ nguyên các span ẩn của Quill nếu có
                                dangerouslySetInnerHTML={{ __html: item }}
                              />
                            ),
                          )}
                        </ul>
                      ) : (
                        <div
                          className='mt-4 prose'
                          // nếu desc là 1 chuỗi HTML full <li>, ta wrap thành <ul>
                          dangerouslySetInnerHTML={{
                            __html: `
                            <ul class="list-disc list-inside pl-5">
                              ${productDetail.specifications ?? ''}
                            </ul>
                          `,
                          }}
                        />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </section>
        </div>

        <section className='bg-gray-50 py-20'>
          <div className='max-w-screen-xl mx-auto px-4 sm:px-6'>
            <div className='flex items-center mb-8 justify-center'>
              <div className='h-0.5 w-15 md:w-30 bg-[#C74242] rounded mr-4' />
              <h2 className='text-2xl md:text-3xl font-semibold text-[#C74242]'>
                {t('productRelated')}
              </h2>
              <div className='h-0.5 w-15 md:w-30 bg-[#C74242] rounded ml-4' />
            </div>
            <div className='overflow-hidden'>
              <FeatureSlide datas={dataRelatedProducts} />
            </div>
          </div>
        </section>
      </>
    )
  },
)
ProductDetail.displayName = 'ProductDetail'

export default ProductDetail
