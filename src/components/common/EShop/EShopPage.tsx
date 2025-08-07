'use client'

import React, { useEffect, useMemo, useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import nProgress from 'nprogress'
import dynamic from 'next/dynamic'
import { useLocale, useTranslations } from 'next-intl'

import type { Locale } from '@/interface'
import { localeToIdMap, useShopBanner } from '@/constants'
import { fetchProductsPage } from '@/hooks/fetchers'
import { usePaginatedDatas } from '@/hooks'
import HeroSection from '@/components/common/Page/HeroSection'

// Dynamic imports

const Card = dynamic(() => import('@/components/common/Card/Card'), {
  ssr: false,
})
const Image = dynamic(() => import('next/image'), { ssr: false })
const CartList = dynamic(() => import('@/components/common/EShop/CartList'), {
  ssr: false,
})
const CategoryList = dynamic(
  () => import('@/components/common/EShop/CategoryList'),
  { ssr: false },
)
const BrandList = dynamic(() => import('@/components/common/EShop/BrandList'), {
  ssr: false,
})
const ChevronDown = dynamic(
  () => import('lucide-react').then(mod => ({ default: mod.ChevronDown })),
  { ssr: false },
)

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const EShopPage: React.FC<{
  dataHeroSection: any
  dataBrands?: any
  dataCategories?: any
}> = React.memo(({ dataHeroSection, dataBrands, dataCategories }) => {
  const locale = useLocale() as Locale
  const { shopBanner } = useShopBanner()
  const [categoryId, setCategoryId] = useState<string | undefined>()
  const [brandId, setBrandId] = useState<string | undefined>()
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [sortOption, setSortOption] = useState<string>('')
  const t = useTranslations('shop')

  const { sortBy, sortOrder } = useMemo(() => {
    if (!sortOption)
      return {} as {
        sortBy?: 'productName' | 'price'
        sortOrder?: 'asc' | 'desc'
      }
    const [key, order] = sortOption.split('-') as [
      'productName' | 'price',
      'asc' | 'desc',
    ]
    return { sortBy: key, sortOrder: order }
  }, [sortOption])

  const localeId = localeToIdMap[locale] ?? localeToIdMap['vi']

  const {
    items: products,
    isLoadingMore,
    loadMore,
    totalItems,
  } = usePaginatedDatas(
    'productDatas',
    {
      categoryId,
      brandId,
      searchTerm,
      sortBy,
      sortOrder,
      localeCode: localeId,
    },
    fetchProductsPage,
    { revalidateOnFocus: true },
  )

  useEffect(() => {
    if (dataHeroSection) {
      nProgress.done()
    }
  }, [dataHeroSection])

  const scrollToProducts = useCallback(() => {
    window.scrollTo({ top: window.innerHeight * 0.5, behavior: 'smooth' })
  }, [])

  const remainingCount = totalItems - products.length

  return (
    <div className='mb-15'>
      {dataHeroSection?.heroSections?.map((h: any, i: number) => (
        <HeroSection key={i} section={h} locale={locale} index={i} />
      ))}

      <motion.div
        className='mx-auto container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'
        variants={fadeUp}
        initial='hidden'
        animate='visible'
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        {shopBanner.map((el: any, index: any) => (
          <motion.div
            key={index}
            variants={fadeUp}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Card
              title={
                <span className='text-lg font-semibold text-gray-800'>
                  {el.value}
                </span>
              }
              description={
                <span className='text-sm text-gray-600 leading-relaxed'>
                  {el.description}
                </span>
              }
              className='flex items-center'
              image={
                <div className='w-16 h-16 mr-5 rounded-full border border-gray-200 flex items-center justify-center'>
                  <Image
                    src={el.image}
                    alt={el.value as string}
                    width={64}
                    height={64}
                    priority
                    className='object-contain p-2'
                  />
                </div>
              }
            />
          </motion.div>
        ))}
      </motion.div>

      <div className='container mx-auto grid grid-cols-1 lg:grid-cols-4 gap-5 px-5'>
        <div className='lg:col-span-3 mt-5 order-2 lg:order-1'>
          <motion.div
            className='grid grid-cols-1 lg:grid-cols-4 gap-5 mb-5'
            variants={fadeUp}
            initial='hidden'
            animate='visible'
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <div className='col-span-2 col-start-1 lg:col-start-2'>
              <input
                type='text'
                placeholder={t('search')}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className='w-full pl-5 pr-4 py-2.5 border rounded-2xl focus:outline-none focus:ring-0.5 
                          focus:ring-[#C74242] focus:border-[#C74242] transition'
              />
            </div>
            <div className='col-span-1 relative'>
              <select
                aria-label={t('sort')}
                value={sortOption}
                onChange={e => setSortOption(e.target.value)}
                className='
                          w-full
                          bg-white          
                          border
                          rounded-2xl
                          py-2.5
                          pl-3
                          pr-10
                          focus:outline-none
                          focus:ring-0.5
                          focus:ring-[#C74242]
                          focus:border-[#C74242]
                          appearance-none
                          transition
                          duration-300
                        '
              >
                {/* Chỉ để hidden nếu bạn không muốn người dùng chọn placeholder */}
                <option value=''>{t('sort')}</option>
                <option value='productName-asc'>{t('nameAsc')}</option>
                <option value='productName-desc'>{t('nameDesc')}</option>
                <option value='price-asc'>{t('priceAsc')}</option>
                <option value='price-desc'>{t('priceDesc')}</option>
              </select>

              <ChevronDown
                className='absolute top-1/2 right-3 -translate-y-1/2 text-gray-400'
                size={20}
              />
            </div>
          </motion.div>

          <motion.div
            className=''
            variants={fadeUp}
            initial='hidden'
            animate='visible'
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <CartList products={products} />
          </motion.div>
        </div>

        <motion.div
          variants={fadeUp}
          initial='hidden'
          animate='visible'
          transition={{ duration: 0.6, delay: 0.7 }}
          className='bg-white lg:col-span-1 h-fit lg:sticky top-28 order-1 lg:order-2'
        >
          <CategoryList
            data={dataCategories}
            onSelect={id => {
              setCategoryId(id || undefined)
              setTimeout(scrollToProducts, 50)
            }}
            selectedId={categoryId}
          />
          <BrandList
            data={dataBrands}
            onSelect={id => {
              setBrandId(id || undefined)
              setTimeout(scrollToProducts, 50)
            }}
            selectedId={brandId}
          />
        </motion.div>
      </div>

      {remainingCount > 0 && (
        <div className='container mx-auto flex justify-center mt-10 mb-10'>
          <button
            type='button'
            aria-label='seeMore'
            onClick={loadMore}
            disabled={isLoadingMore}
            className='px-[35px] py-[20px] bg-[#C74242] text-[17px] text-white border rounded-full disabled:opacity-50 cursor-pointer 
                            hover:bg-white hover:text-[#C74242] hover:border-[#C74242] transition duration-300 mt-4 flex items-center gap-2 font-[400]'
          >
            {`${t('seeMore')} (${remainingCount})`}
            <ChevronDown size={20} />
          </button>
        </div>
      )}
    </div>
  )
})

EShopPage.displayName = 'EShopPage'

export default EShopPage
