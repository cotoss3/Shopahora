import { create } from 'zustand';
import { CartItem, Product } from '../types/product';

interface CartState {
  cart: CartItem[];
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  selectedProduct: Product | null;
  notification: string | null;
  
  // Actions
  addToCart: (product: Product, selectedColor?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  openCheckout: () => void;
  closeCheckout: () => void;
  setSelectedProduct: (product: Product | null) => void;
  showNotification: (message: string) => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: [],
  isCartOpen: false,
  isCheckoutOpen: false,
  selectedProduct: null,
  notification: null,

  addToCart: (product, selectedColor) => {
    const { cart } = get();
    const existingIndex = cart.findIndex(item => item.product.id === product.id);

    if (existingIndex > -1) {
      const updatedCart = [...cart];
      updatedCart[existingIndex].quantity += 1;
      set({ cart: updatedCart });
    } else {
      set({ cart: [...cart, { product, quantity: 1, selectedColor: selectedColor || product.colors?.[0]?.name }] });
    }

    get().showNotification(`"${product.name}" agregado al carrito`);
    get().openCart();
  },

  removeFromCart: (productId) => {
    set(state => ({
      cart: state.cart.filter(item => item.product.id !== productId)
    }));
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId);
      return;
    }

    set(state => ({
      cart: state.cart.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    }));
  },

  clearCart: () => set({ cart: [] }),
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set(state => ({ isCartOpen: !state.isCartOpen })),
  
  openCheckout: () => set({ isCheckoutOpen: true, isCartOpen: false }),
  closeCheckout: () => set({ isCheckoutOpen: false }),

  setSelectedProduct: (product) => set({ selectedProduct: product }),

  showNotification: (message) => {
    set({ notification: message });
    setTimeout(() => {
      set({ notification: null });
    }, 3000);
  }
}));
