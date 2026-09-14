export type AdminTab = 
  | 'dashboard'
  | 'products'
  | 'orders'
  | 'customers'
  | 'shipping'
  | 'payments'
  | 'taxes'
  | 'discounts'
  | 'settings';

export interface Coupon {
  id: string;
  code: string;
  discountPercent?: number;
  fixedAmount?: number;
  minPurchase: number;
  expiryDate: string;
  isActive: boolean;
  usesCount: number;
}

export interface StoreSettings {
  storeName: string;
  rucDv: string;
  contactEmail: string;
  currency: 'USD' | 'PAB';
  itbmsRate: number; // default 0.07 (7%)
  pricesIncludeTax: boolean;
  freeShippingThreshold: number;
  privacyPolicy: string;
  termsPolicy: string;
  refundPolicy: string;
}

export interface PaymentGatewayConfig {
  yappyActive: boolean;
  creditCardActive: boolean;
  b2bCreditActive: boolean;
  postdatedChecksActive: boolean;
  earlyDiscountPercent: number;
}
