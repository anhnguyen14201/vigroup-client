// src/constants/userColumns.ts
'use client'

import { ColumnDef } from '@tanstack/react-table'
import { UserRoundPlus } from 'lucide-react'

import { statusClasses } from '../status'
import { IUser } from '@/interface'
import { cn } from '@/lib/utils'
import countryList from 'react-select-country-list'
import PhoneInput from 'react-phone-input-2'

/**
 * Trả về mảng ColumnDef cho bảng User, có truyền vào 2 handler onEdit và onDelete
 */

const countryOptions = countryList().getData()

export const getCustomerToAddProjectColumns = (
  onAdd: (user: IUser) => void,
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
    cell: ({ row }) => {
      const raw = row.getValue('phone') as string
      const countryCode =
        (row.getValue('country') as string)?.toLowerCase() || 'us'

      return (
        <PhoneInput
          country={countryCode}
          value={raw}
          disableSearchIcon
          disableDropdown
          inputStyle={{
            border: 'none',
            boxShadow: 'none',
            padding: 0,
            background: 'transparent',
            width: 'auto', // cho input chỉ rộng vừa text
          }}
          containerStyle={{
            border: 'none',
            padding: 0,
            background: 'transparent',
            display: 'inline-block', // để fit với nội dung
            width: 'auto', // bỏ mặc định full width
          }}
          enableAreaCodes={false}
          inputProps={{ readOnly: true }}
          containerClass='no-flag-input'
        />
      )
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
    accessorKey: 'country',
    header: 'Quốc gia',
    cell: ({ row }) => {
      const code = row.getValue('country') as string
      const option = countryOptions.find(opt => opt.value === code)
      // nếu không tìm thấy thì fallback về code
      const name = option?.label || code
      return <span className='capitalize'>{name}</span>
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
          <button
            onClick={() => onAdd(user)}
            className='cursor-pointer p-2 hover:bg-blue-200 rounded-full transition-all'
          >
            <UserRoundPlus className='w-4 h-4 text-blue-600 hover:text-blue-700 transition-all' />
          </button>
        </div>
      )
    },
    enableSorting: false,
    enableColumnFilter: false,
  },
]
