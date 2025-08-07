import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog'
import { X } from 'lucide-react'
import { ReactNode } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: ReactNode
  heightStyle?: string
}

export default function ModalToggle({
  isOpen,
  onClose,
  title,
  description,
  children,
  heightStyle = 'max-h-[90vh]',
}: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent
        className={`min-w-[90vw] ${heightStyle} overflow-auto p-6`}
      >
        <DialogHeader>
          {title && <DialogTitle>{title}</DialogTitle>}
          {description && <DialogDescription>{description}</DialogDescription>}
          <DialogClose asChild>
            <button
              type='button'
              aria-label='seeMore'
              className='absolute top-3 cursor-pointer right-3 text-gray-500 hover:text-gray-700'
            >
              <X className='h-5 w-5' />
            </button>
          </DialogClose>
        </DialogHeader>
        <div>{children}</div>
      </DialogContent>
    </Dialog>
  )
}
