// 'use client'

import React, { useMemo, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import clsx from 'clsx'

interface BrandListProps {
  data: { _id: string; name: string; brandCount: number }[]
  onSelect?: (id: string) => void
  selectedId?: string
}

const BrandList: React.FC<BrandListProps> = React.memo(
  ({ data, onSelect, selectedId }) => {
    const t = useTranslations('shop')

    // Memoize processed list to avoid re-render on parent updates
    const brands = useMemo(
      () =>
        data.map(item => ({
          id: item._id,
          label: item.name,
          count: item.brandCount,
        })),
      [data],
    )

    const handleClick = useCallback(
      (id: string) => {
        if (!onSelect) return
        onSelect(selectedId === id ? '' : id)
      },
      [onSelect, selectedId],
    )

    return (
      <aside className='bg-white p-5 rounded-3xl border lg:col-span-1 h-fit top-28 mt-5 order-1 lg:order-2'>
        <h2 className='text-2xl font-semibold mb-6 text-gray-800 border-b pb-2'>
          {t('brands')}
        </h2>
        <ul className='space-y-4 pl-5'>
          {brands.map(brand => (
            <li
              key={brand.id}
              className={clsx(
                'cursor-pointer p-1 capitalize transition-colors',
                selectedId === brand.id
                  ? 'font-bold text-red-600'
                  : 'text-gray-700 hover:text-red-600',
              )}
              onClick={() => handleClick(brand.id)}
            >
              {`${brand.label} (${brand.count})`}
            </li>
          ))}
        </ul>
      </aside>
    )
  },
)

BrandList.displayName = 'BrandList'
export default BrandList
