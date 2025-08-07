// components/common/DataTable.tsx
'use client'

import * as React from 'react'
import Image from 'next/image'
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { IDataTableProps, IUser } from '@/interface'
import { ChevronDown } from 'lucide-react'

const DataTable: React.FC<IDataTableProps> = ({
  data,
  columns,
  buttons,
  inputChange,
  setInputChange,
  onDeleteSelected,
  showTitle,
  languages,
  setCurrentLang,
  currentLang,
  isLoading,
  remainingCount,
  loadMore,
  isLoadingMore,
}) => {
  // Table state
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  // Cache previous data during loading
  const prevDataRef = React.useRef(data)
  React.useEffect(() => {
    if (!isLoading && data) prevDataRef.current = data
  }, [data, isLoading])

  const displayData = React.useMemo(
    () => (isLoading ? prevDataRef.current : data),
    [data, isLoading],
  )

  const table = useReactTable({
    data: displayData ?? [],
    columns: columns ?? [],
    state: { sorting, columnFilters, columnVisibility, rowSelection },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  const handleDeleteSelected = () => {
    const selected: IUser[] = table
      .getFilteredSelectedRowModel()
      .rows.map(r => r.original)
    if (selected.length && onDeleteSelected) onDeleteSelected(selected)
    setRowSelection({})
  }

  return (
    <div className='w-full'>
      {showTitle && <div className='font-semibold mb-2'>{showTitle}</div>}

      {/* Search + Buttons */}
      <div className='flex flex-wrap items-center gap-4 py-4'>
        {setInputChange && (
          <Input
            placeholder='Tìm kiếm...'
            value={inputChange}
            onChange={e => setInputChange(e.target.value)}
            className='w-full max-w-full sm:max-w-sm'
          />
        )}

        <div className='flex flex-wrap gap-2'>
          {buttons?.map((b, i) => (
            <button
              key={i}
              type='button'
              onClick={b.onClick}
              className='px-3 py-1 cursor-pointer text-blue-600 border border-blue-500 bg-blue-100 rounded-lg hover:bg-blue-200'
            >
              {b.label}
            </button>
          ))}

          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <button
              type='button'
              onClick={handleDeleteSelected}
              className='px-3 py-1 text-red-600 border cursor-pointer border-red-500 bg-red-100 rounded-lg hover:bg-red-200'
            >
              Xóa ({table.getFilteredSelectedRowModel().rows.length})
            </button>
          )}
        </div>

        {languages && setCurrentLang && currentLang && (
          <div className='flex flex-wrap gap-2 ml-auto'>
            {languages.map((lang: any) => (
              <button
                key={lang.code}
                type='button'
                onClick={() => setCurrentLang(lang.code)}
                className={`p-0.5 border rounded-full transition cursor-pointer ${
                  currentLang === lang.code
                    ? 'border-red-600'
                    : 'opacity-50 hover:border-red-600'
                }`}
              >
                <Image
                  src={lang.iconUrl[0]}
                  alt={lang.name}
                  width={22}
                  height={22}
                  priority
                  className='rounded-full'
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Table wrapper: scroll ngang khi cần */}
      <div className='rounded-md border overflow-x-auto w-full'>
        <Table className='min-w-full table-auto'>
          <TableHeader>
            {table.getHeaderGroups().map(hg => (
              <TableRow key={hg.id}>
                {hg.headers.map(h => (
                  <TableHead
                    key={h.id}
                    className='px-4 py-2 whitespace-normal break-words'
                  >
                    {!h.isPlaceholder &&
                      flexRender(h.column.columnDef.header, h.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? 'selected' : undefined}
                  className='hover:bg-gray-50'
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell
                      key={cell.id}
                      className='px-4 py-2 whitespace-normal break-words'
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns?.length || 0}
                  className='h-24 text-center'
                >
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Load more */}
      {loadMore && remainingCount > 0 && (
        <div className='flex justify-center my-10'>
          <button
            type='button'
            onClick={loadMore}
            disabled={isLoadingMore}
            className='flex items-center gap-2 px-6 py-3 cursor-pointer bg-red-100 text-red-600 rounded-full disabled:opacity-50 hover:bg-red-200 transition'
          >
            Xem thêm ({remainingCount})
            <ChevronDown size={20} />
          </button>
        </div>
      )}
    </div>
  )
}

export default DataTable
