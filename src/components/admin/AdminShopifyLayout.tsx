import React from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Truck,
  CreditCard,
  Percent,
  Tag,
  Settings,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useAdminStore } from '../../store/useAdminStore';
import { AdminTab } from '../../types/admin';

import { AdminDashboardTab } from './tabs/AdminDashboardTab';
import { AdminProductsTab } from './tabs/AdminProductsTab';
import { AdminOrdersTab } from './tabs/AdminOrdersTab';
import { AdminCustomersTab } from './tabs/AdminCustomersTab';
import { AdminShippingTab } from './tabs/AdminShippingTab';
import { AdminPaymentsTab } from './tabs/AdminPaymentsTab';
import { AdminTaxesTab } from './tabs/AdminTaxesTab';
import { AdminDiscountsTab } from './tabs/AdminDiscountsTab';
import { AdminSettingsTab } from './tabs/AdminSettingsTab';

export const AdminShopifyLayout: React.FC = () => {
  const { activeTab, setActiveTab } = useAdminStore();

  const navItems: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Inicio & Analítica', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'products', label: 'Productos & Inventario', icon: <Package className="w-4 h-4" /> },
    { id: 'orders', label: 'Pedidos & Despacho', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'customers', label: 'Clientes & Cuentas B2B', icon: <Users className="w-4 h-4" /> },
    { id: 'shipping', label: 'Envíos & Logística Panamá', icon: <Truck className="w-4 h-4" /> },
    { id: 'payments', label: 'Pagos & Cobranzas', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'taxes', label: 'Impuestos (ITBMS 7%)', icon: <Percent className="w-4 h-4" /> },
    { id: 'discounts', label: 'Descuentos & Cupones', icon: <Tag className="w-4 h-4" /> },
    { id: 'settings', label: 'Configuración General', icon: <Settings className="w-4 h-4" /> },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'products':
        return <AdminProductsTab />;
      case 'orders':
        return <AdminOrdersTab />;
      case 'customers':
        return <AdminCustomersTab />;
      case 'shipping':
        return <AdminShippingTab />;
      case 'payments':
        return <AdminPaymentsTab />;
      case 'taxes':
        return <AdminTaxesTab />;
      case 'discounts':
        return <AdminDiscountsTab />;
      case 'settings':
        return <AdminSettingsTab />;
      case 'dashboard':
      default:
        return <AdminDashboardTab />;
    }
  };

  return (
    <section className="pt-24 pb-16 min-h-screen bg-canvas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Shopify-Style Sidebar Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Navigation Sidebar (3 Columns) */}
          <aside className="lg:col-span-3 bg-surface p-4 rounded-3xl border border-warmgray-200 shadow-soft space-y-2 sticky top-28">
            <div className="p-3 border-b border-warmgray-200 mb-2">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                  S
                </span>
                <div>
                  <h3 className="font-serif text-sm font-bold text-charcoal-900">ShopAhora Admin</h3>
                  <span className="text-[10px] text-warmgray-500 font-mono">Shopify-Style Backoffice</span>
                </div>
              </div>
            </div>

            <nav className="space-y-1 text-xs font-medium font-mono">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full p-3 rounded-2xl flex items-center justify-between transition-all duration-200 ${
                      isActive
                        ? 'bg-charcoal-900 text-white shadow-soft font-bold'
                        : 'text-charcoal-900 hover:bg-warmgray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={isActive ? 'text-terracotta-500' : 'text-warmgray-500'}>
                        {item.icon}
                      </span>
                      <span className="font-sans">{item.label}</span>
                    </div>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-terracotta-500" />}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Main Content Area (9 Columns) */}
          <main className="lg:col-span-9">
            {renderTabContent()}
          </main>

        </div>

      </div>
    </section>
  );
};
