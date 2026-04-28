DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS shop_info CASCADE;

CREATE TABLE stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'My Store',
  slug TEXT NOT NULL UNIQUE,
  tagline TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  logo_url TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  facebook TEXT NOT NULL DEFAULT '',
  instagram TEXT NOT NULL DEFAULT '',
  twitter TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  color TEXT NOT NULL DEFAULT '#6366f1',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(store_id, slug)
);

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
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
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
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
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
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

CREATE INDEX idx_categories_store ON categories(store_id);
CREATE INDEX idx_products_store ON products(store_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_posts_store ON posts(store_id);
CREATE INDEX idx_orders_store ON orders(store_id);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_stores_slug ON stores(slug);

ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "stores_public_read" ON stores FOR SELECT USING (true);
CREATE POLICY "stores_owner_insert" ON stores FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "stores_owner_update" ON stores FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "stores_owner_delete" ON stores FOR DELETE USING (auth.uid() = owner_id);

CREATE OR REPLACE FUNCTION is_store_owner(p_store_id UUID) RETURNS BOOLEAN
  LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM stores WHERE id = p_store_id AND owner_id = auth.uid());
$$;

CREATE POLICY "categories_public_read" ON categories FOR SELECT USING (true);
CREATE POLICY "categories_owner_insert" ON categories FOR INSERT WITH CHECK (is_store_owner(store_id));
CREATE POLICY "categories_owner_update" ON categories FOR UPDATE USING (is_store_owner(store_id));
CREATE POLICY "categories_owner_delete" ON categories FOR DELETE USING (is_store_owner(store_id));

CREATE POLICY "products_public_read" ON products FOR SELECT USING (true);
CREATE POLICY "products_owner_insert" ON products FOR INSERT WITH CHECK (is_store_owner(store_id));
CREATE POLICY "products_owner_update" ON products FOR UPDATE USING (is_store_owner(store_id));
CREATE POLICY "products_owner_delete" ON products FOR DELETE USING (is_store_owner(store_id));

CREATE POLICY "posts_public_read" ON posts FOR SELECT USING (true);
CREATE POLICY "posts_owner_insert" ON posts FOR INSERT WITH CHECK (is_store_owner(store_id));
CREATE POLICY "posts_owner_update" ON posts FOR UPDATE USING (is_store_owner(store_id));
CREATE POLICY "posts_owner_delete" ON posts FOR DELETE USING (is_store_owner(store_id));

CREATE POLICY "orders_anon_insert" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "orders_owner_select" ON orders FOR SELECT USING (is_store_owner(store_id));
CREATE POLICY "orders_owner_update" ON orders FOR UPDATE USING (is_store_owner(store_id));
CREATE POLICY "orders_owner_delete" ON orders FOR DELETE USING (is_store_owner(store_id));

CREATE OR REPLACE FUNCTION public.handle_new_user_store()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_base TEXT;
  v_slug TEXT;
  v_count INT := 0;
BEGIN
  v_base := lower(regexp_replace(split_part(COALESCE(NEW.email, ''), '@', 1), '[^a-z0-9]+', '-', 'g'));
  v_base := trim(both '-' from v_base);
  IF v_base = '' OR v_base IS NULL THEN
    v_base := 'store';
  END IF;
  v_slug := v_base;
  WHILE EXISTS (SELECT 1 FROM stores WHERE slug = v_slug) LOOP
    v_count := v_count + 1;
    v_slug := v_base || '-' || v_count;
  END LOOP;
  INSERT INTO stores (owner_id, slug, name, email)
    VALUES (NEW.id, v_slug, initcap(v_base) || ' Store', NEW.email);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_store ON auth.users;
CREATE TRIGGER on_auth_user_created_store AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_store();

INSERT INTO stores (owner_id, slug, name, email)
SELECT u.id,
       lower(regexp_replace(split_part(COALESCE(u.email, ''), '@', 1), '[^a-z0-9]+', '-', 'g')) || '-' || substr(u.id::text, 1, 4),
       initcap(split_part(COALESCE(u.email, ''), '@', 1)) || ' Store',
       u.email
FROM auth.users u
LEFT JOIN stores s ON s.owner_id = u.id
WHERE s.id IS NULL;