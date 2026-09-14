-- ========================================================
-- Schema E-Commerce Retail & B2B Panamá (ShopAhora)
-- PostgreSQL / Supabase Migration Script
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum for User Roles
CREATE TYPE user_role AS ENUM (
  'cliente_b2c',
  'cliente_b2b',
  'vendedor_b2b',
  'supervisor',
  'admin'
);

-- Enum for Order Channels
CREATE TYPE order_channel AS ENUM ('b2c', 'b2b');

-- Enum for Payment Methods
CREATE TYPE payment_method_type AS ENUM ('contado', 'credito_b2b', 'cheque_posfechado');

-- Enum for Fleet Vehicles in Panama
CREATE TYPE fleet_vehicle AS ENUM ('moto', 'sedan', 'panel', 'camion_5t');

-- --------------------------------------------------------
-- 1. Profiles Table (RBAC & B2B Credit Limits)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'cliente_b2c',
  company_name TEXT,
  ruc_dv TEXT,
  credit_limit NUMERIC(12,2) DEFAULT 0.00,
  credit_days INT DEFAULT 30, -- 15, 30, 45 días
  credit_used NUMERIC(12,2) DEFAULT 0.00,
  is_tax_exempt BOOLEAN DEFAULT FALSE,
  sales_rep_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- --------------------------------------------------------
-- 2. Categories Table (ITBMS Exemption Config)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  is_itbms_exempt BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- --------------------------------------------------------
-- 3. Products Table (B2C & B2B Inventory Rules)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  retail_price NUMERIC(10,2) NOT NULL,
  b2b_discount_percent NUMERIC(5,2) DEFAULT 15.00,
  category_id UUID REFERENCES public.categories(id),
  stock_physical INT NOT NULL DEFAULT 0,
  allow_dropshipping BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  badge TEXT,
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  features TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- --------------------------------------------------------
-- 4. Shipping Rates Matrix Panama
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.shipping_rates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  province TEXT NOT NULL,
  vehicle_type fleet_vehicle NOT NULL,
  base_rate NUMERIC(10,2) NOT NULL,
  estimated_hours INT DEFAULT 24
);

-- --------------------------------------------------------
-- 5. Orders Table
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES public.profiles(id),
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
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- --------------------------------------------------------
-- 6. Order Items Table
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  quantity INT NOT NULL,
  unit_price NUMERIC(10,2) NOT NULL,
  total_price NUMERIC(10,2) NOT NULL,
  is_modified BOOLEAN DEFAULT FALSE
);

-- --------------------------------------------------------
-- 7. B2B Credit Accounts (Facturación & Cobranzas)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.b2b_credit_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id),
  order_id UUID REFERENCES public.orders(id),
  invoice_number TEXT NOT NULL UNIQUE,
  amount NUMERIC(10,2) NOT NULL,
  due_date DATE NOT NULL,
  status TEXT DEFAULT 'vigente', -- 'vigente', 'vencida', 'pagada'
  early_discount_percent NUMERIC(5,2) DEFAULT 5.00,
  early_discount_expiry DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- --------------------------------------------------------
-- 8. Postdated Checks (Cheques Posfechados)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.postdated_checks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id),
  bank_name TEXT NOT NULL,
  check_number TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  check_date DATE NOT NULL,
  status TEXT DEFAULT 'pendiente', -- 'pendiente', 'depositado', 'rebotado'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- --------------------------------------------------------
-- 9. Stock Losses (Gestión de Mermas)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.stock_losses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES public.products(id),
  quantity INT NOT NULL,
  reason TEXT NOT NULL,
  reported_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Row Level Security (RLS) Setup
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public products reading" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public profiles reading" ON public.profiles FOR SELECT USING (true);
