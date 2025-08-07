// src/constants/userColumns.ts

'use client'
import { ColumnDef } from '@tanstack/react-table'
import { Edit2, Info, Trash2 } from 'lucide-react'
import countryList from 'react-select-country-list'

import { Checkbox } from '@/components'
import { statusClasses } from '../status'
import { IUser } from '@/interface'
import { cn } from '@/lib/utils'
import { formatCurrency, formatPhone } from '@/utils'

/**
 * Trả về mảng ColumnDef cho bảng User, có truyền vào 2 handler onEdit và onDelete
 */

const countryOptions = countryList().getData()

export const getEmployeeColumns = (
  onEdit: (user: IUser) => void,
  onDelete: (user: IUser) => void,
  onInfor: (user: IUser) => void,
): ColumnDef<IUser>[] => [
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
    accessorKey: 'fullName',
    header: 'Họ & Tên',
    cell: ({ row }) => (
      <span className='capitalize'>{row.getValue('fullName')}</span>
    ),
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => {
      return <span className=''>{row.original.email}</span>
    },
  },

  {
    accessorKey: 'phone',
    header: 'Số điện thoại',
    cell: ({ row }) => {
      return <span className=''>{formatPhone(row.getValue('phone'))}</span>
    },
  },

  {
    accessorKey: 'address',
    header: 'Địa chỉ',
    cell: ({ row }) => {
      return (
        <span className='capitalize'>{`${row.original.street} ${row.original.postalCode} ${row.original.province}`}</span>
      )
    },
  },

  {
    accessorKey: 'position',
    header: 'Chức vụ',
    cell: ({ row }) => (
      <span className='capitalize'>{row.original.position}</span>
    ),
  },

  {
    accessorKey: 'projects',
    header: 'Dự án',
    cell: ({ row }) => (
      <span className='capitalize'>{row.original.projects.length}</span>
    ),
  },
  {
    accessorKey: 'hourlyRate',
    header: 'Lương/Giờ',
    cell: ({ row }) => (
      <span className='capitalize'>
        {row.original.hourlyRate &&
          formatCurrency(row.original.hourlyRate, 203)}
      </span>
    ),
  },

  {
    accessorKey: 'totalSalary',
    header: 'Lương',
    cell: ({ row }) => (
      <span className='capitalize'>
        {row.original.totalSalary &&
          formatCurrency(row.original.totalSalary, 203)}
      </span>
    ),
  },
  /*   {
    accessorKey: 'address',
    header: 'Công',
    cell: ({ row }) => (
      <span className='capitalize'>{row.getValue('address')}</span>
    ),
  },
  {
    accessorKey: 'address',
    header: 'Lương',
    cell: ({ row }) => (
      <span className='capitalize'>{row.getValue('address')}</span>
    ),
  }, */

  {
    accessorKey: 'isBlock',
    header: 'Trạng thái',
    cell: ({ row }) => {
      const blocked = row.getValue<boolean>('isBlock')
      return (
        <span
          className={cn(
            'px-2 py-0.5 text-xs font-medium rounded',
            statusClasses[String(!blocked)],
          )}
        >
          {!blocked ? 'Active' : 'Block'}
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
            onClick={() => onEdit(user)}
            className='cursor-pointer p-2 hover:bg-green-100 rounded-full transition-all'
          >
            <Edit2 className='w-4 h-4 text-green-500 hover:text-green-700 transition-all' />
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
