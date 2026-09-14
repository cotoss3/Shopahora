import { create } from 'zustand';
import { Product, StockLoss, Order, PanamaProvince, FleetVehicle } from '../types/product';
import { PRODUCTS, PANAMA_SHIPPING_RATES } from '../data/products';
import { supabase } from '../lib/supabase';

const LOCAL_STORAGE_PRODUCTS_KEY = 'shopahora_products_v2';

const getInitialProducts = (): Product[] => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_PRODUCTS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading products from localStorage:', e);
  }
  return PRODUCTS;
};

const saveProductsToLocal = (products: Product[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(products));
  } catch (e) {
    console.warn('Error saving products to localStorage:', e);
  }
};

const syncProductToSupabase = async (product: Product) => {
  try {
    const payload = {
      id: product.id,
      name: product.name,
      subtitle: product.subtitle || '',
      description: product.description || '',
      retail_price: product.price,
      b2b_price: product.b2bPrice,
      b2b_discount_percent: product.b2bDiscountPercent,
      category_slug: product.category,
      is_itbms_exempt: product.isItbmsExempt,
      stock_physical: product.stockPhysical,
      allow_dropshipping: product.allowDropshipping,
      is_active: product.isActive,
      rating: product.rating,
      reviews_count: product.reviewsCount,
      badge: product.badge || null,
      colors: product.colors || [],
      features: product.features || [],
      images: product.images || []
    };

    const { error } = await supabase.from('products').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.warn('Supabase DB product upsert note (using localStorage fallback):', error.message);
    } else {
      console.log('Product synced to Supabase successfully:', product.id);
    }
  } catch (err) {
    console.warn('Supabase sync warning:', err);
  }
};

interface InventoryState {
  products: Product[];
  stockLosses: StockLoss[];
  orders: Order[];

  // Actions
  fetchProductsFromSupabase: () => Promise<void>;
  toggleProductActive: (productId: string) => void;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  reportStockLoss: (productId: string, quantity: number, reason: string, reporterName: string) => void;
  editOrderQuantity: (orderId: string, productId: string, newQuantity: number) => void;
  updateOrderStatus: (orderId: string, status: Order['trackingStatus']) => void;
  approveOrderProposal: (orderId: string) => void;
  rejectOrderProposal: (orderId: string, reason?: string) => void;
  calculatePanamaShipping: (province: PanamaProvince, vehicle: FleetVehicle) => number;
}

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-881',
    orderNumber: 'ORD-2026-881',
    userId: 'u-b2b-1',
    customerName: 'Distribuidora Istmo S.A.',
    salesRepName: 'Carlos Mendoza (Vendedor)',
    customerRole: 'cliente_b2b',
    channel: 'b2b',
    subtotal: 1999.90,
    itbmsTax: 0, // Exempt
    shippingCost: 45.00,
    discountAmount: 0,
    totalAmount: 2044.90,
    paymentMethod: 'credito_b2b',
    paymentStatus: 'pendiente',
    shippingProvince: 'Panamá Centro',
    shippingCity: 'Ciudad de Panamá',
    shippingAddress: 'Vía España, Edificio Empresarial Piso 5',
    shippingVehicle: 'camion_5t',
    trackingStatus: 'En Preparación',
    approvalStatus: 'aprobado',
    createdAt: '2026-09-14 08:30',
    items: [
      {
        product: PRODUCTS[0],
        quantity: 10
      }
    ]
  },
  {
    id: 'ord-882',
    orderNumber: 'PRE-2026-904',
    userId: 'u-b2b-2',
    customerName: 'Comercial Chiriquí S.A.',
    salesRepName: 'Carlos Mendoza (Vendedor)',
    customerRole: 'cliente_b2b',
    channel: 'b2b',
    subtotal: 3200.00,
    itbmsTax: 224.00,
    shippingCost: 75.00,
    discountAmount: 480.00,
    totalAmount: 3019.00,
    paymentMethod: 'credito_b2b',
    paymentStatus: 'en_revision',
    shippingProvince: 'Chiriquí',
    shippingCity: 'David',
    shippingAddress: 'Vía Boquete, Bodega #12',
    shippingVehicle: 'camion_5t',
    trackingStatus: 'Pedido Recibido',
    approvalStatus: 'pendiente_aprobacion',
    proposedDiscountPercent: 15,
    proposedNotes: 'Vendedor propone 15% de descuento especial por compra en volumen de 20 unidades.',
    createdAt: '2026-09-14 09:15',
    items: [
      {
        product: PRODUCTS[2],
        quantity: 20
      }
    ]
  },
  {
    id: 'ord-883',
    orderNumber: 'ORD-2026-102',
    userId: 'u-b2c-99',
    customerName: 'Juan Pérez (Cliente Retail)',
    salesRepName: undefined,
    customerRole: 'cliente_b2c',
    channel: 'b2c',
    subtotal: 199.99,
    itbmsTax: 14.00,
    shippingCost: 5.00,
    discountAmount: 0,
    totalAmount: 218.99,
    paymentMethod: 'contado',
    paymentStatus: 'pagado',
    shippingProvince: 'Panamá Oeste',
    shippingCity: 'Arraiján',
    shippingAddress: 'Barriada Valle Hermoso, Calle 4',
    shippingVehicle: 'moto',
    trackingStatus: 'Despachado en Flota',
    approvalStatus: 'aprobado',
    createdAt: '2026-09-14 10:00',
    items: [
      {
        product: PRODUCTS[0],
        quantity: 1
      }
    ]
  }
];

