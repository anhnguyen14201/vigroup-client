'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Edit2, Trash2 } from 'lucide-react'
import { Checkbox } from '@/components'
import { formatCurrency, getTranslationField } from '@/utils'
import { statusClasses } from '@/constants/status'
import { cn } from '@/lib/utils'
import { GetProductColumnsProps, IProduct } from '@/interface'
import Image from 'next/image'

export function getProductColumns({
  currentLang,
  onEdit,
  onDelete,
}: GetProductColumnsProps): ColumnDef<IProduct>[] {
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
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={v => table.toggleAllPageRowsSelected(!!v)}
          aria-label='Select all'
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={v => row.toggleSelected(!!v)}
          aria-label='Select row'
        />
      ),
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
        const thumbnailUrls = row.original.thumbnailUrls
        const thumbnailUrl = Array.isArray(thumbnailUrls)
          ? thumbnailUrls[0]
          : thumbnailUrls
        return thumbnailUrl ? (
          <div className='relative w-full h-16 bg-gray-200 rounded p-2'>
            <Image
              src={thumbnailUrl}
              alt='Ảnh sản phẩm'
              fill
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
              className='object-contain'
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
      accessorKey: 'cost',
      header: 'Giá nhập',
      cell: ({ row }) => {
        const total = row.getValue<number>('cost')
        const currency = 'CZK'

        return (
          <span className='capitalize'>{formatCurrency(total, currency)}</span>
        )
      },
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
      accessorKey: 'tax',
      header: 'Thuế %',
      cell: ({ row }) => (
        <span className='uppercase'>{row.getValue('tax')}</span>
      ),
    },

    {
      accessorKey: 'quantity',
      header: 'Số lượng',
      cell: ({ row }) => (
        <span className='uppercase'>{row.getValue('quantity')}</span>
      ),
    },
    {
      accessorKey: 'sold',
      header: 'Đã bán',
      cell: ({ row }) => (
        <span className='uppercase'>{row.getValue('sold')}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Trạng thái',
      cell: ({ row }) => {
        const status = row.original.quantity > 0 ? 'true' : 'false'
        const classes = statusClasses[status] || 'bg-gray-100 text-gray-800 '
        const label = status === 'true' ? 'Còn hàng' : 'Hết hàng'

        return (
          <span className={cn('px-2 py-0.5 text-xs rounded', classes)}>
            {label}
          </span>
        )
      },
    },

    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const pt = row.original
        const displayName = getTranslationField(pt, currentLang, 'productName')
        return (
          <div className='flex space-x-1'>
            <button
              onClick={() => onEdit(pt)}
              className='cursor-pointer p-2 hover:bg-green-200 rounded-full transition-all'
            >
              <Edit2
                className='w-4 h-4 text-green-600 hover:text-green-700 transition-all'
                strokeWidth={2}
              />
            </button>
            <button
              className='cursor-pointer p-2 hover:bg-red-200 rounded-full transition-all'
              onClick={() => {
                if (window.confirm(`Bạn có chắc muốn xóa "${displayName}"?`)) {
                  onDelete(pt)
                }
              }}
            >
              <Trash2 className='w-4 h-4 text-red-600' strokeWidth={2} />
            </button>
          </div>
        )
      },
      enableSorting: false,
      enableColumnFilter: false,
    },
  ]
}
