'use client'
import { X } from 'lucide-react'
import { ReactNode, useRef, useEffect } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  // Đóng khi nhấn Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  // Đóng khi click ngoài panel
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    if (isOpen) document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      {/* Overlay */}
      <div className='absolute inset-0 bg-black/50' />

      {/* Panel */}
      <div
        ref={panelRef}
        className='relative z-10 w-full max-w-lg bg-white rounded-lg p-6 shadow-lg'
      >
        {/* Nút đóng góc trên bên phải */}
        <button
          type='button'
          onClick={onClose}
          aria-label='Close modal'
          className='absolute top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none'
        >
          <X className='h-5 w-5' />
        </button>

        {title && <h3 className='mb-4 text-xl font-semibold'>{title}</h3>}
        <div className='mb-4'>{children}</div>
      </div>
    </div>
  )
}
