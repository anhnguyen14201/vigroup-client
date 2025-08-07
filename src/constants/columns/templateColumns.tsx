// src/constants/userColumns.ts
import { ColumnDef } from '@tanstack/react-table'
import { Edit2, Trash2 } from 'lucide-react'

import { Checkbox } from '@/components'
import { statusClasses } from '../status'
import { IProject } from '@/interface'
import { cn } from '@/lib/utils'
import Image from 'next/image'

export const getTemplateColumns = (
  onEdit: (user: IProject) => void,
  onDelete: (user: IProject) => void,
): ColumnDef<any>[] => [
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
    header: 'Mã thiết kế',
    cell: ({ row }) => (
      <span className='uppercase'>{row.getValue('code')}</span>
    ),
  },

  {
    accessorKey: 'thumbnailUrls',
    header: 'Ảnh sản phẩm',
    cell: ({ row }) => {
      const thumbnailUrls = row.original.thumbnailUrls
      const thumbnailUrl = Array.isArray(thumbnailUrls)
        ? thumbnailUrls[0]
        : thumbnailUrls
      return thumbnailUrl ? (
        <div className='relative w-full h-30 bg-gray-200 rounded p-2'>
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
    accessorKey: 'projectName',
    header: 'Tên thiết kế',
    cell: ({ row }) => {
      return (
        <span className='capitalize'>
          {row.original.translations[0].projectName}
        </span>
      )
    },
  },

  {
    accessorKey: 'showProject',
    header: 'Trạng thái',
    cell: ({ row }) => {
      const status = row.getValue<string>('showProject')
      const classes = statusClasses[status] || 'bg-gray-100 text-gray-800 '
      const label = status ? 'Hiển thị' : 'Ẩn'

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
      const user = row.original
      return (
        <div className='flex space-x-1'>
          <button
            onClick={() => onEdit(user)}
            className='cursor-pointer p-2 hover:bg-green-200 rounded-full transition-all'
          >
            <Edit2 className='w-4 h-4 text-green-600 hover:text-green-700 transition-all' />
          </button>
          <button
            className='cursor-pointer p-2 hover:bg-red-200 rounded-full transition-all'
            onClick={() => {
              // Hỏi xác nhận
              if (window.confirm(`Bạn có chắc muốn xóa ${user.projectName}?`)) {
                onDelete(user)
              }
            }}
          >
            <Trash2 className='w-4 h-4 text-red-600' />
          </button>
        </div>
      )
    },
    enableSorting: false,
    enableColumnFilter: false,
  },
]
