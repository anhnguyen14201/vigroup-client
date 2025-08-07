export function getTranslationField(
  pt: any,
  currentLang: string,
  field: 'productName' | 'metaTitle' | 'metaDescription' | 'desc' | 'name',
) {
  // Nếu pt.translations không tồn tại hoặc không phải mảng có độ dài > 0, trả về chuỗi rỗng
  if (!Array.isArray(pt?.translations) || pt.translations.length === 0) {
    return ''
  }

  // Tìm translation có trùng code
  const found = pt.translations.find(
    (t: any) => (t.language as any).code === currentLang,
  )
  if (found && typeof found[field] === 'string') {
    return found[field]
  }

  // fallback: lấy bản dịch đầu tiên
  return pt.translations[0][field] || ''
}
