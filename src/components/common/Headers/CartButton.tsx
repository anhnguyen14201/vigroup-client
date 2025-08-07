'use client'
import React, { useEffect, useMemo, useRef } from 'react'
import { ShoppingBag, Trash2Icon } from 'lucide-react'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/redux'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { useGetContentTranslation, useProductsByIdsFresh } from '@/hooks'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { Locale } from '@/interface'
import { formatCurrency } from '@/utils'
import { useDispatch } from 'react-redux'
import { removeFromCart } from '@/redux'
import Link from 'next/link'

const CartButton = () => {
  const dispatch = useDispatch()
  const locale = useLocale() as Locale
  const cartItems = useSelector((state: RootState) => state.cart.cartItems)
  const count = cartItems.length
  const badgeControls = useAnimation()
  const iconControls = useAnimation()
  const prevCountRef = useRef(count)

  const ids = cartItems.map(item => item.productId)
  const { items: datas } = useProductsByIdsFresh(ids)
  const t = useTranslations('shop')

  const productWithQty = useMemo(() => {
    return datas.map((prod: any) => {
      const matched = cartItems.find(item => item.productId === prod._id)
      return {
        ...prod,
        quantity: matched ? matched.quantity : 0,
      }
    })
  }, [datas, cartItems])

  useEffect(() => {
    if (count > prevCountRef.current) {
      badgeControls.start({ scale: [0, 1.2, 1] })
      iconControls.start({
        rotate: [0, -15, 15, 0],
        transition: { duration: 0.4 },
      })
    }
    prevCountRef.current = count
  }, [count, badgeControls, iconControls])

  const handleDelete = (id: any) => {
    dispatch(removeFromCart(id))
  }

  const proTransList = useMemo(() => {
    return productWithQty?.map((item: any) =>
      useGetContentTranslation(item, locale),
    )
  }, [productWithQty, locale])

  return (
    <div className='relative inline-block group'>
      <Link
        href='/cart'
        aria-label={`Giỏ hàng, có ${count} sản phẩm`}
        rel='noopener noreferrer'
      >
        <div className='relative inline-flex items-center justify-center p-2 rounded-full cursor-pointer'>
          <motion.div animate={iconControls} className='flex'>
            <ShoppingBag className='w-6 h-6 hover:text-[#C74242]' />
          </motion.div>
          <AnimatePresence>
            {count > 0 && (
              <motion.span
                key={count}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className='
                absolute top-0 right-0
                flex items-center justify-center
                w-5 h-5
                bg-[#C74242] text-white text-[12px] font-semibold
                rounded-full
              '
              >
                {count > 99 ? '99+' : count}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </Link>

      {/* Dropdown preview on hover */}
      <div
        className='
    absolute right-0 mt-2 w-100 bg-white shadow-lg rounded-md p-2
    opacity-0 invisible transform scale-95 transition-all duration-150
    group-hover:opacity-100 group-hover:scale-100 group-hover:visible
    z-10
  '
      >
        {productWithQty.length === 0 ? (
          <div className='p-6 text-center text-gray-500'>{t('emptyCart')}</div>
        ) : (
          <>
            <div className='max-h-64 overflow-y-auto divide-y divide-gray-100'>
              {productWithQty.map((item: any, idx: number) => {
                const proTrans = proTransList[idx]
                const price = item.discount > 0 ? item.discount : item.price

                return (
                  <div
                    key={item._id}
                    className='flex items-center p-3 hover:bg-gray-50'
                  >
                    <div className='relative flex-shrink-0 justify-center items-center'>
                      <Image
                        src={item.thumbnailUrls?.[0] || '/placeholder.png'}
                        alt={proTrans?.productName || ''}
                        width={100}
                        height={50}
                        className='rounded-md object-contain w-auto h-auto'
                        priority
                      />
                    </div>
                    <div className='flex-1 ml-3 min-w-0'>
                      <p className='text-sm font-medium text-gray-800 truncate'>
                        {proTrans?.productName}
                      </p>
                      <p className='mt-1 text-sm text-gray-600'>
                        {formatCurrency(price, 203)} × {item.quantity}
                      </p>
                    </div>
                    <button
                      type='button'
                      onClick={() => handleDelete(item._id)}
                      className='ml-2 text-gray-400 cursor-pointer hover:text-red-500 p-1'
                      aria-label='Remove item'
                    >
                      <Trash2Icon className='w-4 h-4' />
                    </button>
                  </div>
                )
              })}
            </div>
            <div className='p-3 border-t border-gray-100'>
              <div
                className='
            w-full text-center bg-white border border-[#C74242] cursor-pointer font-semibold 
            text-[#C74242] py-2 rounded-md hover:bg-[#C74242] hover:text-white transition
          '
              >
                <Link href='/cart' aria-label={'view Cart Details'}>
                  {t('viewCartDetails')}
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default CartButton
