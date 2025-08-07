'use client'

import React, { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import type { RootState } from '@/redux/redux'

import { ModalToggle } from '@/components/modal'
import { GenericForm } from '@/components/common/Forms'
import DataTable from '@/components/common/DataTable'
import { useLanguage, useProjectCategoryActions, useProjectType } from '@/hooks'
import { mapProjectTypeToForm } from '@/utils'
import { getProjectTypeColumns } from '@/constants'
import { UseLanguageResult } from '@/interface'

const ProjectCategory = () => {
  const { items: projectTypes } = useProjectType()

  const { items: languages } = useLanguage() as UseLanguageResult

  // Local state
  const [isModalOpen, setModalOpen] = useState(false)
  const [selected, setSelected] = useState<any | null>(null)

  const [currentLang, setCurrentLang] = useState<string>(
    languages[0]?.code || 'vi',
  )

  const { handleDelete, handleDeleteBulk, handleSubmit, handleEdit } =
    useProjectCategoryActions({
      isModalOpen,
      setModalOpen,
      setSelected,
      languages,
    })

  // Build cột Table, đưa currentLang vào dependency
  const columns = useMemo(
    () =>
      getProjectTypeColumns({
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

  const initialFormData = useMemo(() => {
    if (!selected) return undefined
    return mapProjectTypeToForm(selected, languages)
  }, [selected, languages])
  // Build mảng fields cho form (name_code, metaTitle_code, metaDescription_code)
  const fields = useMemo(() => {
    const arr: any[] = []
    if (Array.isArray(languages)) {
      languages.forEach(lang => {
        const code = lang.code
        arr.push(
          {
            name: `name_${code}`,
            label: `Kiểu dự án (${code.toUpperCase()})`,
            placeholder: `Nhập tên kiểu dự án (${code.toUpperCase()})`,
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
        data={projectTypes}
        columns={columns}
        onDeleteSelected={handleDeleteBulk}
        buttons={actions}
        showTitle=''
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
            onSubmitApi={values => handleSubmit(values, selected)}
            onSuccess={() => {
              setModalOpen(false)
            }}
          />
        </div>
      </ModalToggle>
    </div>
  )
}

export default ProjectCategory
