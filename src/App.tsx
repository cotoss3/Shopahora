import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductGrid } from './components/ProductGrid';
import { Footer } from './components/Footer';

import { B2BWholesaleView } from './components/views/B2BWholesaleView';
import { SalesRepView } from './components/views/SalesRepView';
import { SupervisorView } from './components/views/SupervisorView';
import { AdminView } from './components/views/AdminView';

import { ProductDetailPage } from './components/pages/ProductDetailPage';
import { CartPage } from './components/pages/CartPage';
import { CheckoutPage } from './components/pages/CheckoutPage';
import { PresalePage } from './components/pages/PresalePage';
import { StockLossPage } from './components/pages/StockLossPage';
import { OrderInspectorPage } from './components/pages/OrderInspectorPage';
import { TermsPage } from './components/pages/TermsPage';
import { PrivacyPage } from './components/pages/PrivacyPage';
import { ShippingPolicyPage } from './components/pages/ShippingPolicyPage';
import { AdminProductEditorPage } from './components/pages/AdminProductEditorPage';
import { CategoryPage } from './components/pages/CategoryPage';
import { SEOHead } from './components/SEOHead';

import { useCartStore } from './store/useCartStore';
import { useAuthStore } from './store/useAuthStore';
import { useNavigationStore } from './store/useNavigationStore';
import { CheckCircle } from 'lucide-react';

export function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const { notification } = useCartStore();
  const { currentUser } = useAuthStore();
  const { activePage } = useNavigationStore();

  const renderRoleView = () => {
    switch (currentUser.role) {
      case 'cliente_b2b':
        return <B2BWholesaleView />;
      case 'vendedor_b2b':
        return <SalesRepView />;
      case 'supervisor':
        return <SupervisorView />;
      case 'admin':
        return <AdminView />;
      case 'cliente_b2c':
      default:
        return (
          <>
            <Hero />
            <ProductGrid searchQuery={searchQuery} />
          </>
        );
    }
  };

  const renderActivePage = () => {
    switch (activePage) {
      case 'product-detail':
        return <ProductDetailPage />;
      case 'cart':
        return <CartPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'presale':
        return <PresalePage />;
      case 'mermas':
        return <StockLossPage />;
      case 'order-inspector':
        return <OrderInspectorPage />;
      case 'terms':
        return <TermsPage />;
      case 'privacy':
        return <PrivacyPage />;
      case 'shipping-policy':
        return <ShippingPolicyPage />;
      case 'admin-product-editor':
        return <AdminProductEditorPage />;
      case 'category':
        return <CategoryPage />;
      case 'home':
      default:
        return renderRoleView();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-charcoal-900 selection:bg-terracotta-500 selection:text-white">
      
      {/* Dynamic SEO Meta Tags & URL Router Sync */}
      <SEOHead />
      
      {/* Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-charcoal-900 text-white px-5 py-3.5 rounded-2xl shadow-lifted border border-charcoal-700 flex items-center gap-3 animate-slideUp text-xs font-mono">
          <CheckCircle className="w-4 h-4 text-terracotta-500 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Navigation Header */}
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* Main Active Page Container (NO POPUP MODALS!) */}
      <main className="flex-grow">
        {renderActivePage()}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
