// src/constants/userColumns.ts
'use client'
import { ColumnDef } from '@tanstack/react-table'
import { Edit2, Trash2 } from 'lucide-react'
import countryList from 'react-select-country-list'
import PhoneInput from 'react-phone-input-2'

import { Checkbox } from '@/components'
import { statusClasses } from '../status'
import { IUser } from '@/interface'
import { cn } from '@/lib/utils'
import { formatPhone } from '@/utils'

/**
 * Trả về mảng ColumnDef cho bảng User, có truyền vào 2 handler onEdit và onDelete
 */

const countryOptions = countryList().getData()

export const getUserColumns = (
  onEdit: (user: IUser) => void,
  onDelete: (user: IUser) => void,
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
    cell: ({ row }) => (
      <span className='lowercase'>{row.getValue('email')}</span>
    ),
  },
  {
    accessorKey: 'phone',
    header: 'Số điện thoại',
    cell: ({ row }) => (
      <span className='lowercase'>{formatPhone(row.getValue('phone'))}</span>
    ),
  },
  {
    accessorKey: 'address',
    header: 'Địa chỉ',
    cell: ({ row }) => {
      return (
        <span className='capitalize'>{`${row.original.street} - ${row.original.province}`}</span>
      )
    },
  },

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
          {/*          <button
            onClick={() => onInfor(user)}
            className='cursor-pointer p-2 hover:bg-blue-100 rounded-full transition-all'
          >
            <Info
              className='w-5 h-5 text-blue-500 hover:text-blue-700 transition-all'
              strokeWidth={2}
            />
          </button> */}
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
