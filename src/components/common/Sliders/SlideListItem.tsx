'use client'

import React from 'react'
import Image from 'next/image'
import { Edit2, Trash2, Grip } from 'lucide-react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { cn } from '@/lib/utils'
import { ISlideListItem } from '@/interface'

const SlideListItem = ({ slide, index, onEdit, onDelete }: ISlideListItem) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: slide._id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'grab',
  }
  const statusClasses: Record<string, string> = {
    true: 'bg-green-100 text-green-800',
    false: 'bg-red-100 text-red-800',
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className='relative flex items-center bg-white rounded-lg border border-gray-200
                hover:shadow transition-all duration-200 ease-in-out p-2'
    >
      {/* Thumbnail */}
      <div className='w-24 h-14 overflow-hidden flex-shrink-0'>
        {slide.imageUrls[0] ? (
          <Image
            src={slide.imageUrls[0]}
            alt=''
            width={96}
            height={56}
            className='object-contain w-full h-full'
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
        <span className='font-medium'>Slide #{index + 1}</span>
        <span
          className={cn(
            'px-2 py-0.5 text-xs font-medium rounded',
            statusClasses[String(slide.activity)],
          )}
        >
          {slide.activity ? 'Active' : 'Disabled'}
        </span>
      </div>

      {/* Drag Handle */}
      <div
        className='p-2 cursor-grab hover:text-gray-700'
        {...attributes}
        {...listeners}
      >
        <Grip className='w-5 h-5 text-gray-500' />
      </div>

      {/* Actions */}

      <button
        type='button'
        aria-label='seeMore'
        onClick={e => {
          e.stopPropagation()
          onEdit(slide)
        }}
        className='cursor-pointer p-2 hover:bg-green-200 rounded-full transition-all'
      >
        <Edit2 className='w-4 h-4 text-green-600 hover:text-green-700 transition-all' />
      </button>
      <button
        type='button'
        aria-label='seeMore'
        onClick={e => {
          e.stopPropagation()
          onDelete(slide)
        }}
        className='cursor-pointer p-2 hover:bg-red-200 rounded-full transition-all'
      >
        <Trash2 className='w-4 h-4 text-red-600 hover:text-red-700 transition-all' />
      </button>
    </div>
  )
}

export default SlideListItem
