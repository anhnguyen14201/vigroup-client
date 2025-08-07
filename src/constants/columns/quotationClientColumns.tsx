'use client'

import { ColumnDef } from '@tanstack/react-table'

import { IQuotation } from '@/interface'
import { formatCurrency } from '@/utils'
import { useTranslations } from 'next-intl'

export const quotationClientColumns = (
  t: (key: string) => string,
): ColumnDef<any>[] => [
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
    header: t('projects.jobDescription'),
    cell: ({ row }) => (
      <span className='capitalize'>{row.getValue('desc')}</span>
    ),
  },
  {
    accessorKey: 'quantity',
    header: t('projects.estimatedQuantity'),
    cell: ({ row }) => (
      <span className='lowercase'>{row.getValue('quantity')}</span>
    ),
  },
  {
    accessorKey: 'cost',
    header: t('projects.unitPrice'),
    cell: ({ row }) => (
      <span className='lowercase'>{row.getValue('cost')}</span>
    ),
  },
  {
    accessorKey: 'totalPrice',
    header: t('projects.totalAmount'),
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
]
