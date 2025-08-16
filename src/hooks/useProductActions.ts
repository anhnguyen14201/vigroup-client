'use client'

import { useCallback } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'

import { apiCreateProduct, apiDeleteProduct, apiUpdateProduct } from '@/api'
import { AppDispatch } from '@/redux/redux'
import { setLoading } from '@/redux'
import nProgress from 'nprogress'
import { mutate } from 'swr'

interface UseProductActionsProps {
  languages: any
  isModalOpen: boolean
  setModalOpen: (open: boolean) => void
  productDatas: any[]
  mutate?: any
}

export default function useProductActions({
  languages,
  setModalOpen,
  productDatas,
  mutate,
}: UseProductActionsProps) {
  const dispatch = useDispatch<AppDispatch>()

  // Xóa một sản phẩm (Product)
  const handleDelete = useCallback(
    async (product: any) => {
      dispatch(setLoading({ key: 'DeleteProducts', value: true }))
      nProgress.start()

      try {
        const { data } = await apiDeleteProduct(product._id)
        if (!data.success) throw new Error(data.message)

        toast.success('Xóa thành công!')
        await mutate()

        // Nếu danh sách sản phẩm chỉ còn 1 và có trang trước, chuyển về trang trước
      } catch (err: any) {
        toast.error(err.response?.data?.message || err.message)
      } finally {
        dispatch(setLoading({ key: 'DeleteProducts', value: false }))
        nProgress.done()
      }
    },
    [dispatch, productDatas],
  )

  // Xóa hàng loạt sản phẩm
  const handleDeleteBulk = useCallback(
    async (products: any[]) => {
      if (!products.length) return
      if (!confirm(`Bạn có chắc chắn muốn xóa ${products.length} sản phẩm?`))
        return

      dispatch(setLoading({ key: 'DeleteProductsBulk', value: true }))
      nProgress.start()

      try {
        await Promise.all(products.map(p => apiDeleteProduct(p._id)))
        toast.success('Xóa nhóm thành công!')
        await mutate()
      } catch (err: any) {
        toast.error(err.response?.data?.message || err.message)
      } finally {
        dispatch(setLoading({ key: 'DeleteProductsBulk', value: false }))
        nProgress.done()
      }
    },
    [dispatch, productDatas],
  )

  // Submit (Tạo/Sửa) sản phẩm
  const handleSubmit = useCallback(
    async (values: any, selected: any) => {
      dispatch(setLoading({ key: 'UpdateProducts', value: true }))
      nProgress.start()

      // 1. Xây dựng mảng translations dựa trên languages
      const translations = (Array.isArray(languages) ? languages : []).map(
        lang => ({
          language: lang._id,
          productName: values[`productName_${lang.code}`] || '',
          shortDesc: values[`shortDesc_${lang.code}`] || '',
          desc: values[`desc_${lang.code}`] || '',
          specifications: values[`specifications_${lang.code}`] || '',
          metaDescription: values[`metaDescription_${lang.code}`] || '',
        }),
      )

      // 2. Kiểm tra sự tồn tại của file thumbnail và images
      const hasThumbnailFile = values.thumbnail instanceof File
      const hasImagesFiles =
        Array.isArray(values.images) &&
        values.images.length > 0 &&
        values.images.every((f: any) => f instanceof File)

      let responseData: any = null

      try {
        if (hasThumbnailFile || hasImagesFiles) {
          // Sử dụng FormData nếu có file upload
          const formData = new FormData()
          // Các trường chính (non-i18n)
          formData.append('code', values.code)
          formData.append('cost', values.cost)
          formData.append('price', values.price)
          formData.append('tax', values.tax)
          formData.append('discount', values.discount)
          formData.append('categoryIds', values.categoryIds)
          formData.append('brandIds', values.brandIds)
          formData.append('quantity', values.quantity || 0)
          formData.append(
            'removedImageUrls',
            JSON.stringify(values.removedImageUrls),
          )
          formData.append('isFeatured', JSON.stringify(values.isFeatured))
          formData.append('isNewArrival', JSON.stringify(values.isNewArrival))
          // Gửi translations dưới dạng JSON string
          formData.append('translations', JSON.stringify(translations))

          // Thêm thumbnail nếu có
          if (hasThumbnailFile) {
            formData.append('thumbnail', values.thumbnail)
          }

          // Thêm images nếu có
          if (hasImagesFiles) {
            ;(values.images as File[]).forEach(file => {
              formData.append('images', file)
            })
          }

          // Gọi API dùng FormData
          responseData = selected
            ? await apiUpdateProduct(formData, selected._id)
            : await apiCreateProduct(formData)
        } else {
          // Nếu không có file, gửi JSON
          const body: any = {
            code: values.code,
            cost: values.cost,
            price: values.price,
            tax: values.tax,
            discount: values.discount,
            quantity: values.quantity || 0,
            isFeatured: values.isFeatured,
            isNewArrival: values.isNewArrival,
            categoryIds: values.categoryIds,
            brandIds: values.brandIds,
            removedImageUrls: values.removedImageUrls || [],
            translations,
          }

          responseData = selected
            ? await apiUpdateProduct(body, selected._id)
            : await apiCreateProduct(body)
        }

        if (responseData?.data?.success) {
          toast.success(selected ? 'Sửa thành công!' : 'Thêm thành công!')
          await mutate()
        } else {
          throw new Error(responseData?.data?.message || 'Lỗi API')
        }

        setModalOpen(false)
      } catch (err: any) {
        toast.error(
          err.response?.data?.message || err.message || 'Có lỗi khi submit',
        )
      } finally {
        dispatch(setLoading({ key: 'UpdateProducts', value: false }))
        nProgress.done()
      }
    },
    [dispatch, languages, setModalOpen],
  )

  return { handleDelete, handleDeleteBulk, handleSubmit }
}
