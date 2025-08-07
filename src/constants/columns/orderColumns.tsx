// src/constants/userColumns.ts

'use client'
import { ColumnDef } from '@tanstack/react-table'
import { Info, Trash2 } from 'lucide-react'

import { Checkbox } from '@/components'
import {
  statusClasses,
  statusProjectClasses,
  statusProjectLabels,
} from '../status'
import { formatCurrency } from '@/utils'
import { cn } from '@/lib'

export const getOrderColumns = (
  onDelete: (user: any) => void,
  onInfor: (user: any) => void,
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
    accessorKey: '_id',
    header: 'Mã  đơn hàng',
    cell: ({ row }) => (
      <span className='capitalize'>{row.getValue('_id')}</span>
    ),
  },
  {
    accessorKey: 'user',
    header: 'Người đặt',
    cell: ({ row }) => {
      const user =
        row.original.customer?.fullName ||
        row.original.personalInfo?.fullName ||
        '—'
      return <span className=''>{user}</span>
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Ngày đặt',
    cell: ({ row }) => {
      const raw = row.getValue('createdAt') as string
      const date = new Date(raw)

      const formattedDate = new Intl.DateTimeFormat('cs-CZ', {
        timeZone: 'Europe/Prague',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(date)

      return <span>{formattedDate}</span>
    },
  },

  {
    accessorKey: 'updatedAt',
    header: 'Ngày gửi',
    cell: ({ row }) => {
      const raw = row.getValue('updatedAt') as string
      const date = new Date(raw)

      const formattedDate = new Intl.DateTimeFormat('cs-CZ', {
        timeZone: 'Europe/Prague',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(date)

      return <span>{formattedDate}</span>
    },
  },

  {
    accessorKey: 'totalQuantity',
    header: 'Số sản phẩm',
    cell: ({ row }) => {
      const cartItems = row.original.cartItems
      const totalQuantity = cartItems.reduce(
        (sum: any, item: any) => sum + item.quantity,
        0,
      )

      return <span className='capitalize'>{totalQuantity}</span>
    },
  },

  {
    accessorKey: 'total',
    header: 'Tổng tiền',
    cell: ({ row }) => {
      const total = row.original.total + row.original.shippingCost
      return <span className='capitalize'>{formatCurrency(total, 203)}</span>
    },
  },

  {
    accessorKey: 'status',
    header: 'Trạng thái',
    cell: ({ row }) => {
      const status = row.getValue<string>('status')
      const classes =
        statusProjectClasses[status.toLowerCase()] ||
        'bg-gray-100 text-gray-800 '
      const label = statusProjectLabels[status.toLowerCase()] || status

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
            onClick={() => onInfor(user)}
            className='cursor-pointer p-2 hover:bg-blue-100 rounded-full transition-all'
          >
            <Info
              className='w-4 h-4 text-blue-500 hover:text-blue-700 transition-all'
              strokeWidth={2}
            />
          </button>

          <button
            className='cursor-pointer p-2 hover:bg-red-100 rounded-full transition-all'
            onClick={() => {
              // Hỏi xác nhận
              if (window.confirm(`Bạn có chắc muốn xóa ${user.fullName}?`)) {
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
