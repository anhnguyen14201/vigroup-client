/**
 * Trả về mảng fields cho form Project:
 * - projectName bị tách thành projectName_{code} cho mỗi ngôn ngữ
 * - location: textarea (global, không đa ngôn)
 * - projectType: select
 */
export function getProductFormFields(
  productBrands: any[],
  productCategories: any[],
  languages: { code: string; name: string; iconUrl: string }[],
): any[] {
  // 1. Tạo options cho select 'projectType'
  const categoryIds = productCategories.map(pt => {
    // Lấy tên tiếng Việt làm label (nếu ko có, fallback bản đầu)
    const transVi = pt.translations.find(
      (t: any) => (t.language as any).code === 'vi',
    )
    const label = transVi?.name || pt.translations[0]?.name || ''
    return { value: pt._id, label }
  })
  const brandIds = productBrands.map(pt => {
    // Lấy tên tiếng Việt làm label (nếu ko có, fallback bản đầu)

    const label = pt?.name || ''
    return { value: pt._id, label }
  })

  const fields: any[] = []

  fields.push({
    name: 'code',
    label: 'Mã sản phẩm',
    type: 'text',
    placeholder: 'Nhập mã sản phẩm',
    defaultValue: '',
    requiredMessage: 'Mã sản phẩm là bắt buộc',
    required: true,
  })
  // 2. Cho mỗi ngôn ngữ, thêm field projectName_{code}
  languages.forEach(lang => {
    const code = lang.code
    fields.push({
      name: `productName_${code}`,
      label: `Tên sản phẩm (${code.toUpperCase()})`,
      type: 'text',
      placeholder: `Nhập tên sản phẩm (${code.toUpperCase()})`,
      defaultValue: '',
      requiredMessage: `Tên sản phẩm (${code.toUpperCase()}) là bắt buộc`,
      required: true,
    })

    fields.push({
      name: `shortDesc_${code}`,
      label: `Mô tả ngắn (${code.toUpperCase()})`,
      type: 'editor',
      placeholder: `Nhập mô tả ngắn cho sản phẩm (${code.toUpperCase()})`,
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
      name: `desc_${code}`,
      label: `Mô tả sản phẩm (${code.toUpperCase()})`,
      type: 'editor',
      placeholder: `Nhập mô tả cho sản phẩm (${code.toUpperCase()})`,
      defaultValue: '',
    })

    fields.push({
      name: `specifications_${code}`,
      label: `Thông số kỹ thuật (${code.toUpperCase()})`,
      type: 'editor',
      placeholder: `Nhập thông số kỹ thuật cho sản phẩm (${code.toUpperCase()})`,
      defaultValue: '',
    })
  })

  fields.push({
    name: 'cost',
    label: 'Giá nhập sản phẩm',
    type: 'number',
    placeholder: '0',
    defaultValue: '',
  })

  fields.push({
    name: 'price',
    label: 'Giá bán sản phẩm',
    type: 'number',
    placeholder: '0',
    defaultValue: '',
  })

  fields.push({
    name: 'tax',
    label: 'Thuế',
    type: 'number',
    placeholder: '0',
    defaultValue: 21,
  })

  fields.push({
    name: 'discount',
    label: 'Giảm giá',
    type: 'number',
    placeholder: '0',
    defaultValue: '',
  })
  fields.push({
    name: 'quantity',
    label: 'Số lượng sản phẩm',
    type: 'number',
    placeholder: '0',
    defaultValue: '',
  })

  fields.push({
    name: 'isFeatured',
    label: 'Sản phẩm nổi bật?',
    type: 'switch',
    defaultValue: false,
  })

  fields.push({
    name: 'categoryIds',
    label: 'Danh mục sản phẩm',
    type: 'select',
    placeholder: 'Chọn danh mục sản phẩm',
    requiredMessage: 'Phải chọn danh mục sản phẩm',
    defaultValue: '',
    required: true,
    options: categoryIds,
  })

  fields.push({
    name: 'isNewArrival',
    label: 'Sản phẩm mới?',
    type: 'switch',
    defaultValue: false,
  })

  fields.push({
    name: 'brandIds',
    label: 'Thương hiệu sản phẩm',
    type: 'select',
    placeholder: 'Chọn thương hiệu',
    defaultValue: '',
    options: brandIds,
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
