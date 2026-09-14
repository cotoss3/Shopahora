import { create } from 'zustand';
import { AdminTab, Coupon, StoreSettings, PaymentGatewayConfig } from '../types/admin';

interface AdminStoreState {
  activeTab: AdminTab;
  storeSettings: StoreSettings;
  coupons: Coupon[];
  paymentConfig: PaymentGatewayConfig;

  // Actions
  setActiveTab: (tab: AdminTab) => void;
  updateStoreSettings: (settings: Partial<StoreSettings>) => void;
  addCoupon: (coupon: Omit<Coupon, 'id' | 'usesCount'>) => void;
  toggleCouponActive: (couponId: string) => void;
  updatePaymentConfig: (config: Partial<PaymentGatewayConfig>) => void;
}

const INITIAL_SETTINGS: StoreSettings = {
  storeName: 'ShopAhora Panamá',
  rucDv: '155789021-2-2022 DV 98',
  contactEmail: 'gerencia@shopahora.com',
  currency: 'USD',
  itbmsRate: 0.07,
  pricesIncludeTax: false,
  freeShippingThreshold: 300,
  privacyPolicy: 'Política de Privacidad de ShopAhora Panamá conforme a las leyes de protección de datos.',
  termsPolicy: 'Términos y Condiciones para ventas Retail y Crédito B2B en la República de Panamá.',
  refundPolicy: 'Garantía de devolución y reemplazo dentro de los 30 días posteriores a la entrega.'
};

const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'coup-1',
    code: 'PANAMA10',
    discountPercent: 10,
    minPurchase: 50,
    expiryDate: '2026-12-31',
    isActive: true,
    usesCount: 42
  },
  {
    id: 'coup-2',
    code: 'MAYORISTA50',
    fixedAmount: 50,
    minPurchase: 500,
    expiryDate: '2026-10-15',
    isActive: true,
    usesCount: 18
  }
];

const INITIAL_PAYMENT_CONFIG: PaymentGatewayConfig = {
  yappyActive: true,
  creditCardActive: true,
  b2bCreditActive: true,
  postdatedChecksActive: true,
  earlyDiscountPercent: 5.0
};

export const useAdminStore = create<AdminStoreState>((set) => ({
  activeTab: 'dashboard',
  storeSettings: INITIAL_SETTINGS,
  coupons: INITIAL_COUPONS,
  paymentConfig: INITIAL_PAYMENT_CONFIG,

  setActiveTab: (tab) => set({ activeTab: tab }),

  updateStoreSettings: (settings) => set((state) => ({
    storeSettings: { ...state.storeSettings, ...settings }
  })),

  addCoupon: (couponData) => set((state) => ({
    coupons: [
      {
        ...couponData,
        id: `coup-${Date.now()}`,
        usesCount: 0
      },
      ...state.coupons
    ]
  })),

  toggleCouponActive: (couponId) => set((state) => ({
    coupons: state.coupons.map((c) =>
      c.id === couponId ? { ...c, isActive: !c.isActive } : c
    )
  })),

  updatePaymentConfig: (config) => set((state) => ({
    paymentConfig: { ...state.paymentConfig, ...config }
  }))
}));
