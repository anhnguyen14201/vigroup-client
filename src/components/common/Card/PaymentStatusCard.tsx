'use client'

import { X } from 'lucide-react'
import { useParams } from 'next/navigation'
import React from 'react'

import { IQuotation } from '@/interface'
import { GenericForm } from '@/components/common/Forms'
import { ModalToggle } from '@/components/modal'
import {
  paymentFormFields,
  paymentStatusClasses,
  paymentStatusLabels,
} from '@/constants'
import { formatCurrency } from '@/utils'
import { usePaymentStatusCardActions, useProjectById } from '@/hooks'

interface ProjectInfoCardProps {
  projectId: string
  isModalOpen: boolean
  setModalOpen: (open: boolean) => void
  modalType?: string
  selectedDeposited: IQuotation | null
  setSelectedDeposited: (q: IQuotation | null) => void
  selectedPayment: IQuotation | null
  setSelectedPayment: (q: IQuotation | null) => void
}

const ProjectInfoCard: React.FC<ProjectInfoCardProps> = ({
  isModalOpen,
  setModalOpen,
  modalType,
  selectedDeposited,
  setSelectedDeposited,
  selectedPayment,
  setSelectedPayment,
  projectId,
}) => {
  const { data: projectData } = useProjectById(projectId)
  const {
    paymentStatus,
    depositAmount,
    totalAmount,
    totalQuotationAmount,
    totalVariationAmount,
    currencyQuotes,
    currencyPayment,
    paymentAmounts,
    totalReceived,
  } = projectData || {}

  const { id } = useParams()
  const classes =
    paymentStatus && paymentStatusClasses[paymentStatus]
      ? paymentStatusClasses[paymentStatus]
      : 'bg-gray-100 text-gray-800 '
  const label = paymentStatus ? paymentStatusLabels[paymentStatus] : ''

  const {
    handleSubmitPayment,
    handleSubmitDeposit,
    handleDeleteDeposit,
    handleDeletePayment,
  } = usePaymentStatusCardActions({
    setModalOpen,
    id,
    setSelectedPayment,
  })

  return (
    <div className='right-side w-full flex-1 p-6 border border-gray-200 rounded-lg bg-white flex flex-col justify-between'>
      <div className='space-y-4'>
        {/* Header */}
        <div className='flex justify-between items-center'>
          <h2 className='text-lg font-semibold'>Thanh toán</h2>
          <span className={`${classes} text-sm px-2 py-1 rounded`}>
            {label}
          </span>
        </div>

        {/* Deposit and payments */}
        <div className='space-y-3'>
          <div className='flex justify-between items-center'>
            <div className='text-gray-800'>
              <span className='font-medium'>Đã đặt cọc:</span>{' '}
              {formatCurrency(
                depositAmount ?? 0,
                (currencyPayment ?? 203) as 203 | 840 | 978,
              )}
            </div>
            {(depositAmount ?? 0) > 0 && (
              <button
                type='button'
                onClick={handleDeleteDeposit}
                className='text-red-500 hover:text-red-700 cursor-pointer'
                aria-label='Xóa đặt cọc'
              >
                <X size={16} />
              </button>
            )}
          </div>

          {(paymentAmounts ?? []).map((amt, idx) => (
            <div key={idx} className='flex justify-between items-center'>
              <div className='text-gray-800'>
                <span className='font-medium'>Đợt {idx + 1}:</span>{' '}
                {formatCurrency(
                  amt ?? 0,
                  (currencyPayment ?? 203) as 203 | 840 | 978,
                )}
              </div>

              <button
                type='button'
                onClick={() => handleDeletePayment({ index: idx })}
                className='text-red-500 hover:text-red-700 cursor-pointer'
                aria-label={`Xóa thanh toán đợt ${idx + 1}`}
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className='border-t pt-3 space-y-2 text-gray-700'>
          <div className='flex justify-between font-medium'>
            <span>Tổng đã thanh toán:</span>
            <span>
              {formatCurrency(
                totalReceived ?? 0,
                (currencyPayment ?? 203) as 203 | 840 | 978,
              )}
            </span>
          </div>
          <div className='flex justify-between font-medium'>
            <span>Tổng báo giá:</span>
            <span>
              {formatCurrency(
                totalQuotationAmount ?? 0,
                (currencyQuotes ?? 203) as 203 | 840 | 978,
              )}
            </span>
          </div>
          <div className='flex justify-between font-medium'>
            <span>Tổng phát sinh:</span>
            <span>
              {formatCurrency(
                totalVariationAmount ?? 0,
                (currencyQuotes ?? 203) as 203 | 840 | 978,
              )}
            </span>
          </div>
          <div className='flex justify-between font-medium'>
            <span>Tổng dự án:</span>
            <span>
              {formatCurrency(
                totalAmount ?? 0,
                (currencyQuotes ?? 203) as 203 | 840 | 978,
              )}
            </span>
          </div>
        </div>
      </div>

      <ModalToggle
        isOpen={
          isModalOpen && (modalType === 'deposited' || modalType === 'payment')
        }
        onClose={() => {
          setModalOpen(false)
          // Reset toàn bộ selected object khi đóng modal
          setSelectedDeposited(null)
          setSelectedPayment(null)
        }}
        title={
          modalType === 'deposited'
            ? selectedDeposited
              ? 'Chỉnh sửa đặt cọc'
              : 'Thêm đặt cọc'
            : modalType === 'payment'
            ? selectedPayment
              ? 'Chỉnh sửa thanh toán'
              : 'Thêm thanh toán'
            : ''
        }
      >
        <div onClick={e => e.stopPropagation()}>
          <div className='p-4'>
            {modalType === 'payment' && (
              <GenericForm<IQuotation>
                initialData={selectedPayment ?? undefined}
                fields={paymentFormFields}
                onSubmitApi={handleSubmitPayment}
                onSuccess={() => {
                  setModalOpen(false)
                  setSelectedPayment(null)
                }}
              />
            )}
            {modalType === 'deposited' && (
              <GenericForm<IQuotation>
                initialData={selectedDeposited ?? undefined}
                fields={paymentFormFields}
                onSubmitApi={handleSubmitDeposit}
                onSuccess={() => {
                  setModalOpen(false)
                  setSelectedDeposited(null)
                }}
              />
            )}
          </div>
        </div>
      </ModalToggle>
    </div>
  )
}

export default ProjectInfoCard
