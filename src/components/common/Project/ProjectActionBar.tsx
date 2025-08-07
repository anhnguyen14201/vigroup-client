// File: ProjectActionBar.tsx
'use client'

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeftFromLine } from 'lucide-react'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import nProgress from 'nprogress'

import { apiUpdateProjectStatus } from '@/api'
import { AppDispatch } from '@/redux/redux'
import { setLoading } from '@/redux'
import type { IQuotation } from '@/interface'
import { useProjectById } from '@/hooks'

interface ProjectActionBarProps {
  projectId?: string
  setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>
  setModalType?: React.Dispatch<React.SetStateAction<'deposited' | 'payment'>>
  setSelectedDeposited?: React.Dispatch<React.SetStateAction<IQuotation | null>>
  setSelectedPayment?: React.Dispatch<React.SetStateAction<IQuotation | null>>
  handleAddDeposit?: () => void
  handleAddPayment?: () => void
}

const ProjectActionBar: React.FC<ProjectActionBarProps> = ({
  handleAddDeposit,
  handleAddPayment,
  projectId,
}) => {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()

  // Lấy trạng thái dự án từ redux

  const { data: projectData, mutate } = useProjectById(projectId)

  const { status, depositAmount = 0 } = projectData || {}

  // Xử lý thay đổi trạng thái dự án
  const handleStatusChange = async (newStatus: string) => {
    // Bật trạng thái loading và bắt đầu tiến trình trước khi gọi API
    dispatch(setLoading({ key: 'handleStatusChange', value: true }))
    nProgress.start()

    try {
      const response = await apiUpdateProjectStatus(projectId as string, {
        status: newStatus,
      })
      if (response?.data?.success) {
        toast.success('Cập nhật trạng thái dự án thành công!')
        await mutate()
      } else {
        toast.error(
          response?.data?.message || 'Lỗi khi cập nhật trạng thái dự án',
        )
      }
    } catch (error) {
      const err = error as Error
      toast.error(err.message || 'Lỗi khi cập nhật trạng thái dự án')
    } finally {
      // Tắt trạng thái loading và dừng tiến trình
      dispatch(setLoading({ key: 'handleStatusChange', value: false }))
      nProgress.done()
    }
  }

  // Chuyển về trang danh sách dự án
  const handleBack = async () => {
    nProgress.start()
    try {
      // Với App Router, router.push() trả về void; nên chờ render xong
      await Promise.resolve()
      router.push('/admin/projects')
    } finally {
      // Dù router.push có lỗi hay không vẫn dừng tiến trình
      nProgress.done()
    }
  }

  // Xử lý hủy dự án
  const handleCancelOrder = async () => {
    if (window.confirm('Bạn có muốn hủy dự án này không?')) {
      await handleStatusChange('cancelled')
    }
  }

  const canStart = status === 'processing'
  const canFinish = status === 'started'
  const canCancel = status !== 'finished' && status !== 'cancelled'
  return (
    <div className='flex items-center justify-between mb-6 space-x-3'>
      {/* Back Button */}
      <button
        type='button'
        onClick={handleBack}
        className='flex items-center justify-center px-2 py-1 border border-gray-500 text-gray-600 rounded-lg hover:bg-gray-300 transition cursor-pointer'
      >
        <ArrowLeftFromLine className='w-5 h-5' />
      </button>

      {/* Deposit / Payment Buttons */}
      <div className='flex gap-3'>
        <button
          onClick={handleAddDeposit}
          disabled={depositAmount > 0} // Nếu depositAmount > 0 thì disable
          className={`px-2 py-1 rounded-lg font-medium transition ${
            depositAmount > 0
              ? 'border border-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-yellow-100 border border-yellow-500 text-yellow-600 hover:bg-yellow-200 cursor-pointer'
          }`}
        >
          Tiền cọc
        </button>

        <button
          onClick={handleAddPayment}
          className='px-2 py-1 bg-indigo-100 border border-indigo-500 text-indigo-600 rounded-lg font-medium hover:bg-indigo-200 transition cursor-pointer'
        >
          Tiền đã thanh toán
        </button>
      </div>

      {/* Project Actions */}
      <div className='flex gap-3 flex-1'>
        <button
          onClick={() => handleStatusChange('started')}
          className={`px-2 py-1 rounded-lg font-medium transition-colors capitalize duration-300  ${
            canStart
              ? 'bg-green-100 border border-green-500 hover:bg-green-200 cursor-pointer text-green-600'
              : 'border border-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          disabled={!canStart}
        >
          Bắt đầu dự án
        </button>
        <button
          onClick={() => handleStatusChange('finished')}
          className={`px-2 py-1 rounded-lg font-medium transition-colors capitalize duration-300  ${
            canFinish
              ? 'bg-blue-100 hover:bg-blue-200 border border-blue-500 cursor-pointer text-blue-600'
              : 'border border-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          disabled={!canFinish}
        >
          Kết thúc dự án
        </button>
        <button
          onClick={handleCancelOrder}
          className={`px-2 py-1 rounded-lg font-medium transition-colors capitalize duration-300  ${
            canCancel
              ? 'bg-red-100 hover:bg-red-200 border border-red-500 cursor-pointer text-red-600'
              : 'border border-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          disabled={!canCancel}
        >
          Hủy dự án
        </button>
      </div>

      {/* Modal - hiển thị form dựa trên modalType */}
    </div>
  )
}

export default ProjectActionBar
