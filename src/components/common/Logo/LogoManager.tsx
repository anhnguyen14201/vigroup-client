'use client'

import React, { useState } from 'react'
import toast from 'react-hot-toast'
import nProgress from 'nprogress'
import { mutate } from 'swr'

import { apiDeleteLogo, apiGetPrivateLogo } from '@/api'
import { ILogo } from '@/interface'
import { ModalToggle } from '@/components/modal'
import LogoForm from './LogoForm'
import LogoListItem from './LogoListItem'
import { useGenericData } from '@/hooks'

const LogoManager = () => {
  const { items: items } = useGenericData<ILogo, []>(
    '/logo/privateLogo', // SWR key
    async () => (await apiGetPrivateLogo()).data.data, // fetcher fn returning Promise<ISlide[]>
    [], // args to fetcher
    {},
  )
  const [openAddLogo, setOpenAddLogo] = useState(false)
  const [activeLogo, setActiveLogo] = useState<ILogo | null>(null)

  const handleEdit = (s: ILogo) => {
    setActiveLogo(s)
    setOpenAddLogo(true)
  }

  const handleDelete = async (logo: ILogo) => {
    // Nếu người dùng hủy confirm, dừng hàm ngay
    if (!confirm('Xác nhận xóa logo này?')) return
    // Bật trạng thái loading với key "deleteLogo" và bắt đầu nProgress
    nProgress.start()

    try {
      const { data } = await apiDeleteLogo(logo._id)

      if (data?.success) {
        toast.success('Xóa thành công!')
      } else {
        toast.error(data?.message || 'Xóa không thành công')
        mutate('/logo/privateLogo')
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
        <h2 className='text-xl font-semibold'>Logo</h2>
        <div className='flex items-center space-x-2'>
          <button
            onClick={() => {
              setActiveLogo(null)
              setOpenAddLogo(true)
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
          <LogoListItem
            key={s._id}
            logo={s}
            index={idx}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Modal Thêm/Sửa Slide */}
      <ModalToggle
        isOpen={openAddLogo}
        onClose={() => setOpenAddLogo(false)}
        title={activeLogo ? 'Sửa Logo' : 'Thêm Logo'}
      >
        <div onClick={e => e.stopPropagation()}>
          <LogoForm
            logo={activeLogo}
            onSuccess={async () => {
              await mutate('/logo/privateLogo')
              setOpenAddLogo(false)
            }}
          />
        </div>
      </ModalToggle>
    </div>
  )
}

export default LogoManager
