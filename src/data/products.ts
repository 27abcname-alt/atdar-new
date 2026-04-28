import type { Product } from "@/types/database";

export const mockProducts: Product[] = [
  {
    id: "1",
    nomi: "Beton armaturalari 12mm, yangi qoldiq",
    tavsifi:
      "Loyiha tugagach qolgan sertifikatli armaturalar. To'liq to'plam, ombordan chiqarish.",
    narxi: 18_500_000,
    valyuta: "UZS",
    kategoriya: "qurilish",
    holati: "yangi",
    status: "tasdiqlangan",
    sotuvchi_id: "u1",
    atdar_tasdiqlangan: true,
  },
  {
    id: "2",
    nomi: "Bosch GSH 11E demolitsiya bolg'ichasi",
    tavsifi:
      "Ishlatilgan, texnik xizmat ko'rsatilgan. Qo'shimcha uch og'iz va sumka bilan.",
    narxi: 4_200_000,
    valyuta: "UZS",
    kategoriya: "texnika",
    holati: "ishlatilgan",
    status: "tasdiqlangan",
    sotuvchi_id: "u2",
    atdar_tasdiqlangan: true,
  },
  {
    id: "3",
    nomi: "Cement M500, 50 ta qop",
    tavsifi:
      "Qurilish yakunlandi, quruq omborda saqlangan. Partiya bir xil.",
    narxi: 9_800_000,
    valyuta: "UZS",
    kategoriya: "qurilish",
    holati: "yangi",
    status: "tasdiqlangan",
    sotuvchi_id: "u1",
    atdar_tasdiqlangan: false,
  },
  {
    id: "4",
    nomi: "Hitachi circular arra 1900W",
    tavsifi: "Yengil izlar, barcha funksiyalar ishlaydi. Yangi disk bilan.",
    narxi: 1_850_000,
    valyuta: "UZS",
    kategoriya: "texnika",
    holati: "ishlatilgan",
    status: "kutilmoqda",
    sotuvchi_id: "u3",
    atdar_tasdiqlangan: false,
  },
  {
    id: "5",
    nomi: "Mineral plitalar (fasad) 120 m²",
    tavsifi: "Rang: och kulrang. Yetkazib berish Toshkent bo'ylab mumkin.",
    narxi: 22_000_000,
    valyuta: "UZS",
    kategoriya: "qurilish",
    holati: "yangi",
    status: "tasdiqlangan",
    sotuvchi_id: "u4",
    atdar_tasdiqlangan: true,
  },
  {
    id: "6",
    nomi: "Stanley qo'l asboblari to'plami",
    tavsifi: "18 ta buyum, professional seriya. Kafolat varag'i mavjud.",
    narxi: 920_000,
    valyuta: "UZS",
    kategoriya: "texnika",
    holati: "yangi",
    status: "sotilgan",
    sotuvchi_id: "u2",
    atdar_tasdiqlangan: true,
  },
];

export function getProductById(id: string): Product | undefined {
  return mockProducts.find((p) => p.id === id);
}

export function formatPriceUZS(n: number): string {
  return new Intl.NumberFormat("uz-UZ").format(n) + " so'm";
}

export function productImageUrl(id: string, seed = 0): string {
  return `https://picsum.photos/seed/atdar-${id}-${seed}/800/600`;
}
