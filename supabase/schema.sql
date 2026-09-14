-- ========================================================
-- Schema & Initial Seed Script - ShopAhora Panamá
-- Base de Datos PostgreSQL / Supabase Complete Setup
-- ========================================================

-- 1. Extensions & Enums
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('cliente_b2c', 'cliente_b2b', 'vendedor_b2b', 'supervisor', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE order_channel AS ENUM ('b2c', 'b2b');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_method_type AS ENUM ('contado', 'credito_b2b', 'cheque_posfechado');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE fleet_vehicle AS ENUM ('moto', 'sedan', 'panel', 'camion_5t');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE approval_status_type AS ENUM ('pendiente_aprobacion', 'aprobado', 'rechazado');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- --------------------------------------------------------
-- 2. Profiles Table (RBAC, B2B Credit & Sales Rep Controls)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'cliente_b2c',
  company_name TEXT,
  ruc_dv TEXT,
  credit_limit NUMERIC(12,2) DEFAULT 0.00,
  credit_days INT DEFAULT 30, -- 15, 30, 45, 60 días
  credit_used NUMERIC(12,2) DEFAULT 0.00,
  is_tax_exempt BOOLEAN DEFAULT FALSE,
  sales_rep_id UUID REFERENCES public.profiles(id),
  sales_rep_name TEXT,
  commission_rate NUMERIC(5,2) DEFAULT 4.50,
  max_discount_authorized NUMERIC(5,2) DEFAULT 15.00,
  assigned_territory TEXT DEFAULT 'Panamá Centro & Provincias',
  is_active_account BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- --------------------------------------------------------
-- 3. Categories Table (SEO Slugs & Tax Exemption Rules)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  is_itbms_exempt BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- --------------------------------------------------------
-- 4. Products Table (B2C & B2B Inventory Rules)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  retail_price NUMERIC(10,2) NOT NULL,
  b2b_price NUMERIC(10,2) NOT NULL,
  b2b_discount_percent NUMERIC(5,2) DEFAULT 15.00,
  category_slug TEXT NOT NULL DEFAULT 'tecnologia',
  is_itbms_exempt BOOLEAN DEFAULT FALSE,
  stock_physical INT NOT NULL DEFAULT 10,
  allow_dropshipping BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  rating NUMERIC(3,2) DEFAULT 5.00,
  reviews_count INT DEFAULT 1,
  badge TEXT,
  colors JSONB DEFAULT '[]'::jsonb,
  features TEXT[] DEFAULT ARRAY[]::TEXT[],
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- --------------------------------------------------------
-- 5. Shipping Rates Matrix Panama
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.shipping_rates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  province TEXT NOT NULL,
  vehicle_type fleet_vehicle NOT NULL,
  base_rate NUMERIC(10,2) NOT NULL,
  estimated_hours INT DEFAULT 24
);

-- --------------------------------------------------------
-- 6. Orders Table (Multichannel & Sales Proposal Approvals)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES public.profiles(id),
  customer_name TEXT NOT NULL,
  sales_rep_name TEXT,
  customer_role user_role NOT NULL DEFAULT 'cliente_b2c',
  channel order_channel NOT NULL DEFAULT 'b2c',
  subtotal NUMERIC(10,2) NOT NULL,
  itbms_tax NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  shipping_cost NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  discount_amount NUMERIC(10,2) DEFAULT 0.00,
  total_amount NUMERIC(10,2) NOT NULL,
  payment_method payment_method_type NOT NULL DEFAULT 'contado',
  payment_status TEXT DEFAULT 'pendiente',
  shipping_province TEXT NOT NULL,
  shipping_city TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  shipping_vehicle fleet_vehicle DEFAULT 'panel',
  tracking_status TEXT DEFAULT 'Pedido Recibido',
  approval_status approval_status_type DEFAULT 'aprobado',
  proposed_discount_percent NUMERIC(5,2) DEFAULT 0.00,
  proposed_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- --------------------------------------------------------
-- 7. Order Items Table
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  quantity INT NOT NULL,
  unit_price NUMERIC(10,2) NOT NULL,
  total_price NUMERIC(10,2) NOT NULL,
  selected_color TEXT,
  is_modified BOOLEAN DEFAULT FALSE
);

-- --------------------------------------------------------
-- 8. B2B Credit Accounts (Facturación & Cobranzas)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.b2b_credit_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id),
  order_id UUID REFERENCES public.orders(id),
  company_name TEXT NOT NULL,
  sales_rep_name TEXT,
  invoice_number TEXT NOT NULL UNIQUE,
  amount NUMERIC(10,2) NOT NULL,
  due_date DATE NOT NULL,
  status TEXT DEFAULT 'vigente', -- 'vigente', 'vencida', 'pagada'
  early_discount_percent NUMERIC(5,2) DEFAULT 5.00,
  early_discount_expiry DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- --------------------------------------------------------
-- 9. Postdated Checks (Cheques Posfechados en Custodia)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.postdated_checks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id),
  company_name TEXT NOT NULL,
  bank_name TEXT NOT NULL,
  check_number TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  check_date DATE NOT NULL,
  status TEXT DEFAULT 'pendiente', -- 'pendiente', 'depositado', 'rebotado'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- --------------------------------------------------------
