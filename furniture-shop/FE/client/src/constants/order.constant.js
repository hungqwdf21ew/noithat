export const ORDER_STATUS_CONFIG = {
  CHO_XAC_NHAN: { label: 'Chờ xác nhận', color: 'pending' },
  DA_XAC_NHAN:  { label: 'Đã xác nhận',  color: 'confirmed' },
  DANG_GIAO:    { label: 'Đang giao',     color: 'shipping' },
  HOAN_THANH:   { label: 'Hoàn thành',   color: 'done' },
  DA_HUY:       { label: 'Đã huỷ',       color: 'cancelled' },
};

export const ORDER_PAYMENT_LABEL = {
  THANH_TOAN_KHI_NHAN_HANG: 'Thanh toán khi nhận hàng (COD)',
  CHUYEN_KHOAN: 'Chuyển khoản ngân hàng',
  MOMO: 'Ví MoMo',
  VNPAY: 'VNPay',
};

export const ORDER_FILTER_TABS = [
  { value: 'ALL', label: 'Tất cả' },
  { value: 'CHO_XAC_NHAN', label: 'Chờ xác nhận' },
  { value: 'DA_XAC_NHAN', label: 'Đã xác nhận' },
  { value: 'DANG_GIAO', label: 'Đang giao' },
  { value: 'HOAN_THANH', label: 'Hoàn thành' },
  { value: 'DA_HUY', label: 'Đã huỷ' },
];
