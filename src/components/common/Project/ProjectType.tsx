'use client'

import React from 'react'
import { useGetContentTranslation } from '@/hooks'
import { Locale } from '@/interface'
import { useLocale, useTranslations } from 'next-intl'
import { motion } from 'framer-motion'

interface CategoryListProps {
  projectTypes: any[]
  onSelect?: (id: string) => void
  selectedId?: string
}

export default function ProjectType({
  projectTypes,
  onSelect,
  selectedId,
}: CategoryListProps) {
  const locale = useLocale() as Locale
  const t = useTranslations('shop')

  return (
    <motion.nav
      className='w-full bg-white py-4'
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    >
      <ul className='flex flex-wrap justify-center gap-6 px-4'>
        {/* All Products */}
        <li
          onClick={() => onSelect?.('')}
          className={`relative group font-oswald text-2xl cursor-pointer font-light transition-colors
            ${
              !selectedId
                ? 'text-[#C74242]'
                : 'text-gray-700 hover:text-[#C74242]'
            }
            `}
        >
          {t('allProducts')}
          <span
            className={`absolute -bottom-0.5 left-0 h-0.5 bg-[#C74242] transition-all duration-500 ease-in-out
              ${!selectedId ? 'w-full' : 'w-0 group-hover:w-full'}
              `}
          />
        </li>

        {/* Each category */}
        {projectTypes.map(category => {
          const dataC = useGetContentTranslation(category, locale)
          const name = dataC?.name || category.code
          const isActive = selectedId === category._id

          return (
            <li
              key={category._id}
              onClick={() => onSelect?.(isActive ? '' : category._id)}
              className={`relative group font-oswald cursor-pointer text-2xl font-light transition-colors
                ${
                  isActive
                    ? 'text-[#C74242]'
                    : 'text-gray-700 hover:text-[#C74242]'
                }
                `}
            >
              {name}
              <span
                className={`absolute -bottom-0.5 left-0 h-0.5 bg-[#C74242] transition-all duration-500 ease-in-out
                  ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}
                  `}
              />
            </li>
          )
        })}
      </ul>
    </motion.nav>
  )
}