-- 10. Stock Losses (Gestión de Mermas)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.stock_losses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES public.products(id),
  product_name TEXT NOT NULL,
  quantity INT NOT NULL,
  reason TEXT NOT NULL,
  reported_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- --------------------------------------------------------
-- 11. Storage Bucket Setup (AWS S3 / Supabase Images)
-- --------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('shopahora-panama-assets', 'shopahora-panama-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public products reading" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public profiles reading" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public orders reading" ON public.orders FOR SELECT USING (true);

-- ========================================================
-- SEED DATA (DATOS INICIALES DE PRUEBA PARÁ PANAMÁ)
-- ========================================================

-- Categorías
INSERT INTO public.categories (name, slug, is_itbms_exempt) VALUES
('Audio & Sonido', 'audio', false),
('Hogar & Ambiente', 'hogar', false),
('Tecnología', 'tecnologia', false),
('Accesorios', 'accesorios', false)
ON CONFLICT (slug) DO NOTHING;

-- Usuarios de Prueba RBAC
INSERT INTO public.profiles (email, full_name, role, company_name, ruc_dv, credit_limit, credit_days, credit_used, is_tax_exempt, commission_rate, max_discount_authorized, assigned_territory) VALUES
('admin@shopahora.com', 'Sofía Morales (Gerente General)', 'admin', 'ShopAhora S.A.', '155789234-2-2026 DV 45', 0, 30, 0, false, 0, 30, 'Nacional'),
('vendedor@shopahora.com', 'Carlos Mendoza (Vendedor B2B)', 'vendedor_b2b', 'ShopAhora Comercial', NULL, 0, 30, 0, false, 4.5, 15, 'Panamá Centro & Chiriquí'),
('cliente.b2b@shopahora.com', 'Distribuidora Istmo S.A.', 'cliente_b2b', 'Distribuidora Istmo S.A.', '155729102-2-2021 DV 45', 15000, 30, 4250, true, 0, 0, 'Panamá Centro'),
('cliente.b2c@shopahora.com', 'Ana María Rodríguez', 'cliente_b2c', NULL, NULL, 0, 15, 0, false, 0, 0, 'Panamá Oeste')
ON CONFLICT (email) DO NOTHING;

-- Productos Iniciales
INSERT INTO public.products (name, subtitle, description, retail_price, b2b_price, b2b_discount_percent, category_slug, is_itbms_exempt, stock_physical, allow_dropshipping, is_active, rating, reviews_count, badge, images, features) VALUES
(
  'Audífonos Studio Pro Wireless',
  'Cancelación de Ruido Activa & Audio Espacial HD',
  'Experiencia sonora de alta fidelidad con diafragmas de titanio de 40mm. Batería de 40 horas con carga rápida USB-C y almohadillas viscoelásticas ultra confortables.',
  199.99, 159.99, 20, 'audio', false, 15, false, true, 4.9, 128, 'Destacado',
  ARRAY['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop'],
  ARRAY['Cancelación de ruido adaptativa ANC Pro', 'Autonomía de 40 horas continuas', 'Bluetooth 5.3 de baja latencia', 'Micrófonos cuadruples con filtro de IA']
),
(
  'Humidificador Ultrasónico Confort LED',
  'Difusor de Aroma & Luz Ambiental RGB',
  'Mantén el ambiente perfecto en tu hogar u oficina. Operación supersilenciosa (<25dB), temporizador programable y tanque de 2.5 Litros de gran capacidad.',
  49.99, 39.99, 20, 'hogar', false, 8, true, true, 4.7, 85, 'Nuevo',
  ARRAY['https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1000&auto=format&fit=crop'],
  ARRAY['Capacidad de 2.5L para 12h continuas', 'Luz LED RGB de 7 colores seleccionables', 'Autoapagado de seguridad sin agua', 'Compatible con aceites esenciales puros']
),
(
  'Smartwatch Titanium Sport GPS',
  'Monitoreo de Salud 24/7 & Resistencia 50m',
  'Reloj inteligente con caja de titanio de grado aeroespacial. Pantalla AMOLED de 1.4 pulgadas, GPS dual integrado y métricas avanzadas de VO2 Max y pulso.',
  299.99, 239.99, 20, 'tecnologia', false, 25, false, true, 4.9, 210, 'Destacado',
  ARRAY['https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop'],
  ARRAY['Caja de titanio liviana y resistente', 'Pantalla AMOLED de cristal de zafiro', 'GPS de doble frecuencia de alta precisión', 'Resistencia al agua hasta 5 ATM (50m)']
),
(
  'Mochila Ejecutiva Anti-Robo Impermeable',
  'Puerto de Carga USB & Compartimento para Laptop 16"',
  'Diseñada para el profesional moderno. Materiales de alta densidad repelentes al agua, cremalleras ocultas anti-corte y distribución ergonómica del peso.',
  79.99, 59.99, 25, 'accesorios', false, 12, true, true, 4.8, 94, 'Oferta',
  ARRAY['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop'],
  ARRAY['Tela Oxford impermeable de alta durabilidad', 'Bolsillo de seguridad dorsal oculto', 'Puerto externo de carga USB integrado', 'Compartimento acolchado antigolpes']
)
ON CONFLICT DO NOTHING;
