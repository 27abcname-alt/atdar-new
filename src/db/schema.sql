-- Atdar.uz ma'lumotlar bazasi (boshlang'ich sxema)
-- PostgreSQL uchun namuna. Ilova hozircha mock ma'lumot ishlatadi.

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ism TEXT NOT NULL,
  tel_raqam TEXT NOT NULL UNIQUE,
  rol TEXT NOT NULL CHECK (rol IN ('sotuvchi', 'xaridor')),
  yaratilgan_sana TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nomi TEXT NOT NULL,
  tavsifi TEXT NOT NULL,
  narxi BIGINT NOT NULL CHECK (narxi >= 0),
  kategoriya TEXT NOT NULL CHECK (kategoriya IN ('qurilish', 'texnika')),
  holati TEXT NOT NULL CHECK (holati IN ('yangi', 'ishlatilgan')),
  status TEXT NOT NULL CHECK (status IN ('kutilmoqda', 'tasdiqlangan', 'sotilgan')),
  sotuvchi_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  atdar_tasdiqlangan BOOLEAN DEFAULT false,
  yaratilgan_sana TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mahsulot_id UUID NOT NULL REFERENCES products (id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  tartib INT NOT NULL DEFAULT 0
);

CREATE TABLE verification_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mahsulot_id UUID NOT NULL REFERENCES products (id) ON DELETE CASCADE,
  foydalanuvchi_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  holat TEXT NOT NULL DEFAULT 'yuborilgan'
    CHECK (holat IN ('yuborilgan', 'jarayonda', 'yakunlangan', 'rad_etilgan')),
  izoh TEXT,
  yaratilgan_sana TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_products_kategoriya ON products (kategoriya);
CREATE INDEX idx_products_status ON products (status);
CREATE INDEX idx_images_mahsulot ON images (mahsulot_id);
