// src/constants/projectFormFields.ts

export interface FormField {
  name: string // giờ dùng string thay vì keyof IProject để linh hoạt
  type: 'text' | 'select' | 'textarea' | 'editor' | 'file' | 'switch' // 'editor' dùng cho rich text editor
  label: string
  placeholder?: string
  defaultValue?: any
  requiredMessage?: string
  required?: boolean
  options?: { value: string; label: string }[] // Dùng cho 'select'
  accept?: string // Dùng cho 'file'
  multiple?: boolean // Dùng cho 'file'
}

/**
 * Trả về mảng fields cho form Project:
 * - projectName bị tách thành projectName_{code} cho mỗi ngôn ngữ
 * - location: textarea (global, không đa ngôn)
 * - projectType: select
 */
export function getProjectFormFields(
  projectTypes: any[],
  languages: { code: string; name: string; iconUrl: string }[],
): FormField[] {
  // 1. Tạo options cho select 'projectType'
  const typeOptions = projectTypes.map(pt => {
    // Lấy tên tiếng Việt làm label (nếu ko có, fallback bản đầu)
    const transVi = pt.translations.find(
      (t: any) => (t.language as any).code === 'vi',
    )
    const label = transVi?.name || pt.translations[0]?.name || ''
    return { value: pt._id, label }
  })

  const fields: FormField[] = []

  fields.push({
    name: 'code',
    label: 'Mã dự án',
    type: 'text',
    placeholder: 'Nhập mã dự án',
    defaultValue: '',
    requiredMessage: 'Mã dự án là bắt buộc',
    required: true,
  })
  // 2. Cho mỗi ngôn ngữ, thêm field projectName_{code}
  languages.forEach(lang => {
    const code = lang.code
    fields.push({
      name: `projectName_${code}`,
      label: `Tên dự án (${code.toUpperCase()})`,
      type: 'text',
      placeholder: `Nhập tên dự án (${code.toUpperCase()})`,
      defaultValue: '',
      requiredMessage: `Tên dự án (${code.toUpperCase()}) là bắt buộc`,
      required: true,
    })

    fields.push({
      name: `description_${code}`,
      label: `Mô tả dự án (${code.toUpperCase()})`,
      type: 'editor',
      placeholder: `Nhập mô tả cho dự án (${code.toUpperCase()})`,
      defaultValue: '',
    })

    fields.push({
      name: `metaDescription_${code}`,
      label: `Mô tả SEO (${code.toUpperCase()})`,
      type: 'textarea',
      placeholder: 'Nhập mô tả SEO',
      defaultValue: '',
    })

    fields.push({
      name: `buildingType_${code}`,
      label: `Hạng mục công trình (${code.toUpperCase()})`,
      type: 'text',
      placeholder: 'Nhập hạng mục công trình',
      defaultValue: '',
    })
  })

  // 3. Thêm field location (global)
  fields.push({
    name: 'location',
    label: 'Địa chỉ',
    type: 'textarea',
    placeholder: 'Nhập địa chỉ',
    defaultValue: '',
    required: true,
    requiredMessage: 'Địa chỉ là bắt buộc.',
  })

  // 4. Thêm select projectType
  fields.push({
    name: 'projectType',
    label: 'Kiểu dự án',
    type: 'select',
    placeholder: 'Chọn kiểu dự án',
    defaultValue: '',
    requiredMessage: 'Phải chọn kiểu dự án',
    required: true,
    options: typeOptions,
  })

  fields.push({
    name: 'showProject',
    label: 'Hiển thị dự án?',
    type: 'switch',
    defaultValue: false,
  })

  fields.push({
    name: 'thumbnail',
    label: 'Hình ảnh đại diện',
    type: 'file',
    accept: 'image/*',
    defaultValue: '',
  })

  fields.push({
    name: 'images',
    label: 'Hình ảnh',
    type: 'file',
    accept: 'images/*',
    multiple: true,
    defaultValue: '',
  })

  return fields
}
