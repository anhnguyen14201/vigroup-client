'use client'

import { useCallback } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'

import { apiDeleteUser, apiRegister, apiUpdateUser } from '@/api'
import { AppDispatch } from '@/redux/redux'
import { setLoading } from '@/redux'
import nProgress from 'nprogress'

export default function useUserActions({
  setModalOpen,
  setSelectedUser,
  userDatas,
  router,
  mutate,
}: any) {
  const dispatch = useDispatch<AppDispatch>()

  const handleInfor = (i: any) => {
    nProgress.start()
    router.push(`/admin/employees/${i.employeeId}`)
    nProgress.done()
  }

  const handleEdit = (user: any) => {
    setSelectedUser(user)
    setModalOpen(true)
  }

  const handleDelete = useCallback(
    async (user: any) => {
      dispatch(setLoading({ key: 'DeleteUser', value: true }))
      nProgress.start()

      try {
        const { data } = await apiDeleteUser(user.employeeId || user._id)
        if (!data.success) throw new Error(data.message)
        toast.success('Xóa thành công!')
        await mutate()
      } catch {
        /*         toast.error(err.response?.data?.message || err.message)
         */
      } finally {
        dispatch(setLoading({ key: 'DeleteUser', value: false }))
        nProgress.done()
      }
    },
    [dispatch, userDatas],
  )

  const handleDeleteBulk = useCallback(
    async (users: any[]) => {
      if (!users.length) return
      if (!confirm(`Bạn có chắc chắn muốn xóa ${users.length} người dùng?`))
        return
      dispatch(setLoading({ key: 'DeleteUserBulk', value: true }))
      nProgress.start()

      try {
        await Promise.all(users.map(u => apiDeleteUser(u.employeeId || u._id)))
        toast.success('Xóa nhóm thành công!')

        await mutate()
      } catch (err: any) {
        toast.error(err.response?.data?.message || err.message)
      } finally {
        dispatch(setLoading({ key: 'DeleteUserBulk', value: false }))
        nProgress.done()
      }
    },
    [dispatch, userDatas],
  )

  const handleSubmit = useCallback(
    async (payload: any, selectedUser: any) => {
      dispatch(setLoading({ key: 'UpdateUser', value: true }))
      nProgress.start()

      try {
        // gọi API và lấy về response

        const response = selectedUser
          ? await apiUpdateUser(
              payload,
              selectedUser.employeeId || selectedUser._id,
            )
          : await apiRegister(payload)

        // response.data là nơi axios trả body
        if (response.data?.success) {
          toast.success(selectedUser ? 'Sửa thành công!' : 'Thêm thành công!')
          setModalOpen(false)
          await mutate() // revalidate lại data
        } else {
          // nếu API trả về success = false
          throw new Error(response.data?.message || 'Lỗi API')
        }
      } catch (err: any) {
        const message =
          err.response?.data?.message || err.message || 'Có lỗi khi submit'
        toast.error(message)
      } finally {
        dispatch(setLoading({ key: 'UpdateUser', value: false }))
        nProgress.done()
      }
    },
    [dispatch, mutate, setModalOpen],
  )

  return {
    handleDelete,
    handleDeleteBulk,
    handleSubmit,
    handleEdit,
    handleInfor,
  }
}
