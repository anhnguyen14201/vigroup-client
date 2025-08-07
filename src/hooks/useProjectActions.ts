'use client'

import { useCallback } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'

import { apiCreateProject, apiDeleteProject, apiUpdateProject } from '@/api'
import { AppDispatch } from '@/redux/redux'
import { setLoading } from '@/redux'
import nProgress from 'nprogress'

export default function useProjectActions({
  languages,
  setModalOpen,
  setSelected,
  router,
  projectsData,
  debouncedValue,
  mutate,
}: any) {
  const dispatch = useDispatch<AppDispatch>()

  const handleEdit = (proj: any) => {
    setSelected(proj)
    setModalOpen(true)
  }

  // Chuyển hướng đến trang chi tiết dự án
  const handleInfor = async (proj: any) => {
    nProgress.start()
    try {
      // Với App Router, router.push() trả về void; chờ render xong
      await Promise.resolve()
      router.push(`/admin/projects/${proj._id}`)
    } finally {
      // Đảm bảo luôn dừng tiến trình, dù router.push ném lỗi hay không
      nProgress.done()
    }
  }

  // Xóa một dự án
  const handleDelete = useCallback(
    async (proj: any) => {
      dispatch(setLoading({ key: 'DeleteProjects', value: true }))
      nProgress.start()

      try {
        const { data } = await apiDeleteProject(proj._id)
        if (!data.success) throw new Error(data.message)

        toast.success('Xóa thành công!')
        mutate()
      } catch (err: any) {
        toast.error(err.response?.data?.message || err.message)
      } finally {
        dispatch(setLoading({ key: 'DeleteProjects', value: false }))
        nProgress.done()
      }
    },
    [dispatch, projectsData, debouncedValue],
  )

  // Xóa hàng loạt dự án
  const handleDeleteBulk = useCallback(
    async (projs: any[]) => {
      if (!projs.length) return
      if (!confirm(`Bạn có chắc chắn muốn xóa ${projs.length} dự án?`)) return

      dispatch(setLoading({ key: 'DeleteProjectsBulk', value: true }))
      nProgress.start()

      try {
        await Promise.all(projs.map(u => apiDeleteProject(u._id)))
        toast.success('Xóa nhóm thành công!')
        mutate()
      } catch {
        toast.error('Có lỗi xảy ra')
      } finally {
        dispatch(setLoading({ key: 'DeleteProjectsBulk', value: false }))
        nProgress.done()
      }
    },
    [dispatch, projectsData, debouncedValue],
  )

  // Tạo/Sửa dự án
  const handleSubmit = useCallback(
    async (values: any, selected: any) => {
      dispatch(setLoading({ key: 'UpdateProject', value: true }))
      nProgress.start()

      // 1. Xây dựng mảng translations dựa trên languages
      const translations = (Array.isArray(languages) ? languages : []).map(
        lang => ({
          language: lang._id,
          projectName: values[`projectName_${lang.code}`] || '',
          buildingType: values[`buildingType_${lang.code}`] || '',
          description: values[`description_${lang.code}`] || '',
          metaDescription: values[`metaDescription_${lang.code}`] || '',
        }),
      )

      // 2. Kiểm tra xem có file thumbnail / images không
      const hasThumbnailFile = values.thumbnail instanceof File
      const hasImagesFiles =
        Array.isArray(values.images) &&
        values.images.length > 0 &&
        values.images.every((f: any) => f instanceof File)

      let responseData: any = null

      try {
        if (hasThumbnailFile || hasImagesFiles) {
          // Sử dụng FormData khi có file upload
          const formData = new FormData()
          formData.append('kind', 'project')
          formData.append('code', values.code)
          formData.append('location', values.location)
          formData.append('projectType', values.projectType)
          formData.append('showProject', values.showProject)
          formData.append(
            'removedImageUrls',
            JSON.stringify(values.removedImageUrls),
          )
          formData.append('translations', JSON.stringify(translations))

          if (hasThumbnailFile) {
            formData.append('thumbnail', values.thumbnail)
          }
          if (hasImagesFiles) {
            ;(values.images as File[]).forEach(file => {
              formData.append('images', file)
            })
          }

          responseData = selected
            ? await apiUpdateProject(formData, selected._id)
            : await apiCreateProject(formData)
        } else {
          // Gửi dữ liệu ở dạng JSON nếu không có file
          const body: any = {
            kind: 'project',
            code: values.code,
            location: values.location,
            projectType: values.projectType,
            showProject: values.showProject,
            removedImageUrls: values.removedImageUrls || [],
            translations,
          }

          responseData = selected
            ? await apiUpdateProject(body, selected._id)
            : await apiCreateProject(body)
        }

        if (responseData?.data?.success) {
          toast.success(selected ? 'Sửa thành công!' : 'Thêm thành công!')
        } else {
          throw new Error(responseData?.data?.message || 'Lỗi API')
        }

        setModalOpen(false)
        mutate()
      } catch {
        toast.error('Có lỗi khi submit')
      } finally {
        dispatch(setLoading({ key: 'UpdateProject', value: false }))
        nProgress.done()
      }
    },
    [dispatch, debouncedValue, languages, setModalOpen],
  )

  return {
    handleDelete,
    handleDeleteBulk,
    handleSubmit,
    handleEdit,
    handleInfor,
  }
}
