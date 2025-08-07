'use client'
import { useTranslations } from 'next-intl'
import React from 'react'

import DataTable from '@/components/common/DataTable'
import CalendarClient from '@/components/common/Project/CalendarClient'
import {
  paymentStatusClasses,
  paymentStatusLabels,
  quotationClientColumns,
  statusProjectClasses,
} from '@/constants'
import { formatCurrency } from '@/utils'

const ProjectDetailClient = (data: any) => {
  const t = useTranslations()

  const quotationColumnsData = quotationClientColumns(t)
  const quotations = data.data.quotes?.filter(
    (item: any) => item.quotationType === 'quotation',
  )

  // Lọc mảng cho báo giá kiểu 'variation'
  const variations = data.data.quotes?.filter(
    (item: any) => item.quotationType === 'variation',
  )

  const classes =
    data.data.paymentStatus && paymentStatusClasses[data.data.paymentStatus]
      ? paymentStatusClasses[data.data.paymentStatus]
      : 'bg-gray-100 text-gray-800 '
  const label = data.data.paymentStatus
    ? paymentStatusLabels[data.data.paymentStatus]
    : ''

  const status = data.data.status

  const labelProject =
    data.data.status === 'processing'
      ? t('order.processing')
      : data.data.status === 'started'
      ? t('projects.started')
      : data.data.status === 'finished'
      ? t('projects.finished')
      : data.data.status === 'cancelled'
      ? t('order.canceled')
      : ''
  const labelPayment =
    data.data.paymentStatus === 'unpaid'
      ? t('projects.unpaid')
      : data.data.paymentStatus === 'deposited'
      ? t('projects.deposited')
      : data.data.paymentStatus === 'partial'
      ? t('projects.partial')
      : data.data.paymentStatus === 'paid'
      ? t('projects.paid')
      : data.data.paymentStatus === 'processing'
      ? t('order.processing')
      : ''

  return (
    <div className='w-full min-h-screen'>
      {/* Header: Thanh điều khiển */}

      {/* Nội dung chính */}
      <div className='space-y-4 '>
        {/* Top Section */}
        <div className='top-section flex flex-wrap gap-4'>
          {/* Left Side */}
          <div className='left-side flex-1 space-y-4'>
            <div className='project-info relative flex-1 p-6 border rounded-lg bg-white'>
              <div className='flex justify-between items-center mb-4'>
                <h2 className='text-xl font-bold'>
                  {t('projects.projectInformation')}
                </h2>
                <span className={statusProjectClasses[status ?? 'default']}>
                  {labelProject}
                </span>
              </div>
              <div className='space-y-1'>
                <div className='flex justify-between'>
                  <p>
                    <strong>{t('projects.projectCode')}:</strong>{' '}
                    {data.data._id}
                  </p>
                </div>
                <p>
                  <strong>{t('order.address')}:</strong> {data.data.location}
                </p>
              </div>
            </div>
            {/* Upper Row: Dự án & Khách hàng */}
            <div className='upper-row flex flex-col md:flex-row gap-4'>
              <div className='space-y-4 border rounded-lg p-6 w-full'>
                {/* Header */}
                <div className='flex justify-between items-center'>
                  <h2 className='text-lg font-semibold'>{t('cart.payment')}</h2>
                  <span className={`${classes} text-sm px-2 py-1 rounded`}>
                    {labelPayment}
                  </span>
                </div>

                {/* Deposit and payments */}
                <div className='space-y-3'>
                  <div className='flex justify-between items-center'>
                    <div className='text-gray-800'>
                      <span className='font-medium'>
                        {t('projects.depositPlaced')}:
                      </span>{' '}
                      {formatCurrency(
                        data.data.depositAmount ?? 0,
                        (data.data.currencyPayment ?? 203) as 203 | 840 | 978,
                      )}
                    </div>
                  </div>

                  {(data.data.paymentAmounts ?? []).map(
                    (amt: any, idx: any) => (
                      <div
                        key={idx}
                        className='flex justify-between items-center'
                      >
                        <div className='text-gray-800'>
                          <span className='font-medium'>
                            {t('projects.totalPhase')} {idx + 1}:
                          </span>{' '}
                          {formatCurrency(
                            amt ?? 0,
                            (data.data.currencyPayment ?? 203) as
                              | 203
                              | 840
                              | 978,
                          )}
                        </div>
                      </div>
                    ),
                  )}
                </div>

                {/* Totals */}
                <div className='border-t pt-3 space-y-2 text-gray-700'>
                  <div className='flex justify-between font-medium'>
                    <span>{t('projects.totalPaid')}:</span>
                    <span>
                      {formatCurrency(
                        data.data.totalReceived ?? 0,
                        (data.data.currencyPayment ?? 203) as 203 | 840 | 978,
                      )}
                    </span>
                  </div>
                  <div className='flex justify-between font-medium border-t pt-3'>
                    <span>{t('projects.totalQuoted')}:</span>
                    <span>
                      {formatCurrency(
                        data.data.totalQuotationAmount ?? 0,
                        (data.data.currencyQuotes ?? 203) as 203 | 840 | 978,
                      )}
                    </span>
                  </div>
                  <div className='flex justify-between font-medium border-t pt-3'>
                    <span>{t('projects.totalExtraCosts')}:</span>
                    <span>
                      {formatCurrency(
                        data.data.totalVariationAmount ?? 0,
                        (data.data.currencyQuotes ?? 203) as 203 | 840 | 978,
                      )}
                    </span>
                  </div>
                  <div className='flex justify-between font-medium border-t pt-3'>
                    <span>{t('projects.totalProjectValue')}:</span>
                    <span>
                      {formatCurrency(
                        data.data.totalAmount ?? 0,
                        (data.data.currencyQuotes ?? 203) as 203 | 840 | 978,
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* Lower Row: Báo giá & Chi phí phát sinh */}
            <div className='lower-row space-y-4'>
              <div className='quotation-info p-6 border rounded-lg bg-white'>
                <div className='flex justify-between items-center'>
                  <h2 className='text-xl font-bold'>
                    {t('projects.quotedPrice')}
                  </h2>
                </div>
                <div>
                  <DataTable
                    data={quotations}
                    columns={quotationColumnsData}
                    showTitle=''
                  />
                </div>
              </div>

              <div className='quotation-info p-6 border rounded-lg bg-white'>
                <div className='flex justify-between items-center'>
                  <h2 className='text-xl font-bold'>
                    {t('projects.extraCosts')}
                  </h2>
                </div>
                <div>
                  <DataTable
                    data={variations}
                    columns={quotationColumnsData}
                    showTitle=''
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='bottom-section p-6 border rounded-lg bg-white'>
          <h2 className='text-xl font-bold mb-4'>
            {t('projects.projectProgress')}
          </h2>
          <div>
            <CalendarClient projectData={data.data} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectDetailClient
