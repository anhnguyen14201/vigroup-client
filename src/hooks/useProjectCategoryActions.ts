'use client'

import { useCallback } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'

import {
  apiCreateProjectType,
  apiDeleteProjectType,
  apiUpdateProjectType,
} from '@/api'
import { AppDispatch } from '@/redux/redux'
import { setLoading } from '@/redux'
import nProgress from 'nprogress'
import { mutate } from 'swr'

export default function useProjectCategoryActions({
  setModalOpen,
  setSelected,
  languages,
}: any) {
  const dispatch = useDispatch<AppDispatch>()

  const handleEdit = (projC: any) => {
    setSelected(projC)
    setModalOpen(true)
  }

  // Xóa một "Project Type"
  const handleDelete = useCallback(
    async (projectType: any) => {
      dispatch(setLoading({ key: 'DeleteProjects', value: true }))
      nProgress.start()

      try {
        const { data } = await apiDeleteProjectType(projectType._id)
        if (!data.success) throw new Error(data.message)
        mutate('/project-type')
        toast.success('Xóa thành công!')
      } catch (err: any) {
        toast.error(err.response?.data?.message || err.message)
      } finally {
        dispatch(setLoading({ key: 'DeleteProjects', value: false }))
        nProgress.done()
      }
    },
    [dispatch],
  )

  // Xóa hàng loạt "Project Types"
  const handleDeleteBulk = useCallback(
    async (projectTypes: any[]) => {
      if (!projectTypes.length) return
      if (!confirm(`Bạn có chắc chắn muốn xóa ${projectTypes.length} mục?`))
        return

      dispatch(setLoading({ key: 'DeleteProjectsBulk', value: true }))
      nProgress.start()

      try {
        await Promise.all(projectTypes.map(pt => apiDeleteProjectType(pt._id)))
        mutate('/project-type')
        toast.success('Xóa nhóm thành công!')
      } catch (err: any) {
        toast.error(err.response?.data?.message || err.message)
      } finally {
        dispatch(setLoading({ key: 'DeleteProjectsBulk', value: false }))
        nProgress.done()
      }
    },
    [dispatch],
  )

  // Tạo/Sửa "Project Type"
  const handleSubmit = useCallback(
    async (values: any, selected: any) => {
      dispatch(setLoading({ key: 'UpdateProject', value: true }))
      nProgress.start()

      // Xây dựng mảng translations từ form values
      const translations = (Array.isArray(languages) ? languages : []).map(
        lang => ({
          language: lang._id,
          name: values[`name_${lang.code}`] || '',
          metaTitle: values[`metaTitle_${lang.code}`] || '',
          metaDescription: values[`metaDescription_${lang.code}`] || '',
        }),
      )

      const body = { translations }

      try {
        if (selected) {
          await apiUpdateProjectType(body, selected._id)
          toast.success('Sửa thành công!')
        } else {
          await apiCreateProjectType(body)
          toast.success('Thêm thành công!')
        }
        mutate('/project-type')
        setModalOpen(false)
      } catch (err: any) {
        toast.error(
          err.response?.data?.message || err.message || 'Có lỗi khi submit',
        )
      } finally {
        dispatch(setLoading({ key: 'UpdateProject', value: false }))
        nProgress.done()
      }
    },
    [dispatch, languages, setModalOpen],
  )

  return {
    handleDelete,
    handleDeleteBulk,
    handleSubmit,
    handleEdit,
  }
}
