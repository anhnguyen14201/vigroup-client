import { ColumnDef } from '@tanstack/react-table'
import { Edit2, Trash2 } from 'lucide-react'
import { Checkbox } from '@/components'

interface GetProjectTypeColumnsProps {
  currentLang: string
  onEdit: (pt: any) => void
  onDelete: (pt: any) => void
}

/**
 * Helper để lấy tên (hoặc metaTitle, metaDescription,...) theo currentLang
 */
function getTranslationField(
  pt: any,
  currentLang: string,
  field: 'name' | 'metaTitle' | 'metaDescription',
) {
  // Tìm translation có trùng code
  const found = pt.translations.find(
    (t: any) => (t.language as any).code === currentLang,
  )
  if (found && typeof found[field] === 'string') {
    return found[field]
  }
  // fallback: lấy bản dịch đầu tiên nếu không tìm được
  return pt.translations[0]?.[field] || ''
}

export function getProjectTypeColumns({
  currentLang,
  onEdit,
  onDelete,
}: GetProjectTypeColumnsProps): ColumnDef<any>[] {
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
      header: `Kiểu dự án (${currentLang.toUpperCase()})`,
      cell: ({ row }) => {
        const pt = row.original
        const displayName = getTranslationField(pt, currentLang, 'name')
        return <div className='truncate max-w-[200px]'>{displayName}</div>
      },
      accessorFn: row => getTranslationField(row, currentLang, 'name'),
    },

    {
      id: 'metaDescription',
      header: `Mô tả SEO (${currentLang.toUpperCase()})`,
      cell: ({ row }) => {
        const pt = row.original
        const displayMetaDesc = getTranslationField(
          pt,
          currentLang,
          'metaDescription',
        )
        return <div className='truncate max-w-[300px]'>{displayMetaDesc}</div>
      },
      accessorFn: row =>
        getTranslationField(row, currentLang, 'metaDescription'),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const pt = row.original
        const displayName = getTranslationField(pt, currentLang, 'name')
        return (
          <div className='flex space-x-1'>
            <button
              onClick={() => onEdit(pt)}
              className='cursor-pointer p-2 hover:bg-green-200 rounded-full transition-all'
            >
              <Edit2
                className='w-4 h-4 text-green-600 hover:text-green-700 transition-all'
                strokeWidth={2}
              />
            </button>
            <button
              className='cursor-pointer p-2 hover:bg-red-200 rounded-full transition-all'
              onClick={() => {
                if (window.confirm(`Bạn có chắc muốn xóa "${displayName}"?`)) {
                  onDelete(pt)
                }
              }}
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
