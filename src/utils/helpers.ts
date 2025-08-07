export const calculateDiscountPercentage = (
  originalPrice: any,
  discountedPrice: any,
) => {
  // Kiểm tra xem giá gốc có hợp lệ không
  if (originalPrice <= 0) {
    throw new Error('Giá gốc phải lớn hơn 0.')
  }

  // Tính phần trăm giảm giá
  const discountAmount = originalPrice - discountedPrice
  const discountPercentage = (discountAmount / originalPrice) * 100

  return discountPercentage.toFixed(2) // Trả về giá trị phần trăm với 2 chữ số thập phân
}

export const calculatePriceExcludingTax = (
  priceIncludingTax: any,
  taxRate: any,
) => {
  return priceIncludingTax / (1 + taxRate / 100)
}
