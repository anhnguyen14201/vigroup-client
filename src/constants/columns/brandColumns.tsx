// 3. Hàm build columns
import { ColumnDef } from '@tanstack/react-table'
import { Edit2, Trash2 } from 'lucide-react'
import { Checkbox } from '@/components'
import { getTranslationField } from '@/utils'
import { GetProductBrandColumnsProps, ProductBrand } from '@/interface'

export function getProductBrandColumns({
  currentLang,
  onEdit,
  onDelete,
}: GetProductBrandColumnsProps): ColumnDef<ProductBrand>[] {
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
      id: 'name',
      header: 'Tên thương hiệu',
      cell: ({ row }) => (
        <div className='truncate max-w-[200px]'>{row.original.name}</div>
      ),
    },
    {
      id: 'metaDescription',
      header: `Mô tả SEO (${currentLang.toUpperCase()})`,
      accessorFn: row =>
        getTranslationField(row, currentLang, 'metaDescription'),
      cell: ({ getValue }) => (
        <div className='truncate max-w-[300px]'>{getValue() as string}</div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const brand = row.original
        return (
          <div className='flex space-x-1'>
            <button
              type='button'
              onClick={() => onEdit(brand)}
              className='p-2 hover:bg-green-200 rounded-full cursor-pointer transition duration-300'
              aria-label='Edit brand'
            >
              <Edit2 className='w-4 h-4 text-green-600' strokeWidth={2} />
            </button>
            <button
              type='button'
              onClick={() => {
                if (window.confirm(`Bạn có chắc muốn xóa "${brand.name}"?`)) {
                  onDelete(brand)
                }
              }}
              className='p-2 hover:bg-red-200 rounded-full cursor-pointer transition duration-300'
              aria-label='Delete brand'
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
