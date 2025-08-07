'use client'

import React from 'react'
import nProgress from 'nprogress'
import toast from 'react-hot-toast'
import { apiCreateInforCompany, apiUpdateInforCompany } from '@/api'
import { GenericForm } from '@/components/common/Forms'

const fields = [
  {
    name: 'companyName',
    type: 'text',
    label: 'Tên công ty',
    placeholder: 'Nhập vào tên công ty',
    requiredMessage: 'Chưa nhập tên công ty.',
  },
  {
    name: 'address',
    type: 'text',
    label: 'Địa chỉ',
    placeholder: 'Nhập vào địa chỉ',
    requiredMessage: 'Chưa nhập địa chỉ.',
  },
  {
    name: 'ico',
    type: 'text',
    label: 'ICO',
    placeholder: 'Nhập vào ICO',
    requiredMessage: 'Chưa nhập ICO.',
  },
  {
    name: 'dic',
    type: 'text',
    label: 'DIC',
    placeholder: 'Nhập vào DIC',
    requiredMessage: 'Chưa nhập DIC.',
  },
  {
    name: 'bankAccount',
    type: 'text',
    label: 'Số tài khoản ngân hàng',
    placeholder: 'Nhập vào số tài khoản ngân hàng',
    requiredMessage: 'Chưa nhập số tài khoản ngân hàng.',
  },
  {
    name: 'icon',
    type: 'file',
    label: 'Chữ ký số',
    placeholder: 'Chọn ảnh chữ ký số',
    requiredMessage: 'Chưa chọn ảnh chữ ký số.',
  },
  { name: 'isActive', type: 'switch', label: 'Trạng thái', defaultValue: true },
] as const

const InforCompanyForm: React.FC<{
  infor?: any
  onSuccess?: () => void
}> = ({ infor, onSuccess }) => {
  const initialData: any | undefined = infor
    ? {
        companyName: infor.companyName,
        address: infor.address,
        ico: infor.ico,
        dic: infor.dic,
        bankAccount: infor.bankAccount,
        isActive: infor.isActive,
      }
    : undefined

  // B: Preview cho file
  const preview = infor
    ? { icon: infor.imageUrls || [] } // <-- key phải là 'icon'
    : undefined

  const handleSubmitApi = async (values: any) => {
    const formData = new FormData()

    // Thêm dữ liệu form vào formData
    formData.append('icon', values.icon)
    formData.append('companyName', values.companyName)
    formData.append('address', values.address)
    formData.append('ico', values.ico)
    formData.append('dic', values.dic)
    formData.append('bankAccount', values.bankAccount)
    formData.append('isActive', JSON.stringify(values.isActive))

    // Bật trạng thái loading
    nProgress.start()

    try {
      const res = infor
        ? await apiUpdateInforCompany(formData, infor._id)
        : await apiCreateInforCompany(formData)

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
      // Tắt trạng thái loading
    }
  }

  return (
    <GenericForm
      fields={fields as any}
      initialData={initialData}
      preview={preview}
      onSubmitApi={handleSubmitApi}
    />
  )
}

export default InforCompanyForm
