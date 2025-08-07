'use client'

import React from 'react'
import Image from 'next/image'
import { Edit2, Trash2 } from 'lucide-react'

import { cn } from '@/lib/utils'
import { ILogoListItem } from '@/interface'

const LogoListItem = ({ logo, onEdit, onDelete }: ILogoListItem) => {
  const statusClasses: Record<string, string> = {
    true: 'bg-green-100 text-green-800',
    false: 'bg-red-100 text-red-800',
  }

  return (
    <div
      className='relative flex items-center rounded-lg border border-gray-200
                transition-all duration-200 ease-in-out p-2'
    >
      {/* Thumbnail */}
      <div className='w-24 h-14 rounded-lg overflow-hidden  flex-shrink-0'>
        {logo.imageUrls[0] ? (
          <Image
            src={logo.imageUrls[0]}
            alt=''
            width={96}
            height={56}
            className='object-contain w-full h-full bg-gray-200 p-2'
            style={{ width: 96, height: 56 }}
            priority
          />
        ) : (
          <div className='w-full h-full bg-gray-100 flex items-center justify-center text-gray-500 text-sm'>
            No Image
          </div>
        )}
      </div>

      {/* Info */}
      <div className='flex-1 px-3 py-2 flex justify-between items-center'>
        <span className='font-medium'>{logo.logoTitle}</span>

        <span
          className={cn(
            'px-2 py-0.5 text-xs font-medium rounded',
            statusClasses[String(logo.activity)],
          )}
        >
          {logo.activity ? 'Active' : 'Disabled'}
        </span>
      </div>

      {/* Actions */}

      <button
        onClick={e => {
          e.stopPropagation()
          onEdit(logo)
        }}
        className='cursor-pointer p-2 hover:bg-green-200 rounded-full transition-all'
      >
        <Edit2 className='w-4 h-4 text-green-600 hover:text-green-700 transition-all' />
      </button>

      <button
        onClick={e => {
          e.stopPropagation()
          onDelete(logo)
        }}
        className='cursor-pointer p-2 hover:bg-red-200 rounded-full transition-all'
      >
        <Trash2 className='w-4 h-4 text-red-600 hover:text-red-700 transition-all' />
      </button>
    </div>
  )
}

export default LogoListItem
