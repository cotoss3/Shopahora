import React from 'react';
import { TrendingUp, ShoppingBag, Users, CreditCard, ArrowUpRight, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useInventoryStore } from '../../../store/useInventoryStore';
import { useFinanceStore } from '../../../store/useFinanceStore';

export const AdminDashboardTab: React.FC = () => {
  const { products, orders } = useInventoryStore();
  const { creditAccounts } = useFinanceStore();

  const totalSales = orders.reduce((sum, o) => sum + o.totalAmount, 0) + 14850.00; // Total sales including past
  const b2bSales = orders.filter(o => o.channel === 'b2b').reduce((sum, o) => sum + o.totalAmount, 0) + 11200.00;
  const overdueCredit = creditAccounts.filter(a => a.status === 'vencida').reduce((sum, a) => sum + a.amount, 0);

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Welcome Banner */}
      <div className="p-8 rounded-3xl bg-surface border border-warmgray-200/80 shadow-soft flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-600/10 text-purple-700 text-xs font-mono font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ShopAhora Backoffice Executive Dashboard</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-charcoal-900">
            Resumen General de Operaciones
          </h1>
          <p className="text-xs text-warmgray-500 font-mono">
            Rendimiento de Ventas Retail B2C & Mayorista B2B en la República de Panamá
          </p>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="p-6 rounded-2xl bg-surface border border-warmgray-200 shadow-soft space-y-3">
          <div className="flex justify-between items-center text-xs font-mono text-warmgray-500">
            <span>Ventas Totales</span>
            <div className="p-2 rounded-full bg-forest-700/10 text-forest-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="font-mono text-2xl font-bold text-charcoal-900">${totalSales.toFixed(2)}</p>
          <div className="flex items-center gap-1 text-[11px] font-mono text-forest-700">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+18.4% vs mes anterior</span>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-surface border border-warmgray-200 shadow-soft space-y-3">
          <div className="flex justify-between items-center text-xs font-mono text-warmgray-500">
            <span>Ventas Canal B2B</span>
            <div className="p-2 rounded-full bg-purple-600/10 text-purple-700">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="font-mono text-2xl font-bold text-purple-700">${b2bSales.toFixed(2)}</p>
          <span className="text-[11px] font-mono text-warmgray-500">75% del volumen comercial</span>
        </div>

        <div className="p-6 rounded-2xl bg-surface border border-warmgray-200 shadow-soft space-y-3">
          <div className="flex justify-between items-center text-xs font-mono text-warmgray-500">
            <span>Cuentas por Cobrar (B2B)</span>
            <div className="p-2 rounded-full bg-amber-500/10 text-amber-700">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <p className="font-mono text-2xl font-bold text-charcoal-900">
            ${creditAccounts.reduce((a, b) => a + b.amount, 0).toFixed(2)}
          </p>
          <span className="text-[11px] font-mono text-warmgray-500">Plazos 15, 30 y 45 días</span>
        </div>

        <div className="p-6 rounded-2xl bg-surface border border-warmgray-200 shadow-soft space-y-3">
          <div className="flex justify-between items-center text-xs font-mono text-warmgray-500">
            <span>Crédito Vencido (Mora)</span>
            <div className="p-2 rounded-full bg-red-600/10 text-red-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="font-mono text-2xl font-bold text-red-600">${overdueCredit.toFixed(2)}</p>
          <span className="text-[11px] font-mono text-red-500 font-semibold">Requiere seguimiento</span>
        </div>

      </div>

      {/* Top Products & Recent Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Top Selling Products */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-surface border border-warmgray-200 shadow-soft space-y-4">
          <h3 className="font-serif text-lg font-bold text-charcoal-900">Productos Más Vendidos</h3>
          <div className="space-y-3">
            {products.slice(0, 4).map((p) => (
              <div key={p.id} className="flex items-center justify-between p-3 rounded-2xl bg-canvas border border-warmgray-200/80 font-mono text-xs">
                <div className="flex items-center gap-3">
                  <img src={p.images[0]} alt="" className="w-12 h-12 object-cover rounded-xl bg-warmgray-100" />
                  <div>
                    <p className="font-bold text-charcoal-900 font-sans">{p.name}</p>
                    <p className="text-warmgray-500">Stock: {p.stockPhysical} u | ${p.price} Retail</p>
                  </div>
                </div>
                <span className="font-bold text-terracotta-600">${p.b2bPrice} B2B</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders Overview */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-surface border border-warmgray-200 shadow-soft space-y-4">
          <h3 className="font-serif text-lg font-bold text-charcoal-900">Últimos Pedidos Recibidos</h3>
          <div className="space-y-3">
            {orders.map((o) => (
              <div key={o.id} className="p-3.5 rounded-2xl bg-canvas border border-warmgray-200/80 font-mono text-xs space-y-1">
                <div className="flex justify-between items-center font-bold text-charcoal-900">
                  <span>{o.orderNumber}</span>
                  <span className="text-purple-700">${o.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-warmgray-500">
                  <span>{o.customerName}</span>
                  <span className="px-2 py-0.5 rounded bg-forest-700/10 text-forest-700 font-bold">{o.trackingStatus}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
