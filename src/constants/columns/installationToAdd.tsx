import { ColumnDef } from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import { formatCurrency } from '@/utils'
import { IInstallation } from '@/interface'
import Image from 'next/image'

export function getInstallationToAddColumns(
  onAdd: (user: IInstallation) => void,
): ColumnDef<IInstallation>[] {
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
      accessorKey: 'imageUrls',
      header: 'Ảnh sản phẩm',
      cell: ({ row }) => {
        const thumbnailUrl = row.original.imageUrls
        return thumbnailUrl ? (
          <div className='relative w-full h-16 bg-gray-200 rounded p-2'>
            <Image
              src={thumbnailUrl[0]}
              alt='Ảnh sản phẩm'
              fill
              className='object-contain rounded h-16'
              priority
            />
          </div>
        ) : (
          <span className='uppercase text-gray-500'>No Image</span>
        )
      },
    },

    {
      accessorKey: 'desc',
      header: `Công lắp đặt`,
      cell: ({ row }) => {
        return (
          <span className='capitalize'>
            {row.original.translations?.[0]?.desc ?? ''}
          </span>
        )
      },
    },

    {
      accessorKey: 'cost',
      header: 'Đơn giá',
      cell: ({ row }) => (
        <span className='lowercase'>
          {formatCurrency(row.getValue('cost'), 203)}
        </span>
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
