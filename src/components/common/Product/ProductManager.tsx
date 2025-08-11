'use client'

import React, { useCallback, useMemo, useState } from 'react'

import { IProduct, UseLanguageResult } from '@/interface'

import { ModalToggle } from '@/components/modal'
import { GenericForm } from '@/components/common/Forms'
import { mapProductToForm } from '@/utils'
import DataTable from '@/components/common/DataTable'
import { getProductFormFields, getProductColumns } from '@/constants'
import {
  useBrands,
  useCategories,
  useLanguage,
  usePaginatedDatas,
  useProductActions,
} from '@/hooks'
import { fetchProductsPrivatePage } from '@/hooks/fetchers/useProductsPrivateFetcher'

const ProductManager = () => {
  const { items: languages } = useLanguage() as UseLanguageResult

  const { items: productCategories } = useCategories()
  const { items: productBrands } = useBrands()
  // Local state
  const [isModalOpen, setModalOpen] = useState(false)
  const [selected, setSelected] = useState<IProduct | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')

  const [currentLang, setCurrentLang] = useState(
    Array.isArray(languages) && languages[0]?.code ? languages[0].code : 'vi',
  )

  const {
    items: products,
    isLoading,
    isLoadingMore,
    isReachingEnd,
    loadMore,
    totalItems,
    mutate,
  } = usePaginatedDatas(
    'productsPrivate',
    {
      searchTerm,
    },
    fetchProductsPrivatePage,
    { revalidateOnFocus: false },
  )

  const remainingCount = totalItems - products.length

  const { handleDelete, handleDeleteBulk, handleSubmit } = useProductActions({
    languages,
    isModalOpen,
    setModalOpen,
    productDatas: products,
    mutate,
  })
  // Table Handlers
  const handleEdit = useCallback(
    (prod: IProduct) => {
      setSelected(prod)
      setModalOpen(true)
    },

    [setSelected, setModalOpen],
  )

  // Cột cho DataTable
  const columns = useMemo(() => {
    if (isLoading) {
      return [] // chờ loading xong mới tạo columns
    }
    return getProductColumns({
      currentLang,
      onEdit: handleEdit,
      onDelete: handleDelete,
    })
  }, [currentLang, handleEdit, handleDelete, isLoading])

  // Các nút hành động
  const actions = [
    {
      label: '+ Thêm',
      onClick: () => {
        setSelected(null)
        setModalOpen(true)
      },
    },
  ]

  const initialFormData = useMemo(() => {
    if (!selected) return undefined
    return mapProductToForm(selected, languages)
  }, [selected, languages])
  // Tạo previewInitial từ selected (nếu đang edit)
  const previewInitial = useMemo(() => {
    if (!selected) return undefined
    return {
      thumbnail: Array.isArray(selected.thumbnailUrls)
        ? selected.thumbnailUrls
        : [],
      images: Array.isArray(selected.imageUrls) ? selected.imageUrls : [],
    }
  }, [selected])

  // Tạo mảng fields (bao gồm code, cost, price, tax, discount, quantity, isFeatured, isNewArrival, categoryIds, brandIds, và i18n fields)
  const fields = useMemo(
    () =>
      getProductFormFields(
        productBrands,
        productCategories,
        Array.isArray(languages)
          ? languages.map(l => ({
              code: l.code,
              name: l.name,
              iconUrl: Array.isArray(l.iconUrl) ? l.iconUrl[0] : '',
            }))
          : [],
      ),
    [productBrands, productCategories, languages],
  )

  return (
    <div className='flex flex-1 p-5 flex-col'>
      <DataTable
        isLoading={isLoading}
        columns={columns}
        data={products}
        onDeleteSelected={handleDeleteBulk}
        buttons={actions}
        inputChange={searchTerm}
        setInputChange={setSearchTerm}
        showTitle=''
        showSearch
        languages={languages}
        setCurrentLang={setCurrentLang}
        currentLang={currentLang}
        remainingCount={remainingCount}
        loadMore={loadMore}
        isLoadingMore={isLoadingMore}
      />

      <ModalToggle
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={selected ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}
      >
        <div onClick={e => e.stopPropagation()}>
          <GenericForm
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
            preview={previewInitial}
            currentLang={currentLang}
            onLangChange={setCurrentLang}
            onSubmitApi={values => handleSubmit(values, selected as IProduct)}
            onSuccess={async () => {
              await mutate()
              setModalOpen(false)
            }}
          />
        </div>
      </ModalToggle>
    </div>
  )
}

export default ProductManager
