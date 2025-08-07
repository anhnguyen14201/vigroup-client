// src/constants/projectFormFields.ts

export interface FormFieldTempalte {
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
export function getTemplateFormFields(
  projectTypes: any[],
  languages: { code: string; name: string; iconUrl: string }[],
): FormFieldTempalte[] {
  // 1. Tạo options cho select 'projectType'
  const typeOptions = projectTypes.map(pt => {
    // Lấy tên tiếng Việt làm label (nếu ko có, fallback bản đầu)
    const transVi = pt.translations.find(
      (t: any) => (t.language as any).code === 'vi',
    )
    const label = transVi?.name || pt.translations[0]?.name || ''
    return { value: pt._id, label }
  })

  const fields: FormFieldTempalte[] = []

  fields.push({
    name: 'code',
    label: 'Mã thiết kế',
    type: 'text',
    placeholder: 'Nhập mã thiết kế',
    defaultValue: '',
    requiredMessage: 'Mã thiết kế là bắt buộc',
    required: true,
  })
  // 2. Cho mỗi ngôn ngữ, thêm field projectName_{code}
  languages.forEach(lang => {
    const code = lang.code
    fields.push({
      name: `projectName_${code}`,
      label: `Tên thiết kế (${code.toUpperCase()})`,
      type: 'text',
      placeholder: `Nhập tên thiết kế (${code.toUpperCase()})`,
      defaultValue: '',
      requiredMessage: `Tên thiết kế (${code.toUpperCase()}) là bắt buộc`,
      required: true,
    })

    fields.push({
      name: `description_${code}`,
      label: `Mô tả thiết kế (${code.toUpperCase()})`,
      type: 'editor',
      placeholder: `Nhập mô tả cho thiết kế (${code.toUpperCase()})`,
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

  // 4. Thêm select projectType
  fields.push({
    name: 'projectType',
    label: 'Kiểu thiết kế',
    type: 'select',
    placeholder: 'Chọn kiểu thiết kế',
    defaultValue: '',
    requiredMessage: 'Phải chọn kiểu thiết kế',
    required: true,
    options: typeOptions,
  })

  fields.push({
    name: 'showProject',
    label: 'Hiển thị thiết kế?',
    type: 'switch',
    defaultValue: true,
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
