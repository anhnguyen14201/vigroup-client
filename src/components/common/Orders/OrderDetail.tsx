'use client'

import {
  apiCreateInvoice,
  apiCreateQuote,
  apiUpdateOrderPdfUrl,
  apiUpdateOrderStatus,
} from '@/api'
import { statusProjectClasses, statusProjectLabels } from '@/constants'
import {
  useInforCompany,
  useLogos,
  useOrderById,
  usePrivateInfor,
} from '@/hooks'
import { formatCurrency } from '@/utils'
import { useParams } from 'next/navigation'
import nProgress from 'nprogress'
import React, { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import countryList from 'react-select-country-list'

const OrderDetail = () => {
  const { id } = useParams()
  const countryOptions = countryList().getData()

  const { items: logos } = useLogos()
  const { items: inforCompany } = useInforCompany()
  const { items: infor } = usePrivateInfor()

  const filterLogo = logos?.filter((slide: any) => slide?.activity)

  type InforCompanyType = { _id: string; isActive: boolean; [key: string]: any }
  const filterInforCompany = (inforCompany as InforCompanyType[])?.filter(
    (info: InforCompanyType) => info.isActive,
  )
  const logoDark = filterLogo?.find((lg: any) => lg?.logoType === 'logoBlack')

  const orderId = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : ''
  const { data: orderData, mutate } = useOrderById(orderId)

  const [status, setStatus] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  const [loadingCancel, setLoadingCancel] = useState(false)
  const [loadingAccept, setLoadingAccept] = useState(false)
  const [loadingQuote, setLoadingQuote] = useState(false)
  const [loadingInvoiceBank, setLoadingInvoiceBank] = useState(false)
  const [loadingInvoiceCash, setLoadingInvoiceCash] = useState(false)

  const raw = orderData?.createdAt as string
  const date = new Date(raw)
  let formattedDate
  if (orderData) {
    formattedDate = new Intl.DateTimeFormat('cs-CZ', {
      timeZone: 'Europe/Prague',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date)
  }

  const pdfData = useMemo(
    () => ({
      infor: infor.map((i: any) => ({ _id: i._id })),
      logoUrl: logoDark?.imageUrls[0] || '',
      supplier: filterInforCompany[0]?._id || '',
      // Gửi nguyên object thay vì chỉ ID
      customer: {
        ...orderData?.personalInfo,
        ...orderData?.companyInfo,
      },
      installations: [],
      fuels: [],
      shippingCost: orderData?.shippingCost,
      products:
        orderData?.cartItems?.map((item: any) => ({
          product: item.productId._id,
          quantity: item.quantity,
        })) || [],
      status,
    }),
    [infor, logoDark, filterInforCompany, orderData, status],
  )

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true)
    try {
      await apiUpdateOrderStatus({ orderId: id, status: newStatus })
      setStatus(newStatus)
      mutate() // refresh list cache
      if (newStatus === 'Cancelled') {
        toast.success('Hủy đơn hàng thành công!')
      } else if (newStatus === 'Successed') {
        toast.success('Xác nhận đơn hàng thành công!')
      }
    } catch (err: any) {
      toast.error(err?.message || 'Cập nhật trạng thái thất bại')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleCancelOrder = async () => {
    if (window.confirm('Bạn có muốn hủy đơn hàng này không?')) {
      setLoadingCancel(true)
      nProgress.start()
      try {
        await handleStatusChange('Cancelled')
      } finally {
        setLoadingCancel(false)
        nProgress.done()
      }
    }
  }

  const handleAcceptOrder = async () => {
    setLoadingAccept(true)
    nProgress.start()
    try {
      await handleStatusChange('Successed')
    } finally {
      setLoadingAccept(false)
      nProgress.done()
    }
  }

  const handleSaveQuote = async () => {
    setLoadingQuote(true)
    nProgress.start()

    try {
      const payload = {
        ...pdfData,
        status: 'quote',
      }
      const response = await apiCreateQuote(payload)
      if (response) {
        await apiUpdateOrderPdfUrl({ pdfUrl: response.data.pdfUrl }, orderId)
        mutate()
      }
      toast.success('Báo giá đã được tạo thành công')
    } catch {
      toast.error('Tạo PDF thất bại')
    } finally {
      setLoadingQuote(false)
      nProgress.done()
    }
  }

  const handleCreateInvoiceBank = async () => {
    setLoadingInvoiceBank(true)
    nProgress.start()

    try {
      const payload = {
        ...pdfData,
        status: 'invoice',
        statusPayment: 'Převodem',
      }

      const response = await apiCreateInvoice(payload)
      if (response) {
        await apiUpdateOrderPdfUrl({ pdfUrl: response.data.pdfUrl }, orderId)
        mutate()
      }
      toast.success('Hóa đơn đã được tạo thành công')
    } catch {
      toast.error('Tạo PDF thất bại')
    } finally {
      setLoadingInvoiceBank(false)
      nProgress.done()
    }
  }
  const handleCreateInvoiceCash = async () => {
    setLoadingInvoiceCash(true)

    nProgress.start()

    try {
      const payload = {
        ...pdfData,
        status: 'invoice',
        statusPayment: 'Hotově',
      }

      const response = await apiCreateInvoice(payload)
      if (response) {
        await apiUpdateOrderPdfUrl({ pdfUrl: response.data.pdfUrl }, orderId)
        mutate()
      }
      toast.success('Hóa đơn đã được tạo thành công')
    } catch {
      toast.error('Tạo PDF thất bại')
    } finally {
      setLoadingInvoiceCash(false)

      nProgress.done()
    }
  }

  const label = statusProjectLabels[status.toLowerCase()] || status

  const handleShow = (inv: any) => {
    if (inv) {
      // Mở PDF trong tab mới
      window.open(inv, '_blank')
    } else {
      toast.error('Không tìm thấy đường dẫn PDF')
    }
  }

  useEffect(() => {
    if (orderData?.status) {
      setStatus(orderData.status)
    }
  }, [orderData?.status])

  return (
    <div className='w-full mx-auto p-5 min-h-screen'>
      <div className='bg-white rounded-lg'>
        <div className='flex items-center justify-between mb-6'>
          <h1 className='text-2xl font-bold text-gray-800'>
            Chi tiết đơn hàng
          </h1>
        </div>

        {/* Action Buttons */}
        <div className='flex space-x-4 mb-6'>
          {
            <>
              <button
                type='button'
                aria-label='seeMore'
                onClick={handleCancelOrder}
                className={`px-6 py-2 rounded-lg transition-colors duration-300 font-semibold ${
                  status === 'Cancelled' || status === 'Successed' || isUpdating
                    ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                    : 'bg-red-100 text-red-600 hover:bg-red-200 border-1 border-red-500 cursor-pointer '
                }`}
                disabled={
                  status === 'Cancelled' ||
                  status === 'Successed' ||
                  loadingCancel ||
                  isUpdating
                }
              >
                {loadingCancel ? 'Đang hủy đơn hàng...' : 'Hủy đơn hàng'}
              </button>
              <button
                type='button'
                aria-label='seeMore'
                onClick={handleAcceptOrder}
                className={`px-6 py-2 rounded-lg transition-colors duration-300 font-semibold ${
                  status === 'Cancelled' || status === 'Successed' || isUpdating
                    ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                    : 'bg-green-100 text-green-600 hover:bg-green-200 border-1 border-green-500 cursor-pointer '
                }`}
                disabled={
                  status === 'Cancelled' ||
                  status === 'Successed' ||
                  loadingAccept ||
                  isUpdating
                }
              >
                {loadingAccept
                  ? 'Đang xác nhận đơn hàng...'
                  : 'Xác nhận đơn hàng'}
              </button>
            </>
          }
          {!orderData?.pdfUrl && status === 'Successed' && (
            <>
              <button
                type='button'
                aria-label='seeMore'
                onClick={handleSaveQuote}
                disabled={isUpdating}
                className='px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-600 rounded-lg transition
                              cursor-pointer border-1 border-indigo-500 font-semibold'
              >
                {loadingQuote ? 'Đang lưu báo giá...' : 'Lưu báo giá'}
              </button>
              <button
                type='button'
                aria-label='seeMore'
                onClick={handleCreateInvoiceBank}
                disabled={isUpdating}
                className='px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-500 font-semibold rounded-lg 
                              cursor-pointer border-1 border-blue-500 transition'
              >
                {loadingInvoiceBank
                  ? 'Đang lưu hóa đơn chuyển khoản...'
                  : 'Hóa đơn chuyển khoản'}
              </button>
              <button
                type='button'
                aria-label='seeMore'
                onClick={handleCreateInvoiceCash}
                disabled={isUpdating}
                className='px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-600 rounded-lg transition
                              cursor-pointer border-1 border-yellow-500 font-semibold'
              >
                {loadingInvoiceCash
                  ? 'Đang lưu hóa đơn tiền mặt...'
                  : 'Hóa đơn tiền mặt'}
              </button>
            </>
          )}
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Left Section */}
          <div className='lg:col-span-2'>
            <div className='mb-4 grid lg:grid-cols-3'>
              <div className='lg:col-span-2'>
                <p className='text-gray-600'>
                  <span className='font-medium'>Mã đơn:</span> {orderId}
                </p>
                <p className='text-gray-600'>
                  <span className='font-medium'>Ngày đặt:</span> {formattedDate}
                </p>
                <p className='text-gray-600'>
                  <span className='font-medium'>Khách hàng:</span>{' '}
                  {orderData?.companyInfo?.companyName ||
                    orderData?.personalInfo?.fullName}
                </p>
                <p className='text-gray-600'>
                  <span className='font-medium'>Email:&nbsp;</span>
                  {`${orderData?.personalInfo?.email} `}
                </p>
                <p className='text-gray-600'>
                  <span className='font-medium'>Số điện thoại:&nbsp;</span>
                  {`${orderData?.personalInfo?.phone} `}
                </p>
                <p className='text-gray-600'>
                  <span className='font-medium'>Địa chỉ giao hàng:&nbsp;</span>
                  {`${orderData?.personalInfo?.street} ${orderData?.personalInfo?.postalCode} ${orderData?.personalInfo?.province}`}
                </p>
                <div className='flex gap-20'>
                  <p className='text-gray-600'>
                    <span className='font-medium'>IČO:</span>{' '}
                    {orderData?.companyInfo?.ico}
                  </p>

                  <p className='text-gray-600'>
                    <span className='font-medium'>DIČ:</span>{' '}
                    {orderData?.companyInfo?.dic}
                  </p>
                </div>
              </div>

              <div className='lg:col-span-1'>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    statusProjectClasses[status.toLowerCase()]
                  }`}
                >
                  {label}
                </span>
              </div>
            </div>
            <div className='overflow-x-auto bg-white border rounded-lg'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-100'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                      Sản phẩm
                    </th>
                    <th className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase'>
                      SL
                    </th>
                    <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase'>
                      Đơn giá
                    </th>
                    <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase'>
                      Thành tiền
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {orderData?.cartItems?.map((item: any, idx: number) => {
                    const price = item?.productId.discount
                      ? item?.productId.discount
                      : item?.productId.price

                    const totalPrice = item.quantity * price
                    return (
                      <tr key={idx} className='hover:bg-gray-50'>
                        <td className='px-6 py-4 flex items-center gap-4'>
                          <img
                            src={item.productId.thumbnailUrls[0]}
                            alt={item.name}
                            className='w-fit h-12 object-cover rounded'
                          />
                          <span className='text-gray-700 font-medium'>
                            {item?.productId?.translations[0].productName}
                          </span>
                        </td>
                        <td className='px-6 py-4 text-center text-gray-600'>
                          {item.quantity}
                        </td>
                        <td className='px-6 py-4 text-right text-gray-600'>
                          {formatCurrency(price, 203)}
                        </td>
                        <td className='px-6 py-4 text-right text-gray-800 font-semibold'>
                          {formatCurrency(totalPrice, 203)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
          {/* Right Section */}
          <div className='bg-gray-50 p-4 rounded-lg shadow-inner'>
            <h2 className='text-lg font-semibold text-gray-800 mb-4'>
              Tóm tắt thanh toán
            </h2>
            <div className='space-y-2 text-gray-600'>
              <div className='flex justify-between'>
                <span>Tạm tính:</span>
                <span>{formatCurrency(orderData?.total, 203)}</span>
              </div>
              <div className='flex justify-between'>
                <span>Vận chuyển ({orderData?.shippingMethod}):</span>
                <span>{formatCurrency(orderData?.shippingCost, 203)}</span>
              </div>
              <div className='border-t pt-2 flex justify-between font-semibold text-gray-800'>
                <span>Tổng cộng:</span>
                <span>
                  {formatCurrency(
                    orderData?.total + orderData?.shippingCost,
                    203,
                  )}
                </span>
              </div>
            </div>
            {orderData?.pdfUrl && (
              <button
                type='button'
                aria-label='seeMore'
                onClick={() => handleShow(orderData?.pdfUrl)}
                className='mt-6 w-full bg-blue-100 hover:bg-blue-200 text-blue-600 py-3 rounded-lg font-medium 
                          cursor-pointer transition-colors border-1 border-blue-500'
              >
                In đơn hàng
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetail
