'use client'
import { useDispatch } from 'react-redux'
import { useParams } from 'next/navigation'
import nProgress from 'nprogress'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

import {
  apiCreateQuotation,
  apiDeleteQuotation,
  apiUpdateQuotation,
} from '@/api'

import { IQuotation } from '@/interface'
import { AppDispatch } from '@/redux/redux'
import { setLoading } from '@/redux'
import DataTable from '@/components/common/DataTable'
import { GenericForm } from '@/components/common/Forms'
import { quotationColumns, quotationFormFields } from '@/constants'
import { useProjectById } from '@/hooks'
import { ModalToggle } from '@/components/modal'

const QuotationCard = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { id } = useParams()

  const projectId = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : ''
  const { data: projectData, mutate } = useProjectById(projectId)

  const { quotes } = projectData || {}
  const [selectedQuotation, setSelectedQuotation] = useState<IQuotation | null>(
    null,
  )
  const [isModalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState<
    'customer' | 'quotation' | 'variation'
  >('customer')

  const handleEditQuotation = (quote: IQuotation) => {
    setSelectedQuotation(quote) // lưu vào state
    setModalType('quotation')
    setModalOpen(true)
  }

  const handleDeleteQuotation = async (quote: IQuotation) => {
    const confirmDelete = window.confirm(
      'Bạn có chắc muốn xóa báo giá này không?',
    )
    if (!confirmDelete) return // nếu người dùng nhấn “Cancel” thì dừng
    dispatch(setLoading({ key: 'handleDeleteQuotation', value: true }))
    nProgress.start()

    try {
      if (!quote._id) throw new Error('Quotation ID is missing')
      const { data } = await apiDeleteQuotation(quote._id)
      if (data.success) {
        toast.success('Xóa thành công')
      } else {
        toast.error(data.message || 'Có lỗi xảy ra')
      }
      await mutate()
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message)
    } finally {
      dispatch(setLoading({ key: 'handleDeleteQuotation', value: false }))
      nProgress.done()

      setModalOpen(false)
    }
  }

  const quotationColumnsData = quotationColumns(
    handleEditQuotation,
    handleDeleteQuotation,
  )
  const handleAddQuotation = () => {
    setSelectedQuotation(null)
    setModalType('quotation')
    setModalOpen(true)
  }

  const handleSubmitQuotation = async (payload: IQuotation) => {
    dispatch(setLoading({ key: 'handleSubmitQuotation', value: true }))
    nProgress.start()

    try {
      if (selectedQuotation) {
        if (!selectedQuotation?._id) {
          // Xử lý trường hợp thiếu ID: cảnh báo, throw, hoặc return
          throw new Error('Quotation ID is required')
        }
        await apiUpdateQuotation(payload, selectedQuotation._id)
        toast.success('Sửa thành công!')
        await mutate()
      } else {
        await apiCreateQuotation({
          payload,
          projectId: id,
          quotationType: 'quotation',
        })
        toast.success('Thêm thành công!')
      }
      setModalOpen(false)
      setSelectedQuotation(null)
      await mutate()
    } catch (error) {
      toast.error((error as Error).message || 'Có lỗi xảy ra')
    } finally {
      dispatch(setLoading({ key: 'handleSubmitQuotation', value: false }))
      nProgress.done()
    }
  }

  const initialQuotationData = selectedQuotation ?? undefined

  return (
    <div className='quotation-info p-6 border rounded-lg bg-white'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-bold'>Báo giá</h2>
        <button
          type='button'
          aria-label='Play video'
          onClick={handleAddQuotation}
          className='px-2 py-1 cursor-pointer bg-white text-blue-600 border border-blue-600 
                    rounded-lg hover:bg-blue-200 transition duration-200'
        >
          + Thêm
        </button>
      </div>
      <div>
        <DataTable
          data={quotes}
          columns={quotationColumnsData}
          showTitle=''
          showSearch={false}
          showPagination={false}
        />
      </div>

      <ModalToggle
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedQuotation ? 'Sửa báo giá' : 'Thêm báo giá'}
      >
        <div onClick={e => e.stopPropagation()}>
          {modalType === 'quotation' && (
            <div className='p-4'>
              <GenericForm<IQuotation>
                initialData={initialQuotationData}
                fields={quotationFormFields}
                onSubmitApi={handleSubmitQuotation}
                onSuccess={() => {
                  setModalOpen(false)
                  setSelectedQuotation(null)
                }}
              />
            </div>
          )}
        </div>
      </ModalToggle>
    </div>
  )
}

export default QuotationCard
