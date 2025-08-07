// src/constants/userColumns.ts
import { ColumnDef } from '@tanstack/react-table'
import { Edit2, Info, Trash2 } from 'lucide-react'

import { Checkbox } from '@/components'
import {
  paymentStatusClasses,
  paymentStatusLabels,
  statusClasses,
  statusProjectClasses,
  statusProjectLabels,
} from '../status'
import { IProject } from '@/interface'
import { cn } from '@/lib/utils'
import { format, parseISO } from 'date-fns'
import { cs } from 'date-fns/locale' // Import locale Czech

export const getProjectColumns = (
  onEdit: (user: IProject) => void,
  onDelete: (user: IProject) => void,
  onInfor: (user: IProject) => void,
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
    header: 'Mã dự án',
    cell: ({ row }) => (
      <span className='uppercase'>{row.getValue('code')}</span>
    ),
  },
  {
    accessorKey: 'projectName',
    header: 'Tên dự án',
    cell: ({ row }) => {
      return (
        <span className='capitalize'>
          {row.original.translations[0].projectName}
        </span>
      )
    },
  },
  {
    accessorKey: 'location',
    header: 'Địa chỉ',
    cell: ({ row }) => (
      <span className='capitalize'>{row.getValue('location')}</span>
    ),
  },
  {
    accessorKey: 'startDate',
    header: 'Ngày bắt đầu',
    cell: ({ row }) => (
      <span className='capitalize'>
        {row.original.startDate
          ? format(
              typeof row.original.startDate === 'string'
                ? parseISO(row.original.startDate)
                : row.original.startDate,
              'dd. MM. yyyy',
              { locale: cs },
            )
          : 'N/A'}
      </span>
    ),
  },
  {
    accessorKey: 'endDate',
    header: 'Ngày kết thúc',
    cell: ({ row }) => (
      <span className='capitalize'>
        {row.original.endDate
          ? format(
              typeof row.original.endDate === 'string'
                ? parseISO(row.original.endDate)
                : row.original.endDate,
              'dd. MM. yyyy',
              { locale: cs },
            )
          : 'N/A'}
      </span>
    ),
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
    accessorKey: 'status',
    header: 'Tiến độ',
    cell: ({ row }) => {
      const status = row.getValue<string>('status')
      const classes =
        statusProjectClasses[status] || 'bg-gray-100 text-gray-800 '
      const label = statusProjectLabels[status] || status

      return (
        <span className={cn('px-2 py-0.5 text-xs rounded', classes)}>
          {label}
        </span>
      )
    },
  },
  {
    accessorKey: 'paymentStatus',
    header: 'Thanh toán',
    cell: ({ row }) => {
      const status = row.getValue<string>('paymentStatus')
      const classes =
        paymentStatusClasses[status] || 'bg-gray-100 text-gray-800 '
      const label = paymentStatusLabels[status] || status

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
            className='cursor-pointer p-2 hover:bg-blue-200 rounded-full transition-all'
          >
            <Info
              className='w-4 h-4 text-blue-500 hover:text-blue-700 transition-all'
              strokeWidth={2}
            />
          </button>
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
