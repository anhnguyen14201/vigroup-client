'use client'

import { mutate } from 'swr'
import React, { useEffect, useState } from 'react'
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import toast from 'react-hot-toast'
import nProgress from 'nprogress'

import { apiDeleteSlide, apiGetSlidePrivate, apiUpdateSlideOrder } from '@/api'

import { ISlide } from '@/interface'

import SlideListItem from './SlideListItem'
import { ModalToggle } from '@/components/modal'
import SlideForm from './SlideForm'
import { usePriavteSlides } from '@/hooks'

const SlideManager = () => {
  const [items, setItems] = useState<ISlide[]>([])
  const [originalItems, setOriginalItems] = useState<ISlide[]>([])
  const [isDirty, setIsDirty] = useState(false)

  const { items: slides } = usePriavteSlides() as { items: ISlide[] }
  const [openAddSlide, setOpenAddSlide] = useState(false)
  const [activeSlide, setActiveSlide] = useState<ISlide | null>(null)
  const [activeDragId, setActiveDragId] = useState<string | null>(null)

  // Cảm biến kéo thả
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  )

  // Khi slides từ store thay đổi, sync cả items và lưu bản gốc
  useEffect(() => {
    const slidesArray = Array.isArray(slides) ? slides : []
    const sorted = [...slidesArray].sort((a, b) => a.order - b.order)
    setItems(sorted)
    setOriginalItems(sorted)
    setIsDirty(false)
  }, [slides])

  const handleEdit = (s: ISlide) => {
    setActiveSlide(s)
    setOpenAddSlide(true)
  }
  // Xóa một slide
  const handleDelete = async (slide: ISlide) => {
    // Nếu người dùng không xác nhận, dừng luôn hàm
    if (!confirm('Xác nhận xóa ảnh này?')) return

    nProgress.start()

    try {
      setItems(prev => prev.filter(s => s._id !== slide._id))
      setIsDirty(false) // hoặc tuỳ bạn
      const { data } = await apiDeleteSlide(slide._id)
      if (data?.success) {
        toast.success('Xóa thành công!')
        await mutate('/slide')
      } else {
        toast.error(data?.message || 'Xóa không thành công')
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || error?.message || 'An error occurred',
      )
    } finally {
      nProgress.done()
    }
  }

  // Lưu thứ tự slide lên API
  const handleSaveOrder = async () => {
    const payload = items.map((sl, idx) => ({
      _id: sl._id,
      order: idx,
    }))

    nProgress.start()

    try {
      await apiUpdateSlideOrder(payload)
      toast.success('Cập nhật thứ tự thành công!')
      await mutate('/slide')
      setIsDirty(false)
    } catch {
      toast.error('Có lỗi xảy ra khi cập nhật thứ tự')
    } finally {
      nProgress.done()
    }
  }

  // Kéo thả thay đổi thứ tự
  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveDragId(null)
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex(sl => sl._id === active.id)
      const newIndex = items.findIndex(sl => sl._id === over.id)
      const newItems = arrayMove(items, oldIndex, newIndex)
      setItems(newItems)
      setIsDirty(true)
    }
  }

  // Hủy về thứ tự ban đầu
  const handleCancel = () => {
    setItems(originalItems)
    setIsDirty(false)
  }
  return (
    <div className='w-full mx-auto flex flex-col gap-6 p-5 border-1 border-gray-200 rounded-lg bg-white'>
      {/* Header với nút Thêm, Lưu, Hủy */}
      <div className='flex justify-between items-center space-x-2'>
        <h2 className='text-xl font-semibold'>Slide ảnh</h2>
        <div className='flex items-center space-x-2'>
          <button
            type='button'
            aria-label='seeMore'
            onClick={() => {
              setActiveSlide(null)
              setOpenAddSlide(true)
            }}
            className='flex items-center cursor-pointer px-4 py-2 text-sm font-medium text-blue-700 
                bg-blue-100 rounded-lg hover:bg-blue-300 border border-blue-600'
          >
            + Thêm
          </button>

          {isDirty && (
            <div className='flex justify-end space-x-2'>
              <button
                className='flex items-center cursor-pointer px-4 py-2 text-sm font-medium text-green-700 
                bg-green-100 rounded-lg hover:bg-green-300 border border-green-600'
                onClick={handleSaveOrder}
              >
                Lưu Thứ Tự
              </button>
              <button
                className='flex items-center cursor-pointer px-4 py-2 text-sm font-medium text-red-600 
                bg-red-100 rounded-lg hover:bg-red-200 border-1 border-red-600'
                onClick={handleCancel}
              >
                Hủy
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Danh sách kéo thả */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map(sl => sl._id)}
          strategy={verticalListSortingStrategy}
        >
          <div className='overflow-y-auto space-y-4 max-h-[calc(5*8rem)] scrollbar-thin scrollbar-thumb-gray-300'>
            {items.map((s, idx) => (
              <SlideListItem
                key={s._id}
                slide={s}
                index={idx}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </SortableContext>

        <DragOverlay className='cursor-grabbing'>
          {activeDragId ? (
            <SlideListItem
              slide={items.find(sl => sl._id === activeDragId)!}
              index={items.findIndex(sl => sl._id === activeDragId)}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Modal Thêm/Sửa Slide */}
      <ModalToggle
        isOpen={openAddSlide}
        onClose={() => setOpenAddSlide(false)}
        title={activeSlide ? 'Sửa Slide' : 'Thêm Slide'}
      >
        <SlideForm
          slide={activeSlide ?? undefined}
          onSuccess={async () => {
            await mutate('/slide')
            setOpenAddSlide(false)
          }}
        />
      </ModalToggle>
    </div>
  )
}

export default SlideManager
