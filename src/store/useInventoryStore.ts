import { create } from 'zustand';
import { Product, StockLoss, Order, PanamaProvince, FleetVehicle } from '../types/product';
import { PANAMA_SHIPPING_RATES, PRODUCTS } from '../data/products';
import { supabase } from '../lib/supabase';

const syncProductToSupabase = async (product: Product): Promise<boolean> => {
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
      console.error('Supabase DB product sync error:', error.message);
      return false;
    }
    console.log('Product synced to Supabase successfully:', product.id);
    return true;
  } catch (err) {
    console.error('Supabase sync error:', err);
    return false;
  }
};

interface InventoryState {
  products: Product[];
  stockLosses: StockLoss[];
  orders: Order[];
  isLoading: boolean;

  // Actions
  fetchProductsFromSupabase: () => Promise<void>;
  fetchOrdersFromSupabase: () => Promise<void>;
  fetchStockLossesFromSupabase: () => Promise<void>;
  fetchAllDataFromSupabase: () => Promise<void>;

  toggleProductActive: (productId: string) => Promise<void>;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  reportStockLoss: (productId: string, quantity: number, reason: string, reporterName: string) => Promise<void>;
  editOrderQuantity: (orderId: string, productId: string, newQuantity: number) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['trackingStatus']) => Promise<void>;
  approveOrderProposal: (orderId: string) => Promise<void>;
  rejectOrderProposal: (orderId: string, reason?: string) => Promise<void>;
  calculatePanamaShipping: (province: PanamaProvince, vehicle: FleetVehicle) => number;
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  products: PRODUCTS,
  stockLosses: [],
  orders: [],
  isLoading: false,

  fetchProductsFromSupabase: async () => {
    try {
      set({ isLoading: true });
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      
      if (!error && data && data.length > 0) {
        const existingMap = new Map(get().products.map(p => [p.id, p]));

        const dbProducts: Product[] = data.map((row: any) => {
          const existing = existingMap.get(row.id);
          const dbImages = Array.isArray(row.images) ? row.images : [];
          // Preserve local updated images if existing product in memory has more images
          const images = (existing && existing.images && existing.images.length > dbImages.length)
            ? existing.images
            : dbImages;

          return {
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
            images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop']
          };
        });
        set({ products: dbProducts });
      }
    } catch (err) {
      console.error('Error fetching products from Supabase:', err);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchOrdersFromSupabase: async () => {
    try {
      const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        const mappedOrders: Order[] = data.map((row: any) => ({
          id: row.id,
          orderNumber: row.order_number,
          userId: row.user_id,
          customerName: row.customer_name,
          salesRepName: row.sales_rep_name || undefined,
          customerRole: row.customer_role || 'cliente_b2c',
          channel: row.channel || 'b2c',
          subtotal: Number(row.subtotal),
          itbmsTax: Number(row.itbms_tax),
          shippingCost: Number(row.shipping_cost),
          discountAmount: Number(row.discount_amount || 0),
          totalAmount: Number(row.total_amount),
          paymentMethod: row.payment_method,
          paymentStatus: row.payment_status,
          shippingProvince: row.shipping_province,
          shippingCity: row.shipping_city,
          shippingAddress: row.shipping_address,
          shippingVehicle: row.shipping_vehicle,
          trackingStatus: row.tracking_status,
          approvalStatus: row.approval_status,
          proposedDiscountPercent: Number(row.proposed_discount_percent || 0),
          proposedNotes: row.proposed_notes || undefined,
          createdAt: new Date(row.created_at).toLocaleString(),
          items: []
        }));
        set({ orders: mappedOrders });
      }
    } catch (err) {
      console.error('Error fetching orders from Supabase:', err);
    }
  },

  fetchStockLossesFromSupabase: async () => {
    try {
      const { data, error } = await supabase.from('stock_losses').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        const mappedLosses: StockLoss[] = data.map((row: any) => ({
          id: row.id,
          productId: row.product_id,
          productName: row.product_name,
          quantity: Number(row.quantity),
          reason: row.reason,
          reportedBy: row.reported_by,
          createdAt: new Date(row.created_at).toLocaleString()
        }));
        set({ stockLosses: mappedLosses });
      }
    } catch (err) {
      console.error('Error fetching stock losses from Supabase:', err);
    }
  },

  fetchAllDataFromSupabase: async () => {
    await Promise.all([
      get().fetchProductsFromSupabase(),
      get().fetchOrdersFromSupabase(),
      get().fetchStockLossesFromSupabase()
    ]);
  },

  toggleProductActive: async (productId) => {
    const target = get().products.find(p => p.id === productId);
    if (!target) return;

    const updated = { ...target, isActive: !target.isActive };
    set(state => ({
      products: state.products.map(p => p.id === productId ? updated : p)
    }));

    await syncProductToSupabase(updated);
  },

  addProduct: async (newProduct) => {
    set(state => ({
      products: [newProduct, ...state.products]
    }));

    const success = await syncProductToSupabase(newProduct);
    if (success) {
      await get().fetchProductsFromSupabase();
    }
  },

  updateProduct: async (updatedProduct) => {
    set(state => ({
      products: state.products.map(p => p.id === updatedProduct.id ? updatedProduct : p)
    }));

    const success = await syncProductToSupabase(updatedProduct);
    if (success) {
      await get().fetchProductsFromSupabase();
    }
  },

  reportStockLoss: async (productId, quantity, reason, reporterName) => {
    const targetProduct = get().products.find(p => p.id === productId);
    if (!targetProduct) return;

    const newPhysical = Math.max(0, targetProduct.stockPhysical - quantity);
    const isNowActive = newPhysical > 0 || targetProduct.allowDropshipping;
    const updatedProduct = { ...targetProduct, stockPhysical: newPhysical, isActive: isNowActive };

    // Insert into stock_losses table in Supabase
    try {
      await supabase.from('stock_losses').insert({
        product_id: productId,
        product_name: targetProduct.name,
        quantity,
        reason,
        reported_by: reporterName
      });
    } catch (err) {
      console.error('Error inserting stock loss to Supabase:', err);
    }

    // Sync updated product stock in Supabase
    await syncProductToSupabase(updatedProduct);
    await get().fetchAllDataFromSupabase();
  },

  editOrderQuantity: async (orderId, productId, newQuantity) => {
    const targetOrder = get().orders.find(o => o.id === orderId);
    if (!targetOrder) return;

    const updatedItems = targetOrder.items.map(item => {
      if (item.product.id === productId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(item => item.quantity > 0);

    const newSubtotal = updatedItems.reduce((acc, i) => acc + (i.product.price * i.quantity), 0);
    const newTotal = newSubtotal + targetOrder.itbmsTax + targetOrder.shippingCost;

    set(state => ({
      orders: state.orders.map(o => o.id === orderId ? {
        ...o,
        items: updatedItems,
        subtotal: newSubtotal,
        totalAmount: newTotal,
        isModified: true
      } : o)
    }));

    // Sync order update to Supabase
    try {
      await supabase.from('orders').update({
        subtotal: newSubtotal,
        total_amount: newTotal
      }).eq('id', orderId);
    } catch (err) {
      console.error('Error updating order in Supabase:', err);
    }
  },

  updateOrderStatus: async (orderId, status) => {
    set(state => ({
      orders: state.orders.map(order =>
        order.id === orderId ? { ...order, trackingStatus: status } : order
      )
    }));

    try {
      await supabase.from('orders').update({ tracking_status: status }).eq('id', orderId);
    } catch (err) {
      console.error('Error updating order status in Supabase:', err);
    }
  },

  approveOrderProposal: async (orderId) => {
    set(state => ({
      orders: state.orders.map(order =>
        order.id === orderId
          ? { ...order, approvalStatus: 'aprobado', trackingStatus: 'En Preparación' }
          : order
      )
    }));

    try {
      await supabase.from('orders').update({
        approval_status: 'aprobado',
        tracking_status: 'En Preparación'
      }).eq('id', orderId);
    } catch (err) {
      console.error('Error approving proposal in Supabase:', err);
    }
  },

  rejectOrderProposal: async (orderId, reason) => {
    set(state => ({
      orders: state.orders.map(order =>
        order.id === orderId
          ? { ...order, approvalStatus: 'rechazado', trackingStatus: 'Cancelado' }
          : order
      )
    }));

    try {
      await supabase.from('orders').update({
        approval_status: 'rechazado',
        tracking_status: 'Cancelado',
        proposed_notes: reason
      }).eq('id', orderId);
    } catch (err) {
      console.error('Error rejecting proposal in Supabase:', err);
    }
  },

  calculatePanamaShipping: (province, vehicle) => {
    const rateItem = PANAMA_SHIPPING_RATES.find(
      r => r.province === province && r.vehicle === vehicle
    );
    return rateItem ? rateItem.rate : 15.00;
  }
}));
