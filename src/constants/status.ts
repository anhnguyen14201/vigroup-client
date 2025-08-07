export const statusClasses: Record<string, string> = {
  true: 'bg-green-100 border-1 border-green-600 text-green-600 px-4 py-1 rounded-full text-xs font-medium',
  false:
    'bg-red-100 border-1 border-red-600 text-red-600 px-4 py-1 rounded-full text-xs font-medium',
}

export const statusProjectClasses: Record<string, string> = {
  processing:
    'bg-yellow-100 border-1 border-yellow-600 text-yellow-600 px-4 py-1 rounded-full text-xs font-medium',
  started:
    'bg-green-100 border-1 border-green-600 text-green-600 px-4 py-1 rounded-full text-xs font-medium',
  successed:
    'bg-green-100 border-1 border-green-600 text-green-600 px-4 py-1 rounded-full text-xs font-medium',
  finished:
    'bg-blue-100 border-1 border-blue-600 text-blue-600 px-4 py-1 rounded-full text-xs font-medium',
  cancelled:
    'bg-red-100 border-1 border-red-600 text-red-600 px-4 py-1 rounded-full text-xs font-medium',
}

export const statusProjectLabels: Record<string, string> = {
  processing: 'Đang xử lý',
  started: 'Bắt đầu',
  finished: 'Hoàn thành',
  cancelled: 'Hủy bỏ',
  successed: 'Xác nhận',
}

export const paymentStatusClasses: Record<string, string> = {
  // Đang xử lý (Processing): Sử dụng gam màu xanh lam, biểu thị trạng thái đang chờ xử lý
  processing:
    'bg-yellow-100 border border-yellow-600 text-yellow-600 px-3 py-1 rounded-full text-xs font-semibold',

  // Chưa thanh toán (Unpaid): Gam màu đỏ để cảnh báo rằng chưa có khoản thanh toán nào
  unpaid:
    'bg-red-100 border border-red-600 text-red-600 px-3 py-1 rounded-full text-xs font-semibold',

  // Đã đặt cọc (Deposited): Sử dụng gam màu vàng ấm áp, cho thấy đã nhận được tiền đặt cọc
  deposited:
    'bg-orange-100 border border-orange-600 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold',

  // Thanh toán một phần (Partial): Gam màu cam, biểu thị khoản thanh toán chỉ đủ một phần
  partial:
    'bg-blue-100 border border-blue-600 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold',

  // Đã thanh toán hết (Paid): Gam màu xanh lá cây, biểu thị quá trình thanh toán đã hoàn tất
  paid: 'bg-green-100 border border-green-600 text-green-700 px-3 py-1 rounded-full text-xs font-semibold',
}

export const paymentStatusLabels: Record<string, string> = {
  unpaid: 'Chưa thanh toán',
  deposited: 'Đã đặt cọc',
  partial: 'Thanh toán 1 phần',
  paid: 'Đã thanh toán',
  processing: 'Đang xử lý',
}

export const invoiceStatusLabels: Record<string, string> = {
  draft:
    'bg-yellow-100 border-1 border-yellow-600 text-yellow-600 px-4 py-1 rounded-full text-xs font-medium',
  quote:
    'bg-green-100 border-1 border-green-600 text-green-600 px-4 py-1 rounded-full text-xs font-medium',
  invoice:
    'bg-blue-100 border-1 border-blue-600 text-blue-600 px-4 py-1 rounded-full text-xs font-medium',
}

export const warrantyStatusClasses: Record<string, string> = {
  active:
    'bg-green-100 border-1 border-green-600 text-green-600 px-4 py-1 rounded-full text-xs font-medium',
  expired:
    'bg-red-100 border-1 border-red-600 text-red-600 px-4 py-1 rounded-full text-xs font-medium',
}
