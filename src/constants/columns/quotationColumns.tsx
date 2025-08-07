import { ColumnDef } from '@tanstack/react-table'
import { Edit2, Trash2 } from 'lucide-react'

import { IQuotation } from '@/interface'
import { formatCurrency } from '@/utils'

/**
 * Trả về mảng ColumnDef cho bảng User, có truyền vào 2 handler onEdit và onDelete
 */
export const quotationColumns = (
  onEdit: (user: IQuotation) => void,
  onDelete: (user: IQuotation) => void,
): ColumnDef<IQuotation>[] => [
  {
    id: 'index',
    header: '#',
    cell: ({ row }) => <span>{row.index + 1}</span>,
    enableSorting: false,
    enableColumnFilter: false,
    size: 40,
  },

  {
    accessorKey: 'desc',
    header: 'Nội dung công việc',
    cell: ({ row }) => (
      <span className='capitalize'>{row.getValue('desc')}</span>
    ),
  },
  {
    accessorKey: 'quantity',
    header: 'Khối lượng (tạm tính)',
    cell: ({ row }) => (
      <span className='lowercase'>{row.getValue('quantity')}</span>
    ),
  },
  {
    accessorKey: 'cost',
    header: 'Đơn giá',
    cell: ({ row }) => (
      <span className='lowercase'>{row.getValue('cost')}</span>
    ),
  },
  {
    accessorKey: 'totalPrice',
    header: 'Thành tiền',
    cell: ({ row }) => {
      const total = row.getValue<number>('totalPrice')
      const currency = (row.original as IQuotation).currency as
        | 'CZK'
        | 'USD'
        | 'EUR'
      return (
        <span className='capitalize'>{formatCurrency(total, currency)}</span>
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
            className='cursor-pointer p-2 hover:bg-green-100 rounded-full transition-all'
          >
            <Edit2 className='w-4 h-4 text-green-500 hover:text-green-700 transition-all' />
          </button>
          <button
            className='cursor-pointer p-2 hover:bg-red-100 rounded-full transition-all'
            onClick={() => {
              // Hỏi xác nhận
              if (window.confirm(`Bạn có chắc muốn xóa nội dung này`)) {
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
