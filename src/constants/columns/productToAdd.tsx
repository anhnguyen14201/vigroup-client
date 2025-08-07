'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import { formatCurrency, getTranslationField } from '@/utils'
import Image from 'next/image'

interface GetProjectTypeColumnsProps {
  currentLang: string
  onAdd: (prod: any) => void
}

export function getProductToAddColumns({
  currentLang,
  onAdd,
}: GetProjectTypeColumnsProps): ColumnDef<any>[] {
  return [
    {
      id: 'index',
      header: '#',
      cell: ({ row }) => <span>{row.index + 1}</span>,
      enableSorting: false,
      enableColumnFilter: false,
      size: 40,
    },

    {
      accessorKey: 'code',
      header: 'Mã sản phẩm',
      cell: ({ row }) => (
        <span className='uppercase'>{row.getValue('code')}</span>
      ),
    },

    {
      accessorKey: 'thumbnail',
      header: 'Ảnh sản phẩm',
      cell: ({ row }) => {
        const thumbnailUrl = row.original.thumbnailUrls
        return thumbnailUrl ? (
          <div className='relative w-full h-16 bg-gray-200 rounded p-2'>
            <Image
              src={thumbnailUrl[0]}
              alt='Ảnh sản phẩm'
              fill
              className='object-contain rounded'
              property=''
              priority
            />
          </div>
        ) : (
          <span className='uppercase text-gray-500'>No Image</span>
        )
      },
    },

    {
      id: 'productName',
      header: `Tên sản phẩm (${currentLang.toUpperCase()})`,
      cell: ({ row }) => {
        const pt = row.original
        const displayName = getTranslationField(pt, currentLang, 'productName')
        return <div className='truncate max-w-[200px]'>{displayName}</div>
      },
      accessorFn: row => getTranslationField(row, currentLang, 'productName'),
    },

    {
      accessorKey: 'price',
      header: 'Giá bán',
      cell: ({ row }) => {
        const total = row.getValue<number>('price')
        const currency = 'CZK'

        return (
          <span className='capitalize'>{formatCurrency(total, currency)}</span>
        )
      },
    },

    {
      accessorKey: 'discount',
      header: 'Giá khuyến mãi',
      cell: ({ row }) => {
        const total = row.getValue<number>('discount')
        const currency = 'CZK'

        return (
          <span className='capitalize'>{formatCurrency(total, currency)}</span>
        )
      },
    },

    {
      accessorKey: 'quantity',
      header: 'Số lượng',
      cell: ({ row }) => (
        <span className='uppercase'>{row.getValue('quantity')}</span>
      ),
    },

    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const user = row.original
        return (
          <div className='flex space-x-1'>
            <button
              onClick={() => onAdd(user)}
              className='cursor-pointer p-2 hover:bg-blue-200 rounded-full transition-all'
            >
              <Plus className='w-4 h-4 text-blue-600 hover:text-blue-700 transition-all' />
            </button>
          </div>
        )
      },
      enableSorting: false,
      enableColumnFilter: false,
    },
  ]
}
