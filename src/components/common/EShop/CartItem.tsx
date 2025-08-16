import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import React, { useCallback } from 'react'

import { IProduct } from '@/interface'
import {
  calculateDiscountPercentage,
  calculatePriceExcludingTax,
  formatCurrency,
} from '@/utils'
import Link from 'next/link'
import { useDispatch } from 'react-redux'
import { addToCart } from '@/redux'

interface CartItemProps {
  product: IProduct
}

const CartItem: React.FC<CartItemProps> = React.memo(({ product }) => {
  const t = useTranslations('shop')
  const data = product.stockStatus
  const dispatch = useDispatch()

  const statusMap: Record<
    'In Stock' | 'Low Stock' | 'Out of Stock',
    { label: string; color: string }
  > = {
    'In Stock': { label: t('inStock'), color: 'text-green-600' },
    'Low Stock': { label: t('lowStock'), color: 'text-yellow-600' },
    'Out of Stock': { label: t('outOfStock'), color: 'text-red-600' },
  }

  const { label, color } = (
    statusMap as Record<string, { label: string; color: string }>
  )[data] ?? {
    label: data,
    color: 'text-gray-500',
  }

  console.log(label)

  const handleAddToCart = useCallback(() => {
    dispatch(addToCart({ productId: product._id, quantity: 1 }))
  }, [dispatch, product._id])

  return (
    <div
      className='relative bg-white p-5 rounded-2xl cursor-pointer border-[1px] hover:border-[#C74242] 
                transition duration-300 transform flex flex-col justify-between h-full'
      style={{ minHeight: '400px' }} // Đặt chiều cao tối thiểu cho mỗi thẻ
    >
      {/* Thẻ sản phẩm mới, nổi bật và giảm giá */}
      <div className='absolute top-0 left-0 flex flex-col items-start'>
        {product?.isNewArrival && (
          <div className='bg-green-200 text-green-600 text-sm px-5 py-0.5 rounded-br-2xl mb-1 rounded-tl-2xl'>
            {t('isNewArrival')}
          </div>
        )}
        {product?.isFeatured && (
          <div
            className={`bg-blue-200 text-blue-600 text-sm px-5 py-0.5 rounded-br-2xl ${
              product?.isNewArrival ? '' : 'rounded-tl-2xl'
            }`}
          >
            {t('isFeatured')}
          </div>
        )}
      </div>
      {product?.discount > 0 && (
        <div className='absolute top-0 right-0 bg-red-200 text-red-600 text-sm px-5 py-0.5 rounded-bl-2xl rounded-tr-2xl'>
          - {calculateDiscountPercentage(product?.price, product?.discount)} %
        </div>
      )}
      <Link href={`/e-shop/${product.slug}` || '/'} passHref>
        <div className='flex flex-col items-center p-5'>
          <div className='h-48 flex items-center relative'>
            <Image
              src={product?.thumbnailUrls?.[0] || '/placeholder.png'}
              alt={product?.productName || ''}
              width={200}
              height={100}
              priority={false}
              className='object-cover rounded-lg'
            />
          </div>
          <h2 className='font-semibold text-gray-800 mb-2'>
            {product?.productName}
          </h2>

          <p className='text-sm text-gray-600 font-semibold line-through'>
            {(product?.discount ?? 0) > 0 &&
              formatCurrency(product?.price ?? 0, 203)}
          </p>
          <p className='text-lg font-bold text-red-600'>
            {(product?.price ?? 0) > 0
              ? (product?.discount ?? 0) > 0
                ? formatCurrency(product?.discount ?? 0, 203)
                : formatCurrency(product?.price ?? 0, 203)
              : ``}
          </p>
          <p className='text-xs font-semibold text-gray-600'>
            {product?.discount > 0
              ? formatCurrency(
                  calculatePriceExcludingTax(product?.discount, product?.tax),
                  203,
                )
              : formatCurrency(
                  calculatePriceExcludingTax(product?.price, product?.tax),
                  203,
                )}{' '}
            {t('tax')}
          </p>

          <p className={`font-semibold text-sm ${color}`}>
            <span>{label}</span>
          </p>
        </div>
      </Link>

      <button
        type='button'
        aria-label='add To Cart'
        onClick={() => handleAddToCart()}
        className={clsx(
          (product?.quantity <= 0 || product?.price <= 0) &&
            'cursor-not-allowed opacity-50 text-[17px]',
          'mt-4 cursor-pointer text-white py-2 px-1 rounded-lg hover:text-[#C74242] ' +
            ' font-[400] hover:bg-white border hover:border-[#C74242] bg-[#C74242] duration-300 transition',
        )}
        disabled={product?.quantity <= 0 || product?.price <= 0} // Vô hiệu hóa nút khi không hợp lệ
      >
        {t('addToCart')}
      </button>
    </div>
  )
})
CartItem.displayName = 'CartItem'

export default CartItem
