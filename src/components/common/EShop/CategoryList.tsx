// 'use client'

import React, { useMemo, useCallback } from 'react'
import clsx from 'clsx'
import { useLocale, useTranslations } from 'next-intl'

import type { Locale } from '@/interface'
import { useGetContentTranslation } from '@/hooks'

interface CategoryListProps {
  data: { _id: string; name?: string; productCount: number }[]
  onSelect?: (id: string) => void
  selectedId?: string
}

const CategoryList: React.FC<CategoryListProps> = React.memo(
  ({ data, onSelect, selectedId }) => {
    const locale = useLocale() as Locale
    const t = useTranslations('shop')

    // Pre-translate category names
    const categories = useMemo(
      () =>
        data.map(item => {
          const trans = useGetContentTranslation(item, locale)
          return {
            id: item._id,
            label: trans?.name || item.name || '',
            count: item.productCount,
          }
        }),
      [data, locale],
    )

    const handleClick = useCallback(
      (id: string) => {
        if (onSelect) onSelect(selectedId === id ? '' : id)
      },
      [onSelect, selectedId],
    )

    return (
      <aside className='bg-white p-5 rounded-3xl border h-fit mt-5 lg:top-28 order-1 lg:order-2'>
        <h2 className='text-2xl font-semibold mb-6 text-gray-800 border-b pb-2'>
          {t('categories')}
        </h2>
        <ul className='space-y-4 pl-5'>
          <li
            className={clsx(
              'cursor-pointer p-1 capitalize',
              !selectedId && 'font-bold text-red-600',
            )}
            onClick={() => handleClick('')}
          >
            {t('allProducts')}
          </li>
          {categories.map(cat => (
            <li
              key={cat.id}
              className={clsx(
                'cursor-pointer p-1 capitalize transition-colors',
                selectedId === cat.id
                  ? 'font-bold text-red-600'
                  : 'text-gray-700 hover:text-red-600',
              )}
              onClick={() => handleClick(cat.id)}
            >
              {`${cat.label} (${cat.count})`}
            </li>
          ))}
        </ul>
      </aside>
    )
  },
)

CategoryList.displayName = 'CategoryList'
export default CategoryList
