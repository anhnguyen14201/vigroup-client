'use client'

import React, { useCallback, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import nProgress from 'nprogress'

import {
  apiCreateInstallation,
  apiDeleteInstallation,
  apiUpdateInstallation,
} from '@/api'

import type { AppDispatch } from '@/redux/redux'

import { setLoading } from '@/redux'
import { ModalToggle } from '@/components/modal'
import { GenericForm } from '@/components/common/Forms'
import { getInstallationColumns } from '@/constants'
import { IInstallation, UseLanguageResult } from '@/interface'
import DataTable from '@/components/common/DataTable'
import { useInstallations, useLanguage } from '@/hooks'
import { mutate } from 'swr'

const Installation = () => {
  const dispatch = useDispatch<AppDispatch>()

  const { items: installations } = useInstallations()

  const { items: languages } = useLanguage() as UseLanguageResult

  const [currentLang, setCurrentLang] = useState(
    Array.isArray(languages) && languages[0]?.code ? languages[0].code : 'vi',
  )
  // Local state
  const [isModalOpen, setModalOpen] = useState(false)
  const [selected, setSelected] = useState<any | null>(null)

  // Khi nhấn Sửa
  const handleEdit = useCallback(
    (installation: IInstallation) => {
      setSelected(installation)
      setModalOpen(true)
    },
    [setSelected, setModalOpen], // chỉ phụ thuộc vào những setter này
  )
  // Khi nhấn Xoá 1 bản ghi
  // Xóa một Installation
  const handleDelete = useCallback(
    async (installation: any) => {
      // Xác nhận hành động xóa, nếu không xác nhận thì dừng hàm
      if (!confirm(`Bạn có chắc chắn muốn xóa "${installation.desc}"?`)) return

      // Bật trạng thái loading với key 'DeleteInstallation' và bắt đầu tiến trình nProgress
      dispatch(setLoading({ key: 'DeleteInstallation', value: true }))
      nProgress.start()

      try {
        const { data } = await apiDeleteInstallation(installation._id)
        if (!data.success) throw new Error(data.message)

        // Cập nhật lại danh sách installations
        await mutate('/installation')
        toast.success('Xóa thành công!')
      } catch (err: any) {
        toast.error(err.response?.data?.message || err.message)
      } finally {
        dispatch(setLoading({ key: 'DeleteInstallation', value: false }))
        nProgress.done()
      }
    },
    [dispatch],
  )

  // Xóa hàng loạt Installations
  const handleDeleteBulk = useCallback(
    async (items: any[]) => {
      if (!items.length) return
      if (!confirm(`Bạn có chắc chắn muốn xóa ${items.length} mục?`)) return

      dispatch(setLoading({ key: 'DeleteInstallationBulk', value: true }))
      nProgress.start()

      try {
        // Gọi API xóa từng phần tử một cách song song
        await Promise.all(items.map(item => apiDeleteInstallation(item._id)))
        await mutate('/installation')
        toast.success('Xóa thành công!')
      } catch (err: any) {
        toast.error(err.response?.data?.message || err.message)
      } finally {
        dispatch(setLoading({ key: 'DeleteInstallationBulk', value: false }))
        nProgress.done()
      }
    },
    [dispatch],
  )

  // Submit form Create / Update Installation
  const handleSubmit = async (values: any) => {
    dispatch(setLoading({ key: 'SaveInstallation', value: true }))
    nProgress.start()

    // Xây dựng mảng translations dựa trên ngôn ngữ đã định nghĩa
    const translations = (Array.isArray(languages) ? languages : []).map(
      lang => ({
        language: lang._id,
        desc: values[`desc_${lang.code}`] || '',
      }),
    )

    // Đóng gói dữ liệu dưới dạng FormData để gửi lên API
    const formData = new FormData()
    formData.append('cost', values.cost)
    formData.append('tax', values.tax)
    formData.append('translations', JSON.stringify(translations))

    if (values.icon) {
      formData.append('icon', values.icon)
    }

    try {
      if (selected) {
        await apiUpdateInstallation(formData, selected._id)
        toast.success('Cập nhật thành công!')
      } else {
        await apiCreateInstallation(formData)
        toast.success('Thêm mới thành công!')
      }
      // Reload lại danh sách installations và đóng modal
      await mutate('/installation')
      setModalOpen(false)
      setSelected(null)
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || err.message || 'Lỗi khi submit',
      )
    } finally {
      dispatch(setLoading({ key: 'SaveInstallation', value: false }))
      nProgress.done()
    }
  }

  // Columns table
  const columns = useMemo(
    () =>
      getInstallationColumns({
        currentLang,
        onEdit: handleEdit,
        onDelete: handleDelete,
      }),
    [currentLang, handleEdit, handleDelete],
  )

  // Nút thêm mới
  const actions = [
    {
      label: '+ Thêm',
      onClick: () => {
        setSelected(null)
        setModalOpen(true)
      },
    },
  ]

  const mapProjectTypeToForm = useMemo(
    () => (pt: any, langs: typeof languages) => {
      const initValues: Record<string, any> = {}
      if (Array.isArray(langs)) {
        langs.forEach(lang => {
          const code = lang.code

          const tr = pt.translations.find(
            (t: any) => (t.language as any).code === code,
          ) || {
            desc: '',
          }

          initValues[`desc_${code}`] = tr?.desc || ''
        })
      }

      initValues[`cost`] = pt?.cost || ''
      initValues[`tax`] = pt?.tax || ''
      initValues.icon = []

      return initValues as Record<string, any>
    },
    [],
  )

  const initialFormData = useMemo(() => {
    if (!selected) return undefined
    return mapProjectTypeToForm(selected, languages)
  }, [selected, languages, mapProjectTypeToForm])

  const preview = useMemo(() => {
    if (!selected) return undefined
    return {
      icon: Array.isArray(selected.imageUrls) ? selected.imageUrls : [],
    }
  }, [selected])

  const fields = useMemo(() => {
    const arr: any[] = []

    if (Array.isArray(languages)) {
      languages.forEach(lang => {
        const code = lang.code
        arr.push({
          name: `desc_${code}`,
          label: `Công lắp đặt (${code.toUpperCase()})`,
          placeholder: `Nhập nội dung công lắp đặt (${code.toUpperCase()})`,
          type: 'text',
        })
      })
    }
    arr.push({
      name: 'icon',
      type: 'file',
      label: 'Chọn file ảnh',
      accept: 'image/*',
      multiple: false,
    })

    arr.push({
      name: 'cost',
      type: 'number',
      label: 'Giá thành',
      placeholder: 'Nhập giá thành',
    })
    arr.push({
      name: 'tax',
      type: 'number',
      label: 'Thuế ',
      placeholder: 'Nhập thuế',
    })

    return arr
  }, [languages])

  return (
    <div className='flex flex-1 p-5 flex-col'>
      <DataTable
        data={installations}
        columns={columns}
        onDeleteSelected={handleDeleteBulk}
        buttons={actions}
        showTitle='Công lắp đặt'
        showSearch
        showPagination={false}
        languages={languages}
        setCurrentLang={setCurrentLang}
        currentLang={currentLang}
      />

      <ModalToggle
        isOpen={isModalOpen}
        onClose={() => {
          setModalOpen(false)
          setSelected(null)
        }}
        title={selected ? 'Sửa công lắp đặt' : 'Thêm công lắp đặt'}
      >
        <div onClick={e => e.stopPropagation()}>
          <GenericForm<any>
            initialData={initialFormData}
            fields={fields as any}
            onSubmitApi={handleSubmit}
            preview={preview}
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
            onSuccess={() => {
              setModalOpen(false)
            }}
          />
        </div>
      </ModalToggle>
    </div>
  )
}

export default Installation
