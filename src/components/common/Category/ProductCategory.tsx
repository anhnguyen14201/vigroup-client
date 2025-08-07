'use client'

import React, { useCallback, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import nProgress from 'nprogress'

import {
  apiCreateProductCategory,
  apiDeleteProductCategory,
  apiUpdateProductCategory,
} from '@/api'
import {
  FormField,
  ILanguage,
  IProductCategory,
  UseLanguageResult,
} from '@/interface'
import type { AppDispatch } from '@/redux/redux'
import { setLoading } from '@/redux'
import { ModalToggle } from '@/components/modal'
import { GenericForm } from '@/components/common/Forms'
import { getProductCategoryColumns } from '@/constants'
import DataTable from '@/components/common/DataTable'
import { useCategories, useLanguage } from '@/hooks'
import { mutate } from 'swr'

const ProductCategory = () => {
  const dispatch = useDispatch<AppDispatch>()

  const { items: languages } = useLanguage() as UseLanguageResult
  const { items: productCategories } = useCategories()

  // Local state
  const [isModalOpen, setModalOpen] = useState(false)
  const [selected, setSelected] = useState<IProductCategory | null>(null)

  const [currentLang, setCurrentLang] = useState(
    Array.isArray(languages) && languages[0]?.code ? languages[0].code : 'vi',
  )

  // Table handlers
  const handleEdit = useCallback(
    (pt: IProductCategory) => {
      setSelected(pt)
      setModalOpen(true)
    },
    [setSelected, setModalOpen],
  )

  // Xóa 1 mục Product Category
  const handleDelete = useCallback(
    async (pt: IProductCategory) => {
      dispatch(setLoading({ key: 'deleteProductCategory', value: true }))
      nProgress.start()

      try {
        const { data } = await apiDeleteProductCategory(pt._id)
        if (!data.success) throw new Error(data.message)
        await mutate('/category')

        toast.success('Xóa thành công!')
      } catch (error) {
        toast.error((error as Error).message || 'Có lỗi xảy ra')
      } finally {
        dispatch(setLoading({ key: 'deleteProductCategory', value: false }))
        nProgress.done()
      }
    },
    [dispatch],
  )

  // Xóa hàng loạt Product Category
  const handleDeleteBulk = async (pts: IProductCategory[]) => {
    if (!pts?.length) return
    if (!confirm(`Bạn có chắc chắn muốn xóa ${pts.length} mục?`)) return

    dispatch(setLoading({ key: 'deleteProductCategoryBulk', value: true }))
    nProgress.start()

    try {
      await Promise.all(pts.map(({ _id }) => apiDeleteProductCategory(_id)))
      await mutate('/category')
      toast.success('Xóa nhóm thành công!')
    } catch (error) {
      toast.error((error as Error).message || 'Có lỗi xảy ra')
    } finally {
      dispatch(setLoading({ key: 'deleteProductCategoryBulk', value: false }))
      nProgress.done()
    }
  }

  // Submit form Create / Update Product Category
  const handleSubmit = async (values: IProductCategory) => {
    dispatch(setLoading({ key: 'submitProductCategory', value: true }))
    nProgress.start()

    // Xây dựng mảng translations từ form values
    const translations = (Array.isArray(languages) ? languages : []).map(
      lang => ({
        language: lang._id,
        name: values[`name_${lang.code}`] || '',
        metaDescription: values[`metaDescription_${lang.code}`] || '',
      }),
    )

    const body = { translations }

    try {
      if (selected) {
        await apiUpdateProductCategory(body, selected._id)
        toast.success('Sửa thành công!')
      } else {
        await apiCreateProductCategory(body)
        toast.success('Thêm thành công!')
      }
      await mutate('/category')
      setModalOpen(false)
    } catch (error) {
      toast.error((error as Error).message || 'Có lỗi xảy ra')
    } finally {
      dispatch(setLoading({ key: 'submitProductCategory', value: false }))
      nProgress.done()
    }
  }

  // Build cột Table, đưa currentLang vào dependency
  const columns = useMemo(
    () =>
      getProductCategoryColumns({
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

  const mapProjectTypeToForm = (c: IProductCategory, langs: ILanguage[]) => {
    const initValues: Record<string, string> = {}
    if (Array.isArray(langs)) {
      langs.forEach(lang => {
        const code = lang.code
        const tr = c.translations.find(t => t.language.code === code)

        initValues[`metaDescription_${code}`] = tr?.metaDescription || ''
        initValues[`name_${code}`] = tr?.name || ''
      })
    }
    return initValues
  }

  // initialFormData should be of type Record<string, string> | undefined
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
    if (Array.isArray(languages)) {
      languages.forEach(lang => {
        const code = lang.code
        arr.push(
          {
            name: `name_${code}`,
            label: `Danh mục sản phẩm (${code.toUpperCase()})`,
            placeholder: `Nhập tên danh mục sản phẩm (${code.toUpperCase()})`,
            type: 'text',
          },

          {
            name: `metaDescription_${code}`,
            label: `Mô tả SEO (${code.toUpperCase()})`,
            placeholder: `Nhập mô tả SEO (${code.toUpperCase()})`,
            type: 'textarea',
          },
        )
      })
    }
    return arr
  }, [languages])

  return (
    <div className='flex flex-1 p-5 flex-col'>
      <DataTable
        data={productCategories}
        columns={columns}
        onDeleteSelected={handleDeleteBulk}
        buttons={actions}
        showTitle='Danh mục sản phẩm'
        showSearch
        showPagination={false}
        languages={languages}
        setCurrentLang={setCurrentLang}
        currentLang={currentLang}
      />

      <ModalToggle
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={selected ? 'Sửa danh mục sản phẩm' : 'Thêm danh mục sản phẩm'}
      >
        <div onClick={e => e.stopPropagation()}>
          <GenericForm
            initialData={initialFormData as any}
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
export default ProductCategory
