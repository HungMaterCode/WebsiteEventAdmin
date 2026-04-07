/**
 * Định dạng số thành tiền tệ Việt Nam Đồng (VNĐ)
 * Ví dụ: 500000 -> 500.000 VNĐ
 */
export function formatCurrency(amount: number | string): string {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numericAmount)) return '0 VNĐ';
  
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(numericAmount).replace('₫', 'VNĐ');
}
