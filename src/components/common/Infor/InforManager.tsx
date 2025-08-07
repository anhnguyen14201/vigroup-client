'use client'

import React, { useState } from 'react'
import toast from 'react-hot-toast'
import nProgress from 'nprogress'
import { mutate } from 'swr'

import { apiDeleteInfor } from '@/api'
import { IInfor } from '@/interface'
import { ModalToggle } from '@/components/modal'
import InforForm from './InforForm'
import InforListItem from './InforListItem'
import { usePrivateInfor } from '@/hooks'

const InforManager = () => {
  const { items } = usePrivateInfor() as { items: IInfor[] }

  const [openAddInfor, setOpenAddInfor] = useState(false)
  const [activeInfor, setActiveInfor] = useState<IInfor | null>(null)

  // Xử lý xem, sửa, xóa

  const handleEdit = (s: IInfor) => {
    setActiveInfor(s)
    setOpenAddInfor(true)
  }

  const handleDelete = async (s: IInfor) => {
    // Nếu không xác nhận, dừng hàm ngay lập tức
    if (!confirm('Xác nhận xóa logo này?')) return

    // Bật trạng thái loading với key 'deleteInfor' và bắt đầu tiến trình
    nProgress.start()

    try {
      const res = await apiDeleteInfor(s._id)

      if (res?.data?.success) {
        toast.success('Xóa thành công!')
        await mutate('/infor/private-infor')
      } else {
        toast.error(res?.data?.message || 'Xóa không thành công')
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || error?.message || 'An error occurred',
      )
    } finally {
      nProgress.done()
    }
  }

  return (
    <div className='w-full mx-auto flex flex-col gap-6 bg-white p-5 border-1 border-gray-200 rounded-lg'>
      {/* Header với nút Thêm, Lưu, Hủy */}
      <div className='flex justify-between items-center space-x-2'>
        <h2 className='text-xl font-semibold'>Thông tin liên hệ</h2>
        <div className='flex items-center space-x-2'>
          <button
            onClick={() => {
              setActiveInfor(null)
              setOpenAddInfor(true)
            }}
            className='flex items-center cursor-pointer px-4 py-2 text-sm font-medium text-blue-700 
                bg-blue-100 rounded-lg hover:bg-blue-300 border border-blue-600'
          >
            + Thêm
          </button>
        </div>
      </div>

      {/* Danh sách kéo thả */}

      <div className='overflow-y-auto space-y-4 max-h-[calc(5*8rem)] scrollbar-thin scrollbar-thumb-gray-300'>
        {items.map((s, idx) => (
          <InforListItem
            key={s._id}
            infor={s}
            index={idx}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Modal Thêm/Sửa Slide */}
      <ModalToggle
        isOpen={openAddInfor}
        onClose={() => setOpenAddInfor(false)}
        title={activeInfor ? 'Sửa thông tin liên hệ' : 'Thêm thông tin liên hệ'}
      >
        <div onClick={e => e.stopPropagation()}>
          <InforForm
            infor={activeInfor}
            onSuccess={async () => {
              await mutate('/infor/private-infor')
              setOpenAddInfor(false)
            }}
          />
        </div>
      </ModalToggle>
    </div>
  )
}

export default InforManager
