'use client'

import React, { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/redux'
import {
  Breadcrumb as UIBreadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { routing } from '@/i18n'
import { usePathname } from 'next/navigation'
import {
  ChevronRight,
  MinusIcon,
  PlusIcon,
  ShoppingBag,
  Trash2Icon,
} from 'lucide-react'
import Link from 'next/link'
import { useGetContentTranslation, useProductsByIds } from '@/hooks'
import { useLocale, useTranslations } from 'next-intl'
import { Locale } from '@/interface'
import { formatCurrency } from '@/utils'
import { addToCart, clearCart, removeFromCart } from '@/redux'
import { useDispatch } from 'react-redux'
import Image from 'next/image'

interface CartProps {
  onLoading: () => void
  onLoaded: () => void
}

const Cart: React.FC<CartProps> = ({ onLoading, onLoaded }) => {
  const dispatch = useDispatch()
  const locale = useLocale() as Locale
  const t = useTranslations('shop')

  const cartItems = useSelector((state: RootState) => state.cart.cartItems)

  const ids = cartItems.map(item => item.productId)
  const { items: datas, isLoading, removeFromCartSwr } = useProductsByIds(ids)

  const productWithQty = useMemo(() => {
    return datas.map((prod: any) => {
      const matched = cartItems.find(item => item.productId === prod._id)
      return {
        ...prod,
        quantity: matched ? matched.quantity : 0,
      }
    })
  }, [datas, cartItems])

  const pathname = usePathname()
  const pathSegments = pathname.split('/').filter(Boolean)
  const isLocalePrefixed = routing.locales.includes(
    pathSegments[0] as (typeof routing.locales)[number],
  )
  const breadcrumbSegments = isLocalePrefixed
    ? pathSegments.slice(1)
    : pathSegments

  const orderTotal = productWithQty.reduce(
    (acc, item) =>
      acc + (item.discount ? item.discount : item.price) * item.quantity,
    0,
  )

  function calculateByTaxArray(items: any[]) {
    // 1) Gom nhóm ra object
    const groupsObj = items.reduce(
      (groups, { price, quantity, tax, discount }) => {
        const key = tax // e.g. 21, 10, 5
        const amount = (discount > 0 ? discount : price) * quantity

        if (!groups[key]) {
          groups[key] = { subtotal: 0, taxAmount: 0, total: 0 }
        }

        groups[key].subtotal += amount
        // Nếu bạn muốn taxAmount là phần thuế, thì:
        const taxAmt = amount / (1 + tax / 100)
        groups[key].taxAmount += taxAmt
        groups[key].total += amount + taxAmt

        return groups
      },
      {},
    )

    // 2) Chuyển object thành array
    return Object.entries(groupsObj).map(([tax, grp]: any) => ({
      taxRate: Number(tax),
      subtotal: grp.subtotal,
      taxAmount: grp.taxAmount,
      total: grp.total,
    }))
  }

  const result = calculateByTaxArray(productWithQty)

  const handleDelete = (id: any) => {
    if (window.confirm(t('deleteProductCart'))) {
      removeFromCartSwr(id)
      dispatch(removeFromCart(id))
    }
  }

  const handleDecreaseQuantity = (item: any) => {
    if (item.quantity === 1) {
      // Nếu số lượng là 1, khi giảm sẽ xóa sản phẩm khỏi giỏ hàng
      handleDelete(item._id)
    } else {
      // Giảm số lượng

      dispatch(addToCart({ productId: item._id, quantity: -1 }))
    }
  }

  const handleIncreaseQuantity = (item: any) => {
    // Tăng số lượng
    dispatch(addToCart({ productId: item._id, quantity: 1 }))
  }

  useEffect(() => {
    if (isLoading) {
      onLoading()
    } else {
      onLoaded()
    }
  }, [isLoading, onLoading, onLoaded])

  const proTransList = useMemo(() => {
    return productWithQty?.map(item => useGetContentTranslation(item, locale))
  }, [productWithQty, locale])

  return (
    <div className=''>
      <div className='bg-black h-[135px] w-full'></div>

      <div className='max-w-screen-2xl mx-auto px-4 sm:px-6'>
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

        <div className='container mx-auto mt-10 mb-10'>
          {cartItems.length === 0 ? (
            <div className='text-center py-10'>
              <div className='flex flex-col mb-6 items-center'>
                <h2 className='text-2xl mb-6 text-gray-600'>
                  {t('emptyCart')}
                </h2>
                <ShoppingBag size={400} className='text-gray-500' />
              </div>
              <Link
                href='/e-shop'
                className='bg-[#C74242] mt-10 text-white py-3 px-10 font-[400] text-[17px] rounded-full hover:bg-white 
                            transition duration-300 border border-transparent hover:border-[#C74242] hover:text-[#C74242]'
              >
                {t('buyNow')}
              </Link>
            </div>
          ) : (
            <div className='flex flex-col xl:flex-row gap-5'>
              {/* Cart Items Section */}
              <div className='xl:w-3/5 border border-gray-200 rounded-lg'>
                {productWithQty?.map((item: any, idx: any) => {
                  const proTrans = proTransList[idx]

                  const totalPrice =
                    (item.discount ? item.discount : item.price) * item.quantity
                  return (
                    <div
                      key={idx}
                      /* onClick={() => handleDetail(item?._id)} */
                      className='flex flex-col md:flex-row items-center gap-6 p-6 border-b border-gray-200 
                                last:border-b-0 cursor-pointer'
                    >
                      <Image
                        src={item.thumbnailUrls?.[0] || '/placeholder.png'}
                        alt={proTrans?.productName || ''}
                        width={100}
                        height={50}
                        className='rounded-md object-contain w-auto h-auto'
                        priority
                      />
                      <div className='flex-1'>
                        <h2 className='text-lg font-bold text-gray-800'>
                          {proTrans?.productName}
                        </h2>
                        <p className='text-lg text-gray-600'>
                          {formatCurrency(
                            item?.discount ? item?.discount : item?.price,
                            203,
                          )}
                        </p>
                      </div>
                      <div className='flex items-center gap-6'>
                        {/* Quantity Controls */}
                        <div className='flex items-center border border-gray-300 bg-white rounded-full h-10'>
                          <button
                            type='button'
                            aria-label='Giảm số lượng'
                            onClick={() => handleDecreaseQuantity(item)}
                            className='w-10 h-full flex items-center justify-center text-gray-600 hover:bg-[#C74242] 
                                      rounded-full focus:outline-none transition cursor-pointer hover:text-white'
                          >
                            <MinusIcon className='w-4 h-4' />
                          </button>

                          <span className='w-12 text-center text-gray-800 font-medium'>
                            {item.quantity}
                          </span>

                          <button
                            type='button'
                            aria-label='Tăng số lượng'
                            onClick={() => handleIncreaseQuantity(item)}
                            className='w-10 h-full flex items-center justify-center text-gray-600 hover:bg-[#C74242] 
                                      rounded-full focus:outline-none transition cursor-pointer hover:text-white'
                          >
                            <PlusIcon className='w-4 h-4' />
                          </button>
                        </div>

                        <span className='text-lg font-semibold'>
                          {formatCurrency(totalPrice, 203)}
                        </span>

                        <button
                          type='button'
                          onClick={() => handleDelete(item._id)}
                          className='ml-2 text-gray-400 cursor-pointer hover:text-red-500 p-1'
                          aria-label='Remove item'
                        >
                          <Trash2Icon className='w-5 h-5' />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Summary Section */}
              <div className='xl:w-2/5 p-6 border h-fit border-gray-200 rounded-lg'>
                <div className='max-w-full mx-auto space-y-2'>
                  {/* Header row */}
                  <div className='flex text-gray-700 font-semibold rounded-lg py-2'>
                    <div className='flex-1'>{t('taxRate')}</div>
                    <div className='flex-2 text-right'>DPH</div>
                    <div className='flex-2 text-right'>sDPH</div>
                  </div>

                  {/* Data rows */}
                  {result.map(({ taxRate, subtotal, taxAmount }) => (
                    <div key={taxRate} className='flex bg-white rounded-lg'>
                      <div className='flex-1'>{taxRate}%</div>
                      <div className='flex-2 text-right'>
                        {formatCurrency(taxAmount, 203)}
                      </div>
                      <div className='flex-2 text-right'>
                        {formatCurrency(subtotal, 203)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className='flex justify-between font-bold text-xl text-gray-800 mb-6 mt-6'>
                  <span>{t('total')} </span>
                  <span>{formatCurrency(orderTotal, 203)} </span>
                </div>

                <div className='flex lg:flex-row w-full space-x-5'>
                  <button
                    type='button'
                    aria-label='clear Cart'
                    className='border cursor-pointer lg:w-1/2 border-[#C74242] text-[#C74242] font-[400] text-[17px] 
                              w-full py-3 rounded-lg hover:bg-[#C74242] hover:text-white transition duration-300'
                    onClick={() => dispatch(clearCart())}
                  >
                    {t('clearCart')}
                  </button>
                  <Link
                    href='/cart/check-out'
                    className='
                              bg-[#C74242] cursor-pointer lg:w-1/2 w-full
                              text-white font-[400] text-[17px]
                              rounded-lg hover:bg-white hover:text-[#C74242]
                              transition duration-300 hover:border-[#C74242]
                              h-[50px] border border-[#C74242] 
                              flex items-center justify-center
                            '
                  >
                    {t('checkout')}
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Cart
