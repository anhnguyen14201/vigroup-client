// SlideForm.tsx

'use client'

import React, { useState, useMemo, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import nProgress from 'nprogress'

import { apiCreateSlide, apiUpdateSlide } from '@/api'

import type { AppDispatch } from '@/redux/redux'
import type {
  SlideFormProps,
  SlideFormValues,
  UseLanguageResult,
} from '@/interface'

import { GenericForm } from '@/components/common/Forms'
import { useLanguage } from '@/hooks'

const SlideForm: React.FC<SlideFormProps> = ({ slide, onSuccess }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { items: languages } = useLanguage() as UseLanguageResult

  // Lấy previewInitial một lần khi slide thay đổi
  const previewInitial = useMemo(
    () => slide?.imageUrls ?? [],
    [slide?.imageUrls],
  )
  const [currentLang, setCurrentLang] = useState(
    Array.isArray(languages) && languages[0]?.code ? languages[0].code : 'vi',
  )

  const defaultValues = useMemo(() => {
    const init: any = {
      activity: slide?.activity ?? true,
      buttonUrl: slide?.buttonUrl ?? '',
      image: null,
    }
    if (Array.isArray(languages)) {
      languages.forEach(lang => {
        const { code, _id } = lang
        const t = slide?.translations?.find(x => x.language === _id)
        init[`title_${code}`] = t?.title || ''
        init[`desc_${code}`] = t?.desc || ''
        init[`buttonText_${code}`] = t?.buttonText || ''
      })
    }
    return init as SlideFormValues
  }, [slide, languages])

  const fields = useMemo(() => {
    const arr = [] as any[]
    if (Array.isArray(languages)) {
      languages.forEach(lang => {
        const code = lang.code
        arr.push(
          {
            name: `title_${code}`,
            label: `Tiêu đề (${code.toUpperCase()})`,
            placeholder: `Nhập tiêu đề (${code.toUpperCase()})`,
            type: 'textarea',
          },
          {
            name: `desc_${code}`,
            label: `Mô tả (${code.toUpperCase()})`,
            placeholder: `Nhập mô tả (${code.toUpperCase()})`,
            type: 'textarea',
          },
          {
            name: `buttonText_${code}`,
            label: `Nút (${code.toUpperCase()})`,
            placeholder: `Nhập chữ trên nút (${code.toUpperCase()})`,
            type: 'text',
          },
        )
      })
    }
    arr.push(
      {
        name: 'buttonUrl',
        label: 'Link Nút chung',
        type: 'text',
        placeholder: 'Nhập đường dẫn',
      },
      { name: 'activity', label: 'Trạng thái', type: 'switch' },
      { name: 'image', label: 'Ảnh slide', type: 'file', accept: 'image/*' },
    )
    return arr
  }, [languages])

  // *********** CHỈN SỬA Ở ĐÂY ***********
  // Gói previewInitial vào useMemo để object có identity ổn định

  const previewProp = useMemo(
    () => ({ image: previewInitial }),
    [previewInitial],
  )

  const onSubmit = useCallback(
    async (values: SlideFormValues) => {
      // Tạo đối tượng FormData và thêm các trường cần thiết
      const formData = new FormData()
      formData.append('activity', JSON.stringify(values.activity))
      formData.append('buttonUrl', values.buttonUrl)

      if (values.image instanceof File) {
        formData.append('image', values.image)
      }

      // Xây dựng mảng translations dựa trên languages
      const translations = (Array.isArray(languages) ? languages : []).map(
        lang => ({
          language: lang._id,
          title: values[`title_${lang.code}`],
          desc: values[`desc_${lang.code}`],
          buttonText: values[`buttonText_${lang.code}`],
        }),
      )
      formData.append('translations', JSON.stringify(translations))
      // Bật trạng thái loading và bắt đầu tiến trình nProgress
      nProgress.start()

      try {
        const res = slide
          ? await apiUpdateSlide(formData, slide._id)
          : await apiCreateSlide(formData)

        if (res.data.success) {
          toast.success(
            slide ? 'Cập nhật slide thành công!' : 'Thêm slide thành công!',
          )
          if (onSuccess) onSuccess()
        } else {
          toast.error('Có lỗi xảy ra!')
        }
      } catch {
        toast.error('Có lỗi xảy ra!')
      } finally {
        nProgress.done()
      }
    },
    [dispatch, slide, languages, onSuccess],
  )

  return (
    <GenericForm<SlideFormValues>
      initialData={defaultValues}
      fields={fields}
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
      onSubmitApi={onSubmit}
      // Truyền previewProp đã được memo để tránh tạo object mới mỗi khi rerender
      preview={previewProp}
    />
  )
}

export default SlideForm
