CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT '',
  color TEXT NOT NULL DEFAULT '#6366f1',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price NUMERIC NOT NULL DEFAULT 0,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  images TEXT[] NOT NULL DEFAULT '{}',
  video_url TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','draft','out_of_stock')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  excerpt TEXT NOT NULL DEFAULT '',
  cover_image TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  author TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL DEFAULT '',
  customer_phone TEXT NOT NULL DEFAULT '',
  shipping_address TEXT NOT NULL DEFAULT '',
  items JSONB NOT NULL DEFAULT '[]'::JSONB,
  total NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','processing','shipped','delivered','cancelled')),
  notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE shop_info (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  name TEXT NOT NULL DEFAULT 'My Shop',
  tagline TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  logo_url TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  facebook TEXT NOT NULL DEFAULT '',
  instagram TEXT NOT NULL DEFAULT '',
  twitter TEXT NOT NULL DEFAULT ''
);

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_info ENABLE ROW LEVEL SECURITY;

CREATE POLICY "categories_public_read" ON categories FOR SELECT USING (true);
CREATE POLICY "categories_auth_insert" ON categories FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "categories_auth_update" ON categories FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "categories_auth_delete" ON categories FOR DELETE USING (auth.uid() IS NOT NULL);

CREATE POLICY "products_public_read" ON products FOR SELECT USING (true);
CREATE POLICY "products_auth_insert" ON products FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "products_auth_update" ON products FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "products_auth_delete" ON products FOR DELETE USING (auth.uid() IS NOT NULL);

CREATE POLICY "posts_public_read" ON posts FOR SELECT USING (true);
CREATE POLICY "posts_auth_insert" ON posts FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "posts_auth_update" ON posts FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "posts_auth_delete" ON posts FOR DELETE USING (auth.uid() IS NOT NULL);

CREATE POLICY "orders_anon_insert" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "orders_auth_select" ON orders FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "orders_auth_update" ON orders FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "orders_auth_delete" ON orders FOR DELETE USING (auth.uid() IS NOT NULL);

CREATE POLICY "shop_info_public_read" ON shop_info FOR SELECT USING (true);
CREATE POLICY "shop_info_auth_insert" ON shop_info FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "shop_info_auth_update" ON shop_info FOR UPDATE USING (auth.uid() IS NOT NULL);

INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "product_images_public_read" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "product_images_auth_insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.uid() IS NOT NULL);
CREATE POLICY "product_images_auth_delete" ON storage.objects FOR DELETE USING (bucket_id = 'product-images' AND auth.uid() IS NOT NULL);

INSERT INTO shop_info (id, name, tagline, description, email, phone, address) 
VALUES (1, 'My Shop', 'Quality products for everyone', 'Welcome to our online store - curated items at great prices.', 'hello@myshop.com', '+84 901 234 567', '123 Le Loi, District 1, HCMC');

INSERT INTO categories (name, slug, description, color) VALUES
  ('Electronics', 'electronics', 'Gadgets and devices', '#6366f1'),
  ('Apparel', 'apparel', 'Clothing and fashion', '#ec4899'),
  ('Home & Living', 'home-living', 'Furniture and decor', '#10b981'),
  ('Books', 'books', 'Reading material', '#f59e0b'),
  ('Beauty', 'beauty', 'Skincare and cosmetics', '#8b5cf6'),
  ('Sports', 'sports', 'Fitness gear', '#ef4444');

INSERT INTO products (name, description, price, category_id, images, video_url, status) VALUES
  ('Wireless Headphones Pro', '<p>Premium <strong>noise-cancelling</strong> over-ear headphones with 40-hour battery life.</p>', 5990000, (SELECT id FROM categories WHERE slug='electronics'), ARRAY['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600','https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600'], 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'active'),
  ('Smart Watch Series 8', '<p>Fitness tracking with <em>continuous</em> heart rate monitor and ECG.</p>', 9590000, (SELECT id FROM categories WHERE slug='electronics'), ARRAY['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'], '', 'active'),
  ('Cotton Crew Tee', '<p>Soft 100% organic cotton t-shirt.</p>', 720000, (SELECT id FROM categories WHERE slug='apparel'), ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600'], '', 'active'),
  ('Denim Jacket', '<p>Classic <strong>vintage wash</strong> denim jacket.</p>', 2150000, (SELECT id FROM categories WHERE slug='apparel'), ARRAY['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600'], '', 'out_of_stock'),
  ('Modern Floor Lamp', '<p>Minimalist LED floor lamp with adjustable dimmer.</p>', 3820000, (SELECT id FROM categories WHERE slug='home-living'), ARRAY['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600'], '', 'active'),
  ('The Design Handbook', '<p>Essential reading for modern designers.</p>', 850000, (SELECT id FROM categories WHERE slug='books'), ARRAY['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600'], '', 'active'),
  ('Vitamin C Serum', '<p>Brightening serum with hyaluronic acid.</p>', 1150000, (SELECT id FROM categories WHERE slug='beauty'), ARRAY['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600'], '', 'active'),
  ('Yoga Mat Premium', '<p>Eco-friendly non-slip yoga mat.</p>', 1620000, (SELECT id FROM categories WHERE slug='sports'), ARRAY['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600'], '', 'active'),
  ('Bluetooth Speaker Mini', '<p>Portable waterproof speaker with 24-hour playtime.</p>', 1920000, (SELECT id FROM categories WHERE slug='electronics'), ARRAY['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600'], '', 'draft'),
  ('Ceramic Plant Pot Set', '<p>Set of 3 minimalist ceramic pots.</p>', 1010000, (SELECT id FROM categories WHERE slug='home-living'), ARRAY['https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600'], '', 'active');

INSERT INTO posts (title, content, excerpt, status, author) VALUES
  ('Welcome to Our Store', '<p>We are excited to launch our new online shop.</p>', 'Excited to launch our new online shop', 'published', 'Admin'),
  ('Summer Collection 2026', '<p>Discover our latest summer arrivals.</p>', 'Latest summer arrivals are here', 'published', 'Admin'),
  ('Sustainability Pledge', '<p>How we are reducing packaging waste by 40%.</p>', 'Our sustainability roadmap', 'draft', 'Admin'),
  ('Customer Stories', '<p>Real reviews from happy customers.</p>', 'Hear what customers say', 'published', 'Admin');