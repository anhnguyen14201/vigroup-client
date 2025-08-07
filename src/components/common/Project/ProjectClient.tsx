'use client'

import React, { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

import { ModalToggle } from '@/components/modal'
import { GenericForm } from '@/components/common/Forms'
import DataTable from '@/components/common/DataTable'
import { mapProjectToForm } from '@/utils'
import { getProjectColumns, getProjectFormFields } from '@/constants'
import {
  useLanguage,
  usePaginatedDatas,
  useProjectActions,
  useProjectType,
} from '@/hooks'
import { UseLanguageResult } from '@/interface'
import { fetchProjects } from '@/hooks/fetchers/useProjectsFetcher'

const ProjectClient = () => {
  const router = useRouter()

  const [searchProjects, setSearchProjects] = useState<string>('')
  const kind = 'project'

  const {
    items: projectsData,
    isLoading,
    isLoadingMore,
    loadMore,
    totalItems,
    mutate,
  } = usePaginatedDatas(
    'projects',
    { searchTerm: searchProjects, kind },
    fetchProjects,
    {
      revalidateOnFocus: false,
    },
  )

  const remainingCountProjects = totalItems - projectsData.length

  const { items: languages } = useLanguage() as UseLanguageResult
  const { items: projectTypes } = useProjectType()

  // Local state
  const [isModalOpen, setModalOpen] = useState(false)
  const [selected, setSelected] = useState<any | null>(null)

  const [currentLang, setCurrentLang] = useState(
    Array.isArray(languages) && languages[0]?.code ? languages[0].code : 'vi',
  )

  const {
    handleDelete,
    handleDeleteBulk,
    handleSubmit,
    handleEdit,
    handleInfor,
  } = useProjectActions({
    languages,
    setModalOpen,
    setSelected,
    router,
    projectsData,
    mutate,
  })

  // Cột cho DataTable
  const columns = getProjectColumns(handleEdit, handleDelete, handleInfor)

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

  // Helper: map selected project → initialData

  const initialFormData = useMemo(() => {
    if (!selected) return undefined
    return mapProjectToForm(selected, Array.isArray(languages) ? languages : [])
  }, [selected, languages])

  const previewInitial = useMemo(() => {
    if (!selected) return undefined
    return {
      thumbnail: Array.isArray(selected.thumbnailUrls)
        ? selected.thumbnailUrls
        : [],
      images: Array.isArray(selected.imageUrls) ? selected.imageUrls : [],
    }
  }, [selected])

  // Tạo mảng fields (projectName đa ngôn ngữ, description, metaTitle, metaDescription, v.v.)
  const fields: any[] = useMemo(
    () =>
      getProjectFormFields(
        projectTypes,
        Array.isArray(languages)
          ? languages.map(l => ({
              code: l.code,
              name: l.name,
              iconUrl: Array.isArray(l.iconUrl) ? l.iconUrl[0] : '',
            }))
          : [],
      ),
    [projectTypes, languages],
  )

  return (
    <div className='flex flex-1 p-5 flex-col'>
      <DataTable
        data={projectsData}
        columns={columns}
        onDeleteSelected={handleDeleteBulk}
        buttons={actions}
        inputChange={searchProjects}
        setInputChange={setSearchProjects}
        showTitle=''
        remainingCount={remainingCountProjects}
        loadMore={loadMore}
        isLoadingMore={isLoadingMore}
        isLoading={isLoading}
      />

      <ModalToggle
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={selected ? 'Sửa dự án' : 'Thêm dự án mới'}
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
            onSubmitApi={values => handleSubmit(values, selected)}
            onSuccess={() => {
              setModalOpen(false)
              mutate()
            }}
          />
        </div>
      </ModalToggle>
    </div>
  )
}

export default ProjectClient
