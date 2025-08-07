'use client'

import { useCallback } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'

import { apiAddCustomer, apiDeleteUserInProject } from '@/api'
import { AppDispatch } from '@/redux/redux'
import { setLoading } from '@/redux'
import nProgress from 'nprogress'

export default function useCustomerInfoCardActions({
  setModalOpen,
  projectId,
  mutate,
}: any) {
  const dispatch = useDispatch<AppDispatch>()

  const handleAdd = useCallback(
    async (user: any) => {
      if (!projectId || !user?._id) return

      dispatch(setLoading({ key: 'apiAddCustomer', value: true }))
      nProgress.start()

      try {
        const { data } = await apiAddCustomer({
          projectId: projectId,
          userId: user._id,
        })

        if (data.success) {
          toast.success(data.message || 'Thêm khách hàng vào dự án thành công')
          await mutate()
        } else {
          toast.error(data.message || 'Người dùng đã được thêm trước đó')
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || err.message)
      } finally {
        dispatch(setLoading({ key: 'apiAddCustomer', value: false }))
        nProgress.done()
        setModalOpen(false)
      }
    },
    [dispatch, projectId, setModalOpen],
  )

  const onDeleteCustomer = useCallback(
    async (user: any) => {
      if (!projectId || !user) return

      if (!window.confirm('Bạn có chắc muốn xóa người dùng này khỏi dự án?')) {
        return
      }

      dispatch(setLoading({ key: 'apiDeleteUser', value: true }))
      nProgress.start()

      try {
        const { data } = await apiDeleteUserInProject(projectId, user)
        if (data.success) {
          toast.success(data.message || 'Xóa khách hàng khỏi dự án thành công')
          await mutate()
        } else {
          toast.error(data.message || 'Có lỗi xảy ra')
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || err.message)
      } finally {
        dispatch(setLoading({ key: 'apiDeleteUser', value: false }))
        nProgress.done()
        setModalOpen(false)
      }
    },
    [dispatch, projectId, setModalOpen],
  )

  return {
    handleAdd,
    onDeleteCustomer,
  }
}
