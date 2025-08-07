'use client'

import React, { useState } from 'react'
import toast from 'react-hot-toast'
import nProgress from 'nprogress'

import { apiDeleteInforCompany, apiGetInforCompany } from '@/api'

import { IInfor } from '@/interface'

import { ModalToggle } from '@/components/modal'
import InforCompanyForm from '@/components/common/Infor/InforCompanyForm'
import InforCompanyListItem from '@/components/common/Infor/InforCompanyListItem'
import { useGenericData } from '@/hooks'
import { mutate } from 'swr'

const InforCompanyManager = () => {
  const { items: inforCompany } = useGenericData(
    '/company', // SWR key
    () => apiGetInforCompany().then(r => r.data.data), // fetcher -> ISlide[]
    [], // args for fetcher
    {},
  )

  const [openAddInfor, setOpenAddInfor] = useState(false)
  const [activeInfor, setActiveInfor] = useState<IInfor | null>(null)

  // Xử lý xem, sửa, xóa

  const handleEdit = (s: IInfor) => {
    setActiveInfor(s)
    setOpenAddInfor(true)
  }

  const handleDelete = async (info: IInfor) => {
    // Kiểm tra xác nhận xóa
    if (!confirm('Xác nhận xóa thông tin này?')) return

    // Bật loading với key "deleteInforCompany" và bắt đầu nProgress
    nProgress.start()

    try {
      const { data } = await apiDeleteInforCompany(info._id)

      if (data?.success) {
        toast.success('Xóa thành công!')
        mutate('/company')
      } else {
        toast.error(data?.message || 'Xóa không thành công')
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || error?.message || 'An error occurred',
      )
    } finally {
      nProgress.done()
      // Tắt loading với key "deleteInforCompany"
    }
  }

  return (
    <div className='w-full mx-auto flex flex-col gap-6 bg-white p-5 border-1 border-gray-200 rounded-lg'>
      {/* Header với nút Thêm, Lưu, Hủy */}
      <div className='flex justify-between items-center space-x-2'>
        <h2 className='text-xl font-semibold'>Thông tin công ty</h2>
        <div className='flex items-center space-x-2'>
          <button
            type='button'
            aria-label='seeMore'
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
        {inforCompany.map((s: any, idx: any) => (
          <InforCompanyListItem
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
        title={activeInfor ? 'Sửa thông tin công ty' : 'Thêm thông tin công ty'}
      >
        <div onClick={e => e.stopPropagation()}>
          <InforCompanyForm
            infor={activeInfor ?? undefined}
            onSuccess={async () => {
              await mutate('/company')
              setOpenAddInfor(false)
            }}
          />
        </div>
      </ModalToggle>
    </div>
  )
}

export default InforCompanyManager
