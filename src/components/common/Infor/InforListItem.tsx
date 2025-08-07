'use client'

import { Edit2, Trash2 } from 'lucide-react'

import { cn } from '@/lib/utils'
import { IInforListItem } from '@/interface'
import { formatPhone } from '@/utils'

const InforListItem = ({ infor, onEdit, onDelete }: IInforListItem) => {
  const statusClasses: Record<string, string> = {
    true: 'bg-green-100 text-green-800',
    false: 'bg-red-100 text-red-800',
  }

  return (
    <div className='relative flex items-center bg-white rounded-lg border-1 border-gray-200 p-2'>
      {/* Info */}
      <div className='flex-1 px-3 py-2 flex justify-between items-center'>
        <span className='font-medium'>{infor.title}</span>

        <span className='font-medium truncate block w-44'>
          {formatPhone(infor.desc)}
        </span>
        <span
          className={cn(
            'px-2 py-0.5 text-xs font-medium rounded',
            statusClasses[String(infor.activity)],
          )}
        >
          {infor.activity ? 'Active' : 'Disabled'}
        </span>
      </div>

      {/* Actions */}

      <button
        onClick={e => {
          e.stopPropagation()
          onEdit(infor)
        }}
        className='cursor-pointer p-2 hover:bg-green-200 rounded-full transition-all'
      >
        <Edit2 className='w-4 h-4 text-green-600 hover:text-green-700 transition-all' />
      </button>

      <button
        onClick={e => {
          e.stopPropagation()
          onDelete(infor)
        }}
        className='cursor-pointer p-2 hover:bg-red-200 rounded-full transition-all'
      >
        <Trash2 className='w-4 h-4 text-red-600 hover:text-red-700 transition-all' />
      </button>
    </div>
  )
}

export default InforListItem
