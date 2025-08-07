// src/constants/installationColumns.ts
import { ColumnDef } from '@tanstack/react-table'
import { Edit2, Trash2 } from 'lucide-react'
import { Checkbox } from '@/components'
import { formatCurrency, getTranslationField } from '@/utils'
import { IInstallation, GetInstallationColumnProps } from '@/interface'
import Image from 'next/image'

export function getInstallationColumns({
  currentLang,
  onEdit,
  onDelete,
}: GetInstallationColumnProps): ColumnDef<IInstallation>[] {
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
          aria-label='Select all rows'
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={v => row.toggleSelected(!!v)}
          aria-label='Select this row'
        />
      ),
      enableSorting: false,
      enableColumnFilter: false,
      size: 40,
    },
    {
      accessorKey: 'imageUrls',
      header: 'Ảnh sản phẩm',
      cell: ({ row }) => {
        const url = row.original.imageUrls
        return url ? (
          <div className='relative w-full h-16 bg-gray-200 rounded p-2'>
            <Image
              src={url[0]}
              alt='Ảnh sản phẩm'
              fill // phủ kín container
              style={{ objectFit: 'contain' }}
              className='object-contain rounded'
              priority
            />
          </div>
        ) : (
          <span className='text-gray-500 uppercase'>No Image</span>
        )
      },
    },
    {
      id: 'desc',
      header: `Mô tả lắp đặt (${currentLang.toUpperCase()})`,
      cell: ({ row }) => {
        const pt = row.original
        const displayName = getTranslationField(pt, currentLang, 'desc')

        return <div className='truncate max-w-[300px]'>{displayName}</div>
      },
      accessorFn: row => getTranslationField(row, currentLang, 'desc'),
    },
    {
      accessorKey: 'tax',
      header: 'Thuế (%)',
      cell: ({ getValue }) => <span>{getValue<number>()}</span>,
    },
    {
      accessorKey: 'cost',
      header: 'Đơn giá',
      cell: ({ getValue }) => (
        <span>{formatCurrency(getValue<number>(), 203)}</span>
      ),
    },
    {
      id: 'actions',
      header: 'Hành động',
      cell: ({ row }) => {
        const inst = row.original
        return (
          <div className='flex space-x-1'>
            <button
              onClick={() => onEdit(inst)}
              aria-label='Sửa'
              className='p-2 hover:bg-green-200 rounded-full cursor-pointer transition duration-300'
            >
              <Edit2 className='w-4 h-4 text-green-600' strokeWidth={2} />
            </button>
            <button
              onClick={() => onDelete(inst)}
              aria-label='Xóa'
              className='p-2 hover:bg-red-200 rounded-full cursor-pointer transition duration-300'
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