export const useInventoryStore = create<InventoryState>((set) => ({
  products: getInitialProducts(),
  stockLosses: [
    {
      id: 'loss-1',
      productId: '1',
      productName: 'Audífonos Studio Pro Wireless',
      quantity: 2,
      reason: 'Caja abollada en inspección de bodega',
      reportedBy: 'Roberto Gómez (Supervisor)',
      createdAt: '2026-09-13 14:20'
    }
  ],
  orders: INITIAL_ORDERS,

  fetchProductsFromSupabase: async () => {
    try {
      const { data, error } = await supabase.from('products').select('*');
      if (!error && data && data.length > 0) {
        const dbProducts: Product[] = data.map((row: any) => ({
          id: row.id,
          name: row.name,
          subtitle: row.subtitle || '',
          description: row.description || '',
          price: Number(row.retail_price ?? row.price ?? 0),
          b2bPrice: Number(row.b2b_price ?? row.b2bPrice ?? 0),
          b2bDiscountPercent: Number(row.b2b_discount_percent ?? 0),
          category: (row.category_slug || row.category || 'tecnologia') as Product['category'],
          isItbmsExempt: Boolean(row.is_itbms_exempt),
          stockPhysical: Number(row.stock_physical ?? 10),
          allowDropshipping: Boolean(row.allow_dropshipping),
          isActive: Boolean(row.is_active ?? true),
          rating: Number(row.rating ?? 5.0),
          reviewsCount: Number(row.reviews_count ?? 1),
          badge: row.badge || undefined,
          colors: row.colors || [],
          features: row.features || [],
          images: Array.isArray(row.images) ? row.images : []
        }));

        set({ products: dbProducts });
        saveProductsToLocal(dbProducts);
      }
    } catch (err) {
      console.warn('Error fetching products from Supabase:', err);
    }
  },

  toggleProductActive: (productId) => {
    set(state => {
      const updated = state.products.map(p => {
        if (p.id === productId) {
          const next = { ...p, isActive: !p.isActive };
          syncProductToSupabase(next);
          return next;
        }
        return p;
      });
      saveProductsToLocal(updated);
      return { products: updated };
    });
  },

  addProduct: (newProduct) => {
    set(state => {
      const updated = [newProduct, ...state.products];
      saveProductsToLocal(updated);
      syncProductToSupabase(newProduct);
      return { products: updated };
    });
  },

  updateProduct: (updatedProduct) => {
    set(state => {
      const updated = state.products.map(p => p.id === updatedProduct.id ? updatedProduct : p);
      saveProductsToLocal(updated);
      syncProductToSupabase(updatedProduct);
      return { products: updated };
    });
  },

  reportStockLoss: (productId, quantity, reason, reporterName) => {
    set(state => {
      const targetProduct = state.products.find(p => p.id === productId);
      if (!targetProduct) return state;

      const newPhysical = Math.max(0, targetProduct.stockPhysical - quantity);
      const isNowActive = newPhysical > 0 || targetProduct.allowDropshipping;

      const updatedProducts = state.products.map(p => {
        if (p.id === productId) {
          const next = { ...p, stockPhysical: newPhysical, isActive: isNowActive };
          syncProductToSupabase(next);
          return next;
        }
        return p;
      });

      saveProductsToLocal(updatedProducts);

      const newLoss: StockLoss = {
        id: `loss-${Date.now()}`,
        productId,
        productName: targetProduct.name,
        quantity,
        reason,
        reportedBy: reporterName,
        createdAt: new Date().toLocaleString()
      };

      return {
        products: updatedProducts,
        stockLosses: [newLoss, ...state.stockLosses]
      };
    });
  },

  editOrderQuantity: (orderId, productId, newQuantity) => {
    set(state => ({
      orders: state.orders.map(order => {
        if (order.id !== orderId) return order;

        const updatedItems = order.items.map(item => {
          if (item.product.id === productId) {
            return { ...item, quantity: newQuantity };
          }
          return item;
        }).filter(item => item.quantity > 0);

        const newSubtotal = updatedItems.reduce((acc, i) => acc + (i.product.price * i.quantity), 0);
        const newTotal = newSubtotal + order.itbmsTax + order.shippingCost;

        return {
          ...order,
          items: updatedItems,
          subtotal: newSubtotal,
          totalAmount: newTotal,
          isModified: true
        };
      })
    }));
  },

  updateOrderStatus: (orderId, status) => {
    set(state => ({
      orders: state.orders.map(order =>
        order.id === orderId ? { ...order, trackingStatus: status } : order
      )
    }));
  },

  approveOrderProposal: (orderId) => {
    set(state => ({
      orders: state.orders.map(order =>
        order.id === orderId
          ? { ...order, approvalStatus: 'aprobado', trackingStatus: 'En Preparación' }
          : order
      )
    }));
  },

  rejectOrderProposal: (orderId, reason) => {
    set(state => ({
      orders: state.orders.map(order =>
        order.id === orderId
          ? { ...order, approvalStatus: 'rechazado', trackingStatus: 'Cancelado' }
          : order
      )
    }));
  },

  calculatePanamaShipping: (province, vehicle) => {
    const rateItem = PANAMA_SHIPPING_RATES.find(
      r => r.province === province && r.vehicle === vehicle
    );
    return rateItem ? rateItem.rate : 15.00;
  }
}));
