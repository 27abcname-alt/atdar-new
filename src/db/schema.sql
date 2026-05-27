-- Atdar.uz ma'lumotlar bazasi sxemasi (Yangilangan)

-- 1. Enumlarni yaratish
CREATE TYPE user_role AS ENUM ('buyer', 'seller', 'moderator');
CREATE TYPE listing_status AS ENUM ('pending', 'approved', 'rejected');

-- 2. Profiles jadvalini yangilash (yoki yaratish)
-- Eslatma: Supabase-da profiles jadvali odatda auth.users ga bog'langan bo'ladi
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone_number TEXT,
  role user_role, -- DEFAULT olib tashlandi, majburiy tanlash uchun
  rating FLOAT DEFAULT 0,
  verified_count INT DEFAULT 0,
  experience_years INT DEFAULT 0,
  successful_reviews_count INT DEFAULT 0,
  joined_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Profiles uchun trigger yaratish (auth.users dan profile ga avtomatik qo'shish)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone_number)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'phone_number');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. Listings (sobiq products) jadvalini yaratish
CREATE TABLE IF NOT EXISTS listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price BIGINT NOT NULL CHECK (price >= 0),
  category TEXT,
  condition TEXT,
  usage_duration TEXT,
  location TEXT,
  phone_number TEXT,
  status listing_status DEFAULT 'pending',
  moderator_id UUID REFERENCES profiles(id),
  rejection_reason TEXT,
  requirements_met BOOLEAN DEFAULT false,
  image_url TEXT,
  views_count INT DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Reviews jadvalini yaratish
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  stars INT NOT NULL CHECK (stars >= 1 AND stars <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Images jadvalini yangilash
CREATE TABLE IF NOT EXISTS images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. RLS (Row Level Security) siyosatlarini o'rnatish
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;

-- Profiles siyosatlari
CREATE POLICY "Profillarni hamma ko'rishi" ON profiles FOR SELECT USING (true);
CREATE POLICY "Foydalanuvchi o'z profilini yangilashi" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Listings siyosatlari
-- Anonim foydalanuvchi faqat ko'ra olsin (SELECT)
CREATE POLICY "Hammasini ko'rish" ON listings
  FOR SELECT USING (true);

-- Seller faqat o'zinikini yaratsa bo'lsin (INSERT)
CREATE POLICY "Sotuvchi o'z e'lonini qo'shishi" ON listings
  FOR INSERT 
  WITH CHECK (
    auth.uid() = user_id AND 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'seller'
    )
  );

-- Moderator hamma elonning statusini o'zgartira olsin (UPDATE)
CREATE POLICY "Moderator statusni o'zgartirishi" ON listings
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'moderator'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'moderator'
    )
  );

-- Seller o'z e'lonini tahrirlashi (ixtiyoriy, lekin kerak bo'lishi mumkin)
CREATE POLICY "Sotuvchi o'z e'lonini tahrirlashi" ON listings
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Reviews siyosatlari
CREATE POLICY "Sharhlarni hamma ko'rishi" ON reviews FOR SELECT USING (true);
CREATE POLICY "Foydalanuvchi sharh qoldirishi" ON reviews FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Images siyosatlari
CREATE POLICY "Rasmlarni hamma ko'rishi" ON images FOR SELECT USING (true);
CREATE POLICY "Sotuvchi rasm yuklashi" ON images FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM listings 
    WHERE id = listing_id AND user_id = auth.uid()
  )
);

-- Indekslar
CREATE INDEX idx_listings_user ON listings (user_id);
CREATE INDEX idx_listings_status ON listings (status);
CREATE INDEX idx_reviews_listing ON reviews (listing_id);

-- 7. Supabase Webhook va Telegram bildirishnomalari uchun sozlamalar

-- Webhook funksiyasi (Supabase UI orqali ham sozlash mumkin)
-- Eslatma: Ushbu SQL faqat e'lonlarni kuzatish uchun trigger yaratadi.
-- Haqiqiy Edge Function-ni `supabase functions deploy telegram-notify` orqali yuklash kerak.

CREATE OR REPLACE FUNCTION public.notify_telegram_on_listing_change()
RETURNS trigger AS $$
BEGIN
  -- Bu funksiya aslida Supabase Database Webhook tomonidan avtomatik boshqariladi.
  -- Lekin trigger orqali qo'shimcha mantiq yozish mumkin.
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Listings o'zgarganda (INSERT/UPDATE) Webhook-ni ishga tushirish uchun belgi
-- Supabase Dashboard: Database -> Webhooks orqali 'telegram-notify' function-ga ulanadi.
