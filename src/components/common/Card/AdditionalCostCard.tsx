'use client'

import {
  apiCreateQuotation,
  apiDeleteQuotation,
  apiUpdateQuotation,
} from '@/api'
import DataTable from '@/components/common/DataTable'
import { GenericForm } from '@/components/common/Forms'
import { ModalToggle } from '@/components/modal'
import { quotationColumns, quotationFormFields } from '@/constants'
import { useProjectById } from '@/hooks'
import { IQuotation, IQuotationProps } from '@/interface'
import { setLoading } from '@/redux'
import { AppDispatch } from '@/redux/redux'
import nProgress from 'nprogress'
import React from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'

const AdditionalCostCard: React.FC<IQuotationProps> = ({
  id,
  quotationType,
  selectedQuotation,
  setSelectedQuotation,
  quotes,
  isModalOpen,
  setModalOpen,
  modalType,
  handleEditQuotation,
  handleAddQuotation,
  editQuotation,
  createQuotation,
  labelQuotation,
}) => {
  const dispatch = useDispatch<AppDispatch>()

  const { mutate } = useProjectById(id)

  const handleDeleteQuotation = async (quote: IQuotation) => {
    // Sử dụng key 'deleteQuotation' cho quá trình xóa
    dispatch(setLoading({ key: 'deleteQuotation', value: true }))
    nProgress.start()

    try {
      const { data } = await apiDeleteQuotation(quote._id)

      if (data.success) {
        toast.success('Xóa thành công')
      } else {
        toast.error(data.message || 'Có lỗi xảy ra')
      }
      await mutate()
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      dispatch(setLoading({ key: 'deleteQuotation', value: false }))
      nProgress.done()
      setModalOpen(false)
    }
  }

  const handleSubmitQuotation = async (payload: IQuotation) => {
    // Sử dụng key 'submitQuotation' cho quá trình submit
    dispatch(setLoading({ key: 'submitQuotation', value: true }))
    nProgress.start()

    try {
      if (selectedQuotation) {
        await apiUpdateQuotation(payload, selectedQuotation._id)
        toast.success('Sửa thành công!')
        await mutate()
      } else {
        await apiCreateQuotation({
          payload,
          projectId: id,
          quotationType: quotationType,
        })
        toast.success('Thêm thành công!')
      }

      setModalOpen(false)
      setSelectedQuotation(null)
      await mutate()
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || error.message || 'Có lỗi khi submit',
      )
    } finally {
      dispatch(setLoading({ key: 'submitQuotation', value: false }))
      nProgress.done()
    }
  }

  const quotationColumnsData = quotationColumns(
    handleEditQuotation,
    handleDeleteQuotation,
  )

  return (
    <div className='quotation-info p-6 border rounded-lg bg-white'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-bold'>{labelQuotation}</h2>
        <button
          type='button'
          aria-label='Play video'
          onClick={handleAddQuotation}
          className='px-2 py-1 cursor-pointer bg-blue-100 text-blue-600 border border-blue-600 
                    rounded-lg hover:bg-blue-300 transition duration-200'
        >
          + Thêm
        </button>
      </div>
      <div>
        <DataTable data={quotes} columns={quotationColumnsData} showTitle='' />
      </div>

      <ModalToggle
        isOpen={isModalOpen && modalType === quotationType}
        onClose={() => setModalOpen(false)}
        title={selectedQuotation ? editQuotation : createQuotation}
      >
        <div onClick={e => e.stopPropagation()}>
          <div className='p-4'>
            <GenericForm<IQuotation>
              initialData={selectedQuotation ?? undefined}
              fields={quotationFormFields}
              onSubmitApi={handleSubmitQuotation}
              onSuccess={() => {
                setModalOpen(false)
                setSelectedQuotation(null)
              }}
            />
          </div>
        </div>
      </ModalToggle>
    </div>
  )
}

export default AdditionalCostCard
