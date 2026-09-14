export type UserRole = 'cliente_b2c' | 'cliente_b2b' | 'vendedor_b2b' | 'supervisor' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  companyName?: string;
  rucDv?: string;
  creditLimit: number;
  creditDays: 15 | 30 | 45;
  creditUsed: number;
  isTaxExempt: boolean;
  salesRepId?: string;
  salesRepName?: string;
  commissionRate?: number;
  maxDiscountAuthorized?: number;
  assignedTerritory?: string;
  isActiveAccount?: boolean;
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  price: number; // Retail Price
  originalPrice?: number;
  b2bPrice: number; // Wholesale Price
  b2bDiscountPercent: number;
  category: 'audio' | 'hogar' | 'accesorios' | 'tecnologia';
  isItbmsExempt: boolean;
  stockPhysical: number;
  allowDropshipping: boolean;
  isActive: boolean;
  rating: number;
  reviewsCount: number;
  images: string[];
  badge?: 'Nuevo' | 'Destacado' | 'Edición Limitada' | 'Oferta';
  colors?: { name: string; hex: string }[];
  features: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export type PanamaProvince = 
  | 'Panamá Centro'
  | 'Panamá Oeste'
  | 'Colón'
  | 'Provincias Centrales (Coclé, Herrera, Los Santos, Veraguas)'
  | 'Chiriquí'
  | 'Bocas del Toro & Comarcas';

export type FleetVehicle = 'moto' | 'sedan' | 'panel' | 'camion_5t';

export interface ShippingRate {
  province: PanamaProvince;
  vehicle: FleetVehicle;
  rate: number;
  estimatedHours: number;
}

export interface B2BCreditAccount {
  id: string;
  userId: string;
  userEmail: string;
  companyName: string;
  salesRepName: string;
  invoiceNumber: string;
  amount: number;
  dueDate: string; // YYYY-MM-DD
  status: 'vigente' | 'vencida' | 'pagada';
  earlyDiscountPercent: number;
  earlyDiscountExpiry: string;
}

export interface PostdatedCheck {
  id: string;
  userId: string;
  companyName: string;
  bankName: string;
  checkNumber: string;
  amount: number;
  checkDate: string;
  status: 'pendiente' | 'depositado' | 'rebotado';
}

export interface StockLoss {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  reason: string;
  reportedBy: string;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  salesRepName?: string;
  customerRole: UserRole;
  channel: 'b2c' | 'b2b';
  subtotal: number;
  itbmsTax: number;
  shippingCost: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: 'contado' | 'credito_b2b' | 'cheque_posfechado';
  paymentStatus: 'pendiente' | 'pagado' | 'en_revision';
  shippingProvince: PanamaProvince;
  shippingCity: string;
  shippingAddress: string;
  shippingVehicle: FleetVehicle;
  trackingStatus: 'Pedido Recibido' | 'En Preparación' | 'Despachado en Flota' | 'Entregado' | 'Cancelado';
  approvalStatus?: 'pendiente_aprobacion' | 'aprobado' | 'rechazado';
  proposedDiscountPercent?: number;
  proposedNotes?: string;
  createdAt: string;
  items: CartItem[];
  isModified?: boolean;
}
