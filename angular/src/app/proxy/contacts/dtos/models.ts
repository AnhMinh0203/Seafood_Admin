export interface CreateContactRequestDto {
  fullName: string;
  phone: string;
  interestedProduct: number;
  inquiryType: number;
  message: string;
}

export interface ContactRequestDto {
  id: string;
  fullName?: string;
  phone?: string;
  interestedProduct?: ContactProductType;
  inquiryType?: ContactInquiryType;
  message?: string;
  status?: ContactRequestStatus;
  creationTime?: string;
}

export enum ContactProductType {
  ComboGaRan = 1,
  BurgerBo = 2,
  PizzaHaiSan = 3,
  MiYSotKem = 4,
  CaHoiNuong = 5,
  Khac = 6,
}

export enum ContactInquiryType {
  TuVanSanPham = 1,
  DatHangSoLuongLon = 2,
  HopTacDaiLy = 3,
  KhieuNaiHoTro = 4,
  GopYDichVu = 5,
}

export enum ContactRequestStatus {
  Pending = 0,
  Processed = 1,
}