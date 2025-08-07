'use client'

import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import nProgress from 'nprogress'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'

import { apiUpdateOrderStatus } from '@/api'
import { statusProjectClasses } from '@/constants'
import { useGetContentTranslation, usePaginatedDatas } from '@/hooks'
import { fetchOrdersPage } from '@/hooks/fetchers'
import { Locale } from '@/interface'
import { RootState } from '@/redux/redux'
import { formatCurrency, formatDateCZ } from '@/utils'

const OrderFrontEnd = () => {
  const { current } = useSelector((state: RootState) => state?.currentUser)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const locale = useLocale() as Locale
  const t = useTranslations()

  const {
    items: orders,
    isLoading,
    isLoadingMore,
    isReachingEnd,
    loadMore,
    totalItems,
    mutate,
  } = usePaginatedDatas(
    'order',
    {
      userId: current._id,
    },
    fetchOrdersPage,
    { revalidateOnFocus: false },
  )

  const toggleExpand = (orderId: string) => {
    setExpanded(prev => ({ ...prev, [orderId]: !prev[orderId] }))
  }

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await apiUpdateOrderStatus({ orderId: orderId, status: newStatus })
      mutate() // refresh list cache
      if (newStatus === 'Cancelled') {
        toast.success(t('order.cancelOrder'))
      }
    } catch (err: any) {
      toast.error(err?.message || t('order.updateOrderFail'))
    } finally {
    }
  }

  const handleCancel = async (orderId: string) => {
    if (window.confirm(t('order.updateOrderSuccess'))) {
      nProgress.start()
      try {
        await handleStatusChange(orderId, 'Cancelled')
      } finally {
        nProgress.done()
      }
    }
  }
  const remainingCount = totalItems - orders.length

  const onLoading = () => nProgress.start()
  const onLoaded = () => nProgress.done()

  useEffect(() => {
    if (isLoading) {
      onLoading()
    } else {
      onLoaded()
    }
  }, [isLoading, onLoading, onLoaded])
  return (
    <div className='space-y-6 mb-20'>
      {orders.map(order => {
        const isExpanded = !!expanded[order._id]
        const itemsToShow = isExpanded
          ? order.cartItems
          : order.cartItems.slice(0, 2)

        // Chuyển status thành màu badge
        const status = order.status?.toLowerCase() || ''
        const classes =
          statusProjectClasses[status] || 'bg-gray-100 text-gray-800 '

        // Tổng sản phẩm
        const totalQuantity = order.cartItems.reduce(
          (sum: number, item: any) => sum + item.quantity,
          0,
        )

        const labelStatus =
          order.status === 'Cancelled'
            ? t('order.canceled')
            : order.status === 'Processing'
            ? t('order.processing')
            : order.status === 'Successed'
            ? t('order.confirm')
            : ''

        return (
          <motion.div
            key={order._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='bg-white rounded-3xl border transition p-6'
          >
            {/* Header đơn hàng */}
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center'>
              <div className='flex justify-center space-x-2 items-center'>
                <p className='text-sm text-gray-500'>
                  {t('order.orderCode')}:{' '}
                </p>
                <p className='font-medium text-lg text-gray-800'>{order._id}</p>
              </div>
              <div className='mt-3 sm:mt-0 flex items-center space-x-4'>
                <p className='text-lg font-semibold text-gray-900'>
                  {formatCurrency(order.total, 203)}
                </p>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${classes}`}
                >
                  {labelStatus}
                </span>
                {status === 'processing' && (
                  <button
                    type='button'
                    aria-label='cancel'
                    onClick={() => handleCancel(order._id)}
                    className='px-3 py-1 cursor-pointer bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm font-medium'
                  >
                    {t('cancel')}
                  </button>
                )}
              </div>
            </div>

            {/* Ngày tạo & tổng sản phẩm */}
            <div className='flex flex-col sm:flex-row justify-between text-xs sm:text-sm text-gray-500 mb-4 space-y-2 sm:space-y-0'>
              <span className='break-all'>
                {t('order.address')}: {order.personalInfo.street},{' '}
                {order.personalInfo.postalCode} {order.personalInfo.province}
              </span>
              <span>
                {t('order.date')}: {formatDateCZ(order.createdAt)}
              </span>
              <span>
                {t('order.quantityProducts')}: {totalQuantity}
              </span>
            </div>

            {/* Danh sách sản phẩm */}
            <div className='divide-y divide-gray-100'>
              {itemsToShow.map((item: any) => {
                const thumbnail = item.productId.thumbnailUrls[0]
                const price = item.productId.discount ?? item.productId.price
                const total = item.quantity * price
                const trans = useGetContentTranslation(item.productId, locale)

                return (
                  <div key={item._id} className='flex items-center py-4'>
                    <div className='relative w-16 h-16'>
                      <Image
                        src={thumbnail}
                        alt={trans.productName}
                        fill
                        sizes='(max-width: 768px) 100vw, 150px'
                        className='object-contain'
                        priority
                      />
                    </div>
                    <div className='flex-1 px-4'>
                      <p className='font-medium text-gray-800'>
                        {trans.productName}
                      </p>
                      <p className='text-sm text-gray-500'>
                        {t('order.quantity')}: {item.quantity}
                      </p>
                      <p className='text-sm text-gray-500'>
                        {t('order.price')}: {formatCurrency(price, 203)}
                      </p>
                    </div>
                    <p className='font-semibold text-gray-900 whitespace-nowrap'>
                      {formatCurrency(total, 203)}
                    </p>
                  </div>
                )
              })}

              {/* Nút mở rộng */}
              {order.cartItems.length > 2 && (
                <div className='pt-4 text-center'>
                  <button
                    type='button'
                    aria-label='seeMore'
                    onClick={() => toggleExpand(order._id)}
                    className='inline-block px-4 py-2 cursor-pointer bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-medium'
                  >
                    {isExpanded
                      ? t('order.hide')
                      : `${t('order.showmore')} (${order.cartItems.length})`}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )
      })}

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
            {`${t('shop.seeMore')} (${remainingCount})`}
            <ChevronDown size={20} />
          </button>
        </div>
      )}
    </div>
  )
}

export default OrderFrontEnd
