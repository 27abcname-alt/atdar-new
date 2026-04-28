/**
 * Ma'lumotlar bazasi sxemasi (PostgreSQL / boshqa DB uchun asos).
 * Jadvallar: Users, Products, Images, Verification_Requests
 */

export type UserRole = "sotuvchi" | "xaridor";

export interface User {
  id: string;
  ism: string;
  tel_raqam: string;
  rol: UserRole;
  yaratilgan_sana?: string;
}

export type ProductCategory = "qurilish" | "texnika";
export type ProductCondition = "yangi" | "ishlatilgan";
export type ProductStatus = "kutilmoqda" | "tasdiqlangan" | "sotilgan";

export interface Product {
  id: string;
  nomi: string;
  tavsifi: string;
  narxi: number;
  valyuta: "UZS";
  kategoriya: ProductCategory;
  holati: ProductCondition;
  status: ProductStatus;
  sotuvchi_id: string;
  atdar_tasdiqlangan?: boolean;
  yaratilgan_sana?: string;
}

export interface ProductImage {
  id: string;
  mahsulot_id: string;
  url: string;
  tartib: number;
}

export type VerificationStatus = "yuborilgan" | "jarayonda" | "yakunlangan" | "rad_etilgan";

export interface VerificationRequest {
  id: string;
  mahsulot_id: string;
  foydalanuvchi_id: string;
  holat: VerificationStatus;
  izoh?: string;
  yaratilgan_sana?: string;
}
