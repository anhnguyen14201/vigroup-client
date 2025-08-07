'use client'

import React, { useCallback, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import nProgress from 'nprogress'

import {
  apiCreateProductBrand,
  apiDeleteProductBrand,
  apiUpdateProductBrand,
} from '@/api'

import {
  FormField,
  ILanguage,
  ProductBrand,
  UseLanguageResult,
} from '@/interface'
import type { AppDispatch } from '@/redux/redux'

import { setLoading } from '@/redux'
import { ModalToggle } from '@/components/modal'
import { GenericForm } from '@/components/common/Forms'
import DataTable from '@/components/common/DataTable'
import { getProductBrandColumns } from '@/constants'
import { useBrands, useLanguage } from '@/hooks'
import { mutate } from 'swr'

const BrandManager = () => {
  const dispatch = useDispatch<AppDispatch>()

  const { items: languages } = useLanguage() as UseLanguageResult

  const { items: productBrands } = useBrands()

  // Local state
  const [isModalOpen, setModalOpen] = useState(false)
  const [selected, setSelected] = useState<ProductBrand | null>(null)

  const [currentLang, setCurrentLang] = useState(
    Array.isArray(languages) && languages[0]?.code ? languages[0].code : 'vi',
  )

  // Table handlers
  const handleEdit = useCallback(
    (pt: ProductBrand) => {
      setSelected(pt)
      setModalOpen(true)
    },
    [], // nếu dùng thêm state/prop khác trong handleEdit thì thêm vào đây
  )

  // Xoá một mục
  const handleDelete = useCallback(
    async (pt: ProductBrand) => {
      dispatch(setLoading({ key: 'DeleteProjects', value: true }))
      nProgress.start()

      try {
        const { data } = await apiDeleteProductBrand(pt._id)
        if (!data.success) {
          throw new Error(data.message)
        }
        await mutate('/brand')
        toast.success('Xóa thành công!')
      } catch (error) {
        toast.error((error as Error).message || 'Có lỗi xảy ra')
      } finally {
        dispatch(setLoading({ key: 'DeleteProjects', value: false }))
        nProgress.done()
      }
    },
    [dispatch],
  )

  // Xoá nhiều mục
  const handleDeleteBulk = useCallback(
    async (pts: ProductBrand[]) => {
      if (!pts.length) return
      if (!confirm(`Bạn có chắc chắn muốn xóa ${pts.length} mục?`)) return

      dispatch(setLoading({ key: 'DeleteProjectsBulk', value: true }))
      nProgress.start()

      try {
        await Promise.all(pts.map(({ _id }) => apiDeleteProductBrand(_id)))
        await mutate('/brand')
        toast.success('Xóa nhóm thành công!')
      } catch (error) {
        toast.error((error as Error).message || 'Có lỗi xảy ra')
      } finally {
        dispatch(setLoading({ key: 'DeleteProjectsBulk', value: false }))
        nProgress.done()
      }
    },
    [dispatch],
  )

  // Submit form Create / Update
  const handleSubmit = useCallback(
    async (values: ProductBrand) => {
      dispatch(setLoading({ key: 'UpdateProject', value: true }))
      nProgress.start()

      // Xây dựng mảng translations từ form values
      const translations = (Array.isArray(languages) ? languages : []).map(
        lang => ({
          language: lang._id,
          metaDescription: values[`metaDescription_${lang.code}`] || '',
        }),
      )

      const body = {
        translations,
        name: values.name || '',
      }

      try {
        if (selected) {
          await apiUpdateProductBrand(body, selected._id)
          toast.success('Sửa thành công!')
        } else {
          await apiCreateProductBrand(body)
          toast.success('Thêm thành công!')
        }
        await mutate('/brand')
        setModalOpen(false)
      } catch (error) {
        toast.error((error as Error).message || 'Có lỗi khi submit')
      } finally {
        dispatch(setLoading({ key: 'UpdateProject', value: false }))
        nProgress.done()
      }
    },
    [dispatch, languages, selected],
  )

  // Build cột Table, đưa currentLang vào dependency
  const columns = useMemo(
    () =>
      getProductBrandColumns({
        currentLang,
        onEdit: handleEdit,
        onDelete: handleDelete,
      }),
    [currentLang, handleEdit, handleDelete],
  )

  const actions = [
    {
      label: '+ Thêm',
      onClick: () => {
        setSelected(null)
        setModalOpen(true)
      },
    },
  ]

  // Map selected any → initialData cho form
  const mapProjectTypeToForm = (pt: ProductBrand, langs: ILanguage[]) => {
    const initValues: Record<string, string> = {}
    if (Array.isArray(langs)) {
      langs.forEach(lang => {
        const code = lang.code
        const tr = pt.translations.find(t => t.language.code === code)

        initValues[`metaDescription_${code}`] = tr?.metaDescription || ''
      })
    }
    initValues[`name`] = pt?.name || ''
    return initValues
  }

  const initialFormData = useMemo(() => {
    if (!selected) return undefined
    return mapProjectTypeToForm(
      selected,
      Array.isArray(languages) ? languages : [],
    )
  }, [selected, languages])
  // Build mảng fields cho form (name_code, metaTitle_code, metaDescription_code)
  const fields = useMemo(() => {
    const arr: FormField[] = []

    arr.push({
      name: `name`,
      label: `Tên thương hiệu`,
      placeholder: `Nhập tên thương hiệu `,
      type: 'text',
    })
    if (Array.isArray(languages)) {
      languages.forEach(lang => {
        const code = lang.code
        arr.push({
          name: `metaDescription_${code}`,
          label: `Mô tả SEO (${code.toUpperCase()})`,
          placeholder: `Nhập mô tả SEO (${code.toUpperCase()})`,
          type: 'textarea',
        })
      })
    }

    return arr
  }, [languages])

  return (
    <div className='flex flex-1 p-5 flex-col'>
      <DataTable
        data={productBrands}
        columns={columns}
        onDeleteSelected={handleDeleteBulk}
        buttons={actions}
        showTitle='Thương hiệu'
        showSearch
        showPagination={false}
        languages={languages}
        setCurrentLang={setCurrentLang}
        currentLang={currentLang}
      />

      <ModalToggle
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={selected ? 'Sửa kiểu dự án' : 'Thêm kiểu dự án'}
      >
        <div onClick={e => e.stopPropagation()}>
          <GenericForm<any>
            initialData={initialFormData}
            fields={fields}
            languages={
              Array.isArray(languages)
                ? languages.map(l => ({
                    code: l.code,
                    iconUrl: l.iconUrl[0],
                    name: l.name,
                  }))
                : []
            }
            currentLang={currentLang}
            onLangChange={setCurrentLang}
            onSubmitApi={handleSubmit}
            onSuccess={() => {
              setModalOpen(false)
            }}
          />
        </div>
      </ModalToggle>
    </div>
  )
}

export default BrandManager
