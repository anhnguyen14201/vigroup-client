'use client'
import { cn } from '@/lib/utils'
import { Edit2, Trash2 } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const InforCompanyListItem = ({ infor, onEdit, onDelete }: any) => {
  const statusClasses: Record<string, string> = {
    true: 'bg-green-100 text-green-800',
    false: 'bg-red-100 text-red-800',
  }

  return (
    <div className='relative flex items-center bg-white rounded-lg border border-gray-300 shadow-sm hover:shadow-lg transition-all duration-300 ease-in-out p-4'>
      {/* Hình ảnh của công ty */}

      {/* Thông tin chi tiết */}
      <div className='flex-1 ml-4 flex flex-col space-y-2'>
        <div className='flex items-center justify-between'>
          <h3 className='text-xl font-bold text-gray-800'>
            {infor.companyName}
          </h3>
          <span
            className={cn(
              'px-2 py-0.5 text-xs font-medium rounded',
              statusClasses[String(infor.isActive)],
            )}
          >
            {infor.isActive ? 'Active' : 'Disabled'}
          </span>
        </div>
        <p className='text-gray-600 text-sm'>
          <span className='font-medium'>Địa chỉ:</span> {infor.address}
        </p>
        <div className='flex flex-wrap gap-4 text-gray-600 text-sm'>
          <span>
            <span className='font-medium'>ICO:</span> {infor.ico}
          </span>
          <span>
            <span className='font-medium'>DIC:</span> {infor.dic}
          </span>
          <span>
            <span className='font-medium'>Tài khoản:</span> {infor.bankAccount}
          </span>
        </div>
        <div className='w-24 h-24 flex-shrink-0'>
          <Image
            src={infor.imageUrls[0]}
            alt={infor.companyName}
            width={96}
            height={96}
            className='object-contain rounded-lg w-full h-full'
            priority
          />
        </div>
      </div>
      {/* Nút hành động */}
      <div className='ml-4 flex flex-col justify-center gap-2'>
        <button
          onClick={e => {
            e.stopPropagation()
            onEdit(infor)
          }}
          className='cursor-pointer p-2 hover:bg-green-200 rounded-full transition-all'
        >
          <Edit2 className='w-4 h-4 text-green-600 hover:text-green-700 transition-all' />
        </button>

        <button
          onClick={e => {
            e.stopPropagation()
            onDelete(infor)
          }}
          className='cursor-pointer p-2 hover:bg-red-200 rounded-full transition-all'
        >
          <Trash2 className='w-4 h-4 text-red-600 hover:text-red-700 transition-all' />
        </button>
      </div>
    </div>
  )
}

export default InforCompanyListItem
