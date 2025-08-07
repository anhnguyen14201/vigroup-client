'use client'

import { useCallback } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'

import {
  apiCreateDeposit,
  apiCreatePayment,
  apiDeleteDeposit,
  apiDeletePayment,
} from '@/api'
import { AppDispatch } from '@/redux/redux'
import { setLoading } from '@/redux'
import nProgress from 'nprogress'
import { useProjectById } from '@/hooks/useFetchData'

export default function usePaymentStatusCardActions({
  setModalOpen,
  id,
  setSelectedPayment,
}: any) {
  const dispatch = useDispatch<AppDispatch>()
  const projectId = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : ''
  const { mutate } = useProjectById(projectId)
  // Hàm submit thanh toán cho đợt thanh toán
  const handleSubmitPayment = useCallback(
    async (payload: any) => {
      dispatch(setLoading({ key: 'submitPayment', value: true }))
      nProgress.start()

      try {
        await apiCreatePayment(id, payload)
        toast.success('Thanh toán thành công')
        setModalOpen(false)
        setSelectedPayment(null)
        await mutate()
      } catch {
        toast.error('Có lỗi khi submit')
      } finally {
        dispatch(setLoading({ key: 'submitPayment', value: false }))
        nProgress.done()
      }
    },
    [dispatch, id, setModalOpen, setSelectedPayment, mutate],
  )

  // Hàm submit thanh toán đặt cọc
  const handleSubmitDeposit = useCallback(
    async (payload: any) => {
      dispatch(setLoading({ key: 'submitDeposit', value: true }))
      nProgress.start()

      try {
        await apiCreateDeposit(id, payload)
        toast.success('Thanh toán thành công')
        setModalOpen(false)
        setSelectedPayment(null)
        await mutate()
      } catch {
        toast.error('Có lỗi khi submit')
      } finally {
        dispatch(setLoading({ key: 'submitDeposit', value: false }))
        nProgress.done()
      }
    },
    [dispatch, id, setModalOpen, setSelectedPayment],
  )

  // Hàm xóa tiền đặt cọc
  const handleDeleteDeposit = useCallback(async () => {
    const confirmed = window.confirm(
      'Bạn có chắc chắn muốn xóa tiền đặt cọc không?',
    )
    if (!confirmed) return

    dispatch(setLoading({ key: 'deleteDeposit', value: true }))
    nProgress.start()

    try {
      await apiDeleteDeposit(id)
      toast.success('Xóa tiền đặt cọc thành công')
      await mutate()
    } catch {
      toast.error('Có lỗi xảy ra khi xóa tiền đặt cọc')
    } finally {
      dispatch(setLoading({ key: 'deleteDeposit', value: false }))
      nProgress.done()
    }
  }, [dispatch, id])

  // Hàm xóa một đợt thanh toán cụ thể
  const handleDeletePayment = useCallback(
    async (data: any) => {
      const confirmed = window.confirm(
        `Bạn có chắc chắn muốn xóa thanh toán đợt ${data.index + 1} không?`,
      )
      if (!confirmed) return

      dispatch(setLoading({ key: 'deletePayment', value: true }))
      nProgress.start()

      try {
        await apiDeletePayment(id, data)
        toast.success(`Xóa tiền thanh toán đợt ${data.index + 1} thành công`)
        await mutate()
      } catch {
        toast.error('Có lỗi xảy ra khi xóa thanh toán')
      } finally {
        dispatch(setLoading({ key: 'deletePayment', value: false }))
        nProgress.done()
      }
    },
    [dispatch, id],
  )

  return {
    handleSubmitPayment,
    handleSubmitDeposit,
    handleDeleteDeposit,
    handleDeletePayment,
  }
}
