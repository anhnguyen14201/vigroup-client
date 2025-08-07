'use client'

import React, { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import nProgress from 'nprogress'

import { apiCreateLogo, apiUpdateLogo } from '@/api'
import { logoOptions } from '@/utils'
import { LogoFormProps, LogoType, UseLanguageResult } from '@/interface'
import { GenericForm } from '@/components/common/Forms'
import { useLanguage } from '@/hooks'

// Cấu hình fields cho GenericForm

type FormValues = {
  logoType: LogoType
  activity: boolean
  icon: File | null
  [key: `desc_${string}`]: string | undefined
}

const LogoForm: React.FC<LogoFormProps> = ({ logo, onSuccess }) => {
  const { items: languages } = useLanguage() as UseLanguageResult
  const [currentLang, setCurrentLang] = useState(
    Array.isArray(languages) && languages[0]?.code ? languages[0].code : 'vi',
  )

  const defaultType = (logo?.logoType as LogoType) ?? logoOptions[0].value
  // Chuẩn bị initialData và preview

  const initialData = useMemo(() => {
    const init: any = {
      activity: logo?.activity ?? true,
      logoType: defaultType,
      icon: null,
    }

    if (Array.isArray(languages)) {
      languages.forEach(lang => {
        const { code, _id } = lang
        const t = logo?.translations?.find(x => x.language === _id)
        init[`desc_${code}`] = t?.desc || ''
      })
    }
    return init
  }, [logo, languages, defaultType])

  const preview = useMemo(() => {
    // ... code dùng đến defaultType ...
    return logo ? { icon: logo.imageUrls.map(u => u) } : undefined
  }, [logo])
  const handleSubmitApi = async (values: FormValues) => {
    // Lấy ra title từ logoOptions dựa trên giá trị logoType
    const title =
      logoOptions.find(o => o.value === values.logoType)?.title || ''

    // Tạo đối tượng FormData và thêm các trường cần thiết
    const formData = new FormData()
    formData.append('logoType', values.logoType)
    formData.append('logoTitle', title)
    formData.append('activity', JSON.stringify(values.activity))

    // Xây dựng mảng translations dựa trên languages (nếu có)
    const translations = (Array.isArray(languages) ? languages : []).map(
      lang => ({
        language: lang._id,
        desc: values[`desc_${lang.code}`] || '',
      }),
    )
    formData.append('translations', JSON.stringify(translations))

    // Thêm file icon nếu có
    if (values.icon) {
      formData.append('icon', values.icon)
    }

    // Bật trạng thái loading và bắt đầu tiến trình
    nProgress.start()

    try {
      const res = logo
        ? await apiUpdateLogo(formData, logo._id)
        : await apiCreateLogo(formData)

      if (res.data.success) {
        toast.success(logo ? 'Cập nhật thành công!' : 'Thêm logo thành công!')
        if (onSuccess) onSuccess()
      } else {
        toast.error(res.data.message || 'Có lỗi xảy ra.')
      }
    } catch {
      toast.error('Có lỗi xảy ra.')
    } finally {
      nProgress.done()
    }
  }

  const fields = useMemo(() => {
    const arr = [] as any[]

    arr.push({
      name: 'logoType',
      type: 'select',
      label: 'Kiểu logo',
      placeholder: 'Chọn kiểu logo',
      required: true,
      options: logoOptions.map(o => ({ value: o.value, label: o.title })),
      defaultValue: initialData.logoType,
    })
    if (Array.isArray(languages)) {
      languages.forEach(lang => {
        const code = lang.code
        arr.push({
          name: `desc_${code}`,
          label: `Mô tả (${code.toUpperCase()})`,
          placeholder: `Nhập mô tả (${code.toUpperCase()})`,
          type: 'textarea',
        })
      })
    }

    arr.push(
      {
        name: 'icon',
        type: 'file',
        label: 'Chọn file ảnh',
        accept: 'image/*',
        multiple: false,
      },

      {
        name: 'activity',
        type: 'switch',
        label: 'Trạng thái',
        defaultValue: true,
      },
    )

    return arr
  }, [languages, initialData.logoType])

  return (
    <GenericForm<FormValues>
      fields={fields as any}
      initialData={initialData}
      preview={preview}
      onSubmitApi={handleSubmitApi}
      languages={
        Array.isArray(languages)
          ? languages.map(l => ({
              code: l.code,
              iconUrl: Array.isArray(l.iconUrl) ? l.iconUrl[0] : '',
              name: l.name,
            }))
          : []
      }
      currentLang={currentLang}
      onLangChange={setCurrentLang}
    />
  )
}

export default LogoForm
