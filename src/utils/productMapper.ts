export const mapProductToForm = (
  prod: any,
  languages: any,
): Record<string, any> => {
  const init: Record<string, any> = {}

  // 1. Non-i18n fields
  init.code = prod.code || ''
  init.cost = prod.cost ?? ''
  init.price = prod.price ?? ''
  init.tax = prod.tax ?? ''
  init.discount = prod.discount ?? ''
  init.quantity = prod.quantity ?? 0
  init.isFeatured = prod.isFeatured ?? false
  init.isNewArrival = prod.isNewArrival ?? false

  // Mảng categoryIds / brandIds

  init.categoryIds =
    typeof prod.categoryIds === 'string'
      ? prod.categoryIds
      : (prod.categoryIds as any)?._id || ''

  init.brandIds =
    typeof prod.brandIds === 'string'
      ? prod.brandIds
      : (prod.brandIds as any)?._id || ''
  // 2. Translations multi-language
  if (Array.isArray(languages)) {
    languages.forEach(lang => {
      const code = lang.code
      // tìm translation đúng code
      const tr = prod.translations.find(
        (t: any) => (t.language as any).code === code,
      ) || {
        productName: '',
        shortDesc: '',
        desc: '',
        specifications: '',
        metaDescription: '',
      }
      init[`productName_${code}`] = tr.productName || ''
      init[`shortDesc_${code}`] = tr.shortDesc || ''
      init[`desc_${code}`] = tr.desc || ''
      init[`specifications_${code}`] = tr.specifications || ''
      init[`metaDescription_${code}`] = tr.metaDescription || ''
    })
  }

  // 3. File inputs: để trống (để user có thể upload mới nếu cần)
  init.thumbnail = undefined
  init.images = []

  return init
}
