// src/constants/userColumns.ts
import { ColumnDef } from '@tanstack/react-table'
import { Edit2, Eye, Trash2 } from 'lucide-react'

import { Checkbox } from '@/components'
import { invoiceStatusLabels, warrantyStatusClasses } from '../status'

import { cn } from '@/lib/utils'
import { formatCurrency } from '@/utils'
import { GetInvoiceColumnsProps, IInvoice } from '@/interface'

/**
 * Trả về mảng ColumnDef cho bảng User, có truyền vào 2 handler onEdit và onDelete
 */
export const getInvoiceColumns = ({
  onEdit,
  onDelete,
  onShow,
}: GetInvoiceColumnsProps): ColumnDef<IInvoice>[] => [
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
    header: 'Mã hóa đơn',
    cell: ({ row }) => (
      <span className='capitalize'>{row.getValue('code')}</span>
    ),
  },
  {
    accessorKey: 'customer',
    header: 'Tên khách hàng',
    cell: ({ row }) => {
      const displayName = row?.original?.customer?.companyName
        ? row?.original?.customer?.companyName
        : row?.original?.customer?.fullName
      return <span className='capitalize'>{displayName}</span>
    },
  },
  {
    accessorKey: 'date',
    header: 'Ngày tạo',
    cell: ({ row }) => {
      const dateValue = new Date(row.getValue('date'))
      return (
        <span className='lowercase '>
          {dateValue.toLocaleDateString('cs-CZ', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </span>
      )
    },
  },
  {
    accessorKey: 'totalPrice',
    header: 'Tổng tiền',
    cell: ({ row }) => {
      return (
        <span className='lowercase'>
          {formatCurrency(row.getValue('totalPrice'), 203)}
        </span>
      )
    },
  },

  {
    accessorKey: 'warrantyStart',
    header: 'BĐ BH',
    cell: ({ row }) => {
      const display = row?.original?.warranty?.startDate
      return (
        <span className='capitalize'>
          {new Date(display).toLocaleDateString('cs-CZ')}
        </span>
      )
    },
  },
  {
    accessorKey: 'warrantyEnd',
    header: 'KT BH',
    cell: ({ row }) => {
      const display = row?.original?.warranty?.endDate
      return (
        <span className='capitalize'>
          {new Date(display).toLocaleDateString('cs-CZ')}
        </span>
      )
    },
  },
  {
    accessorKey: 'warrantyStatus',
    header: 'TT BH',
    cell: ({ row }) => {
      const display = row?.original?.warranty?.status
      const classes =
        warrantyStatusClasses[display] || 'bg-gray-100 text-gray-800 '
      const label =
        display === 'active'
          ? 'Còn hiệu lực'
          : display === 'expired'
          ? 'Đã hết hạn'
          : ''
      return (
        <span
          className={cn('px-2 py-0.5 text-xs rounded text-center', classes)}
        >
          {label}
        </span>
      )
    },
  },

  {
    accessorKey: 'status',
    header: 'Trạng thái',
    cell: ({ row }) => {
      const status = row.getValue<string>('status')
      const classes =
        invoiceStatusLabels[status] || 'bg-gray-100 text-gray-800 '
      const label =
        status === 'draft'
          ? 'Bản nháp'
          : status === 'quote'
          ? 'Báo giá'
          : status === 'invoice'
          ? 'Hóa đơn'
          : ''

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
      const inv = row.original
      const isLocked = inv.status === 'quote' || inv.status === 'invoice'
      return (
        <div className='flex space-x-1'>
          <button
            onClick={() => onShow(inv)}
            className='cursor-pointer p-2 hover:bg-blue-100 rounded-full transition-all'
          >
            <Eye
              className='w-4 h-4 text-blue-500 hover:text-blue-700 transition-all'
              strokeWidth={2}
            />
          </button>

          {/* chỉ hiển thị nút Edit nếu không phải quote/invoice */}
          {!isLocked && (
            <button
              onClick={() => onEdit(inv)}
              className='cursor-pointer p-2 hover:bg-green-100 rounded-full transition-all'
            >
              <Edit2 className='w-4 h-4 text-green-500 hover:text-green-700 transition-all' />
            </button>
          )}

          <button
            className='cursor-pointer p-2 hover:bg-red-100 rounded-full transition-all'
            onClick={() => {
              if (
                window.confirm(
                  `Bạn có chắc muốn xóa hóa đơn có mã: ${inv.code}?`,
                )
              ) {
                onDelete(inv)
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
