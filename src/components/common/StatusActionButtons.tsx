'use client'

import { ACTIONS } from '@/utils'
import clsx from 'clsx'
import React from 'react'

type ProjectStatus = 'processing' | 'started' | 'finished' | 'cancelled'

interface StatusActionButtonsProps {
  currentStatus: ProjectStatus
  isUpdating: boolean
  onChangeStatus: (newStatus: ProjectStatus) => void
}

export const StatusActionButtons: React.FC<StatusActionButtonsProps> = ({
  currentStatus,
  isUpdating,
  onChangeStatus,
}) => {
  return (
    <div className='flex gap-3 flex-1'>
      {ACTIONS.map(({ key, label, color, allowed }) => {
        const canDo = allowed(currentStatus) && !isUpdating
        // xây dựng các class động theo color và canDo
        const base = `px-4 py-2 rounded-lg font-medium transition-colors capitalize duration-300 text-${color}-600`
        const active = `bg-${color}-100 border border-${color}-500 hover:bg-${color}-200 cursor-pointer`
        const disabled = `bg-${color}-100 border border-${color}-500 cursor-not-allowed`

        return (
          <button
            type='button'
            aria-label='Play video'
            key={key}
            onClick={() => canDo && onChangeStatus(key)}
            className={clsx(base, {
              [active]: canDo,
              [disabled]: !canDo,
            })}
            disabled={!canDo}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
