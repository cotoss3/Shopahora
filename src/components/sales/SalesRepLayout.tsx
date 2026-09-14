import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Zap,
  CreditCard,
  ChevronRight,
  Briefcase
} from 'lucide-react';

import { SalesDashboardTab } from './tabs/SalesDashboardTab';
import { SalesCustomersTab } from './tabs/SalesCustomersTab';
import { SalesOrdersTab } from './tabs/SalesOrdersTab';
import { SalesFinanceTab } from './tabs/SalesFinanceTab';
import { PresalePage } from '../pages/PresalePage';

export type SalesRepTab = 'dashboard' | 'customers' | 'orders' | 'presale' | 'finance';

export const SalesRepLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SalesRepTab>('dashboard');

  const navItems: { id: SalesRepTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Inicio & Analítica', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'customers', label: 'Mis Clientes B2B', icon: <Users className="w-4 h-4" /> },
    { id: 'orders', label: 'Órdenes & Preventas', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'presale', label: 'Creador de Cotizaciones', icon: <Zap className="w-4 h-4" /> },
    { id: 'finance', label: 'Facturación & Cobranzas', icon: <CreditCard className="w-4 h-4" /> },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'customers':
        return <SalesCustomersTab onNavigateTab={(tab) => setActiveTab(tab as SalesRepTab)} />;
      case 'orders':
        return <SalesOrdersTab />;
      case 'presale':
        return <PresalePage />;
      case 'finance':
        return <SalesFinanceTab />;
      case 'dashboard':
      default:
        return <SalesDashboardTab onNavigateTab={(tab) => setActiveTab(tab as SalesRepTab)} />;
    }
  };

  return (
    <section className="pt-24 pb-16 min-h-screen bg-canvas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Sales Rep Left Sidebar Panel Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Navigation Sidebar (3 Columns) */}
          <aside className="lg:col-span-3 bg-surface p-4 rounded-3xl border border-warmgray-200 shadow-soft space-y-2 sticky top-28">
            <div className="p-3 border-b border-warmgray-200 mb-2">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-xs">
                  <Briefcase className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-serif text-sm font-bold text-charcoal-900">Admin de Ventas</h3>
                  <span className="text-[10px] text-warmgray-500 font-mono">Panel Comercial B2B</span>
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
                      <span className={isActive ? 'text-amber-500' : 'text-warmgray-500'}>
                        {item.icon}
                      </span>
                      <span className="font-sans">{item.label}</span>
                    </div>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-amber-500" />}
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
