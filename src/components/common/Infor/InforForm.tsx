'use client'

import React from 'react'
import toast from 'react-hot-toast'
import nProgress from 'nprogress'

import { IInforFormProps, IInforType } from '@/interface'
import { apiCreateInfor, apiUpdateInfor } from '@/api'
import { inforOptions } from '@/utils'
import { GenericForm } from '@/components/common/Forms'

// Định nghĩa cấu hình các field cho GenericForm
const fields = [
  {
    name: 'inforType',
    type: 'select',
    label: 'Danh mục',
    placeholder: 'Chọn danh mục',
    requiredMessage: 'Chưa chọn danh mục.',
    required: true,
    options: inforOptions.map(({ value, title }) => ({ value, label: title })),
  },
  {
    name: 'desc',
    type: 'text',
    label: 'Nội dung',
    placeholder: 'Nhập vào nội dung',
    requiredMessage: 'Chưa nhập nội dung.',
    required: true,
  },
  {
    name: 'url',
    type: 'text',
    label: 'Url',
    placeholder: 'Nhập vào đường dẫn',
  },
  {
    name: 'activity',
    type: 'switch',
    label: 'Trạng thái',
    defaultValue: true,
  },
] as const

type FormValues = {
  inforType: IInforType
  desc: string
  url: string
  activity: boolean
}

const InforForm: React.FC<IInforFormProps> = ({ infor, onSuccess }) => {
  // Gán initialData nếu có
  const initialData = infor
    ? {
        inforType: infor.inforType as IInforType,
        desc: infor.desc,
        url: infor.url,
        activity: infor.activity,
      }
    : undefined

  // Xử lý gọi API và side-effects
  const handleSubmitApi = async (values: FormValues) => {
    // 1. Lấy ra title tương ứng
    const selected = inforOptions.find(opt => opt.value === values.inforType)
    const title = selected?.title || ''

    // 2. Đóng gói payload gồm cả 2 trường
    const payload = {
      ...values,
      title, // thêm trường title
    }

    // Bật trạng thái loading với key 'submitInfor'
    nProgress.start()

    try {
      const res = infor
        ? await apiUpdateInfor(payload, infor._id)
        : await apiCreateInfor(payload)

      if (res.data.success) {
        toast.success(infor ? 'Cập nhật thành công!' : 'Thêm thành công!')
        if (onSuccess) onSuccess()
      } else {
        toast.error(res.data.message || 'Có lỗi xảy ra.')
      }
    } catch {
      toast.error('Có lỗi xảy ra.')
    } finally {
      nProgress.done()
      // Tắt trạng thái loading với key 'submitInfor'
    }
  }

  return (
    <GenericForm<FormValues>
      fields={fields as any}
      initialData={initialData}
      onSubmitApi={handleSubmitApi}
    />
  )
}

export default InforForm
