import { create } from 'zustand';
import { Product, Order } from '../types/product';

export type ActivePage = 
  | 'home'
  | 'product-detail'
  | 'cart'
  | 'checkout'
  | 'presale'
  | 'mermas'
  | 'order-inspector'
  | 'terms'
  | 'privacy'
  | 'shipping-policy'
  | 'admin-product-editor'
  | 'category';

export const pageToPath = (
  page: ActivePage, 
  product?: Product | null, 
  order?: Order | null,
  editingProduct?: Product | null,
  category?: string | null
): string => {
  switch (page) {
    case 'product-detail':
      return product ? `/producto/${product.id}` : '/';
    case 'cart':
      return '/carrito';
    case 'checkout':
      return '/checkout';
    case 'presale':
      return '/preventa';
    case 'mermas':
      return '/mermas';
    case 'order-inspector':
      return order ? `/orden/${order.id}` : '/';
    case 'terms':
      return '/terminos';
    case 'privacy':
      return '/privacidad';
    case 'shipping-policy':
      return '/envios';
    case 'admin-product-editor':
      return editingProduct ? `/admin/producto/editar/${editingProduct.id}` : '/admin/producto/nuevo';
    case 'category':
      return category ? `/categoria/${category}` : '/';
    case 'home':
    default:
      return '/';
  }
};

interface NavigationState {
  activePage: ActivePage;
  selectedProduct: Product | null;
  selectedOrder: Order | null;
  editingProduct: Product | null;
  selectedCategory: string | null;

  // Actions
  navigateTo: (page: ActivePage) => void;
  openProductDetail: (product: Product) => void;
  openOrderInspector: (order: Order) => void;
  openAdminProductEditor: (product?: Product | null) => void;
  openCategoryPage: (category: string) => void;
  syncFromUrl: (pathname: string, products: Product[], orders: Order[]) => void;
}

export const useNavigationStore = create<NavigationState>((set, get) => ({
  activePage: 'home',
  selectedProduct: null,
  selectedOrder: null,
  editingProduct: null,
  selectedCategory: null,

  navigateTo: (page) => {
    const { selectedProduct, selectedOrder, editingProduct, selectedCategory } = get();
    const targetPath = pageToPath(page, selectedProduct, selectedOrder, editingProduct, selectedCategory);
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
    set({ activePage: page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  openProductDetail: (product) => {
    const targetPath = pageToPath('product-detail', product);
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
    set({ activePage: 'product-detail', selectedProduct: product });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  openOrderInspector: (order) => {
    const targetPath = pageToPath('order-inspector', null, order);
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
    set({ activePage: 'order-inspector', selectedOrder: order });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  openAdminProductEditor: (product = null) => {
    const targetPath = pageToPath('admin-product-editor', null, null, product);
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
    set({ activePage: 'admin-product-editor', editingProduct: product });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  openCategoryPage: (category) => {
    const targetPath = pageToPath('category', null, null, null, category);
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
    set({ activePage: 'category', selectedCategory: category });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  syncFromUrl: (pathname, products, orders) => {
    if (pathname === '/carrito') {
      set({ activePage: 'cart' });
      return;
    }
    if (pathname === '/checkout') {
      set({ activePage: 'checkout' });
      return;
    }
    if (pathname === '/preventa') {
      set({ activePage: 'presale' });
      return;
    }
    if (pathname === '/mermas') {
      set({ activePage: 'mermas' });
      return;
    }
    if (pathname === '/terminos') {
      set({ activePage: 'terms' });
      return;
    }
    if (pathname === '/privacidad') {
      set({ activePage: 'privacy' });
      return;
    }
    if (pathname === '/envios') {
      set({ activePage: 'shipping-policy' });
      return;
    }

    if (pathname === '/admin/producto/nuevo') {
      set({ activePage: 'admin-product-editor', editingProduct: null });
      return;
    }

    if (pathname.startsWith('/admin/producto/editar/')) {
      const prodId = pathname.replace('/admin/producto/editar/', '');
      const foundProduct = products.find(p => p.id === prodId) || null;
      set({ activePage: 'admin-product-editor', editingProduct: foundProduct });
      return;
    }

    if (pathname.startsWith('/categoria/')) {
      const cat = pathname.replace('/categoria/', '');
      set({ activePage: 'category', selectedCategory: cat });
      return;
    }

    if (pathname.startsWith('/producto/')) {
      const prodId = pathname.replace('/producto/', '');
      const foundProduct = products.find(p => p.id === prodId) || products[0] || null;
      set({ activePage: 'product-detail', selectedProduct: foundProduct });
      return;
    }

    if (pathname.startsWith('/orden/')) {
      const ordId = pathname.replace('/orden/', '');
      const foundOrder = orders.find(o => o.id === ordId) || orders[0] || null;
      set({ activePage: 'order-inspector', selectedOrder: foundOrder });
      return;
    }

    set({ activePage: 'home' });
  }
}));
