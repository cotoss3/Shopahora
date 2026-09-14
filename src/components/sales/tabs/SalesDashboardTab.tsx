import React from 'react';
import { Briefcase, TrendingUp, Users, ShoppingBag, DollarSign, Zap, Plus, ArrowUpRight, CheckCircle2, Clock } from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';
import { useInventoryStore } from '../../../store/useInventoryStore';
import { useFinanceStore } from '../../../store/useFinanceStore';
import { useNavigationStore } from '../../../store/useNavigationStore';

interface SalesDashboardTabProps {
  onNavigateTab: (tabId: string) => void;
}

export const SalesDashboardTab: React.FC<SalesDashboardTabProps> = ({ onNavigateTab }) => {
  const { currentUser } = useAuthStore();
  const { orders } = useInventoryStore();
  const { creditAccounts } = useFinanceStore();
  const { openOrderInspector } = useNavigationStore();

  const totalSalesMonth = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const activeOrdersCount = orders.length;
  const overdueCount = creditAccounts.filter(a => a.status === 'vencida').length;
  const totalCreditActive = creditAccounts.reduce((sum, a) => sum + a.amount, 0);

  const monthlyGoal = 35000;
  const goalProgress = Math.min(100, Math.round((totalSalesMonth / monthlyGoal) * 100));

  return (
    <div className="space-y-6 font-mono text-xs animate-fadeIn">
      
      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-surface border border-warmgray-200 shadow-soft flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gradient-to-br from-amber-500/5 via-terracotta-500/5 to-transparent">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 text-xs font-bold">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Panel del Vendedor Comercial</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-charcoal-900 font-sans">
            ¡Hola, {currentUser.fullName}!
          </h1>
          <p className="text-xs text-warmgray-600 font-sans">
            Gestión integral de cartera B2B, pedidos, cotizaciones y cobros en Panamá.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('presale')}
          className="px-6 py-3.5 bg-charcoal-900 hover:bg-terracotta-600 text-white rounded-2xl text-xs font-bold transition-all shadow-lifted flex items-center gap-2"
        >
          <Zap className="w-4 h-4 text-terracotta-500" />
          <span>⚡ Creador de Cotizaciones</span>
        </button>
      </div>

      {/* Monthly Sales Goal Bar */}
      <div className="p-6 rounded-3xl bg-surface border border-warmgray-200 shadow-soft space-y-3">
        <div className="flex justify-between items-center text-charcoal-900">
          <span className="font-bold flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-forest-700" /> Meta Mensual de Ventas Comercial:
          </span>
          <span className="font-bold text-sm text-forest-700">
            ${totalSalesMonth.toLocaleString('en-US', { minimumFractionDigits: 2 })} / ${monthlyGoal.toLocaleString('en-US')} ({goalProgress}%)
          </span>
        </div>

        <div className="w-full bg-warmgray-200 h-3 rounded-full overflow-hidden">
          <div
            className="bg-forest-700 h-full transition-all duration-500"
            style={{ width: `${goalProgress}%` }}
          />
        </div>
      </div>

      {/* Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-surface border border-warmgray-200 shadow-xs space-y-2">
          <span className="text-warmgray-500 uppercase text-[10px]">Ventas del Mes</span>
          <p className="text-xl font-bold text-charcoal-900">${totalSalesMonth.toFixed(2)}</p>
          <span className="text-[10px] text-forest-700 font-bold">+14.2% vs mes anterior</span>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-warmgray-200 shadow-xs space-y-2">
          <span className="text-warmgray-500 uppercase text-[10px]">Órdenes & Cotizaciones</span>
          <p className="text-xl font-bold text-charcoal-900">{activeOrdersCount} registradas</p>
          <span className="text-[10px] text-warmgray-600">Verificadas en bodega</span>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-warmgray-200 shadow-xs space-y-2">
          <span className="text-warmgray-500 uppercase text-[10px]">Cartera a Crédito</span>
          <p className="text-xl font-bold text-purple-700">${totalCreditActive.toFixed(2)}</p>
          <span className="text-[10px] text-warmgray-600">2 Clientes Mayoristas</span>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-warmgray-200 shadow-xs space-y-2">
          <span className="text-warmgray-500 uppercase text-[10px]">Facturas Vencidas</span>
          <p className="text-xl font-bold text-red-600">{overdueCount} en mora</p>
          <span className="text-[10px] text-red-500 font-bold">Requiere gestión</span>
        </div>
      </div>

      {/* Recent Orders Preview */}
      <div className="p-6 rounded-3xl bg-surface border border-warmgray-200 shadow-soft space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-serif text-lg font-bold text-charcoal-900 font-sans">Últimos Pedidos Comercial B2B</h2>
          <button
            onClick={() => onNavigateTab('orders')}
            className="text-xs text-terracotta-600 font-bold hover:underline flex items-center gap-1"
          >
            Ver Todas las Órdenes <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {orders.map((ord) => (
            <div
              key={ord.id}
              className="p-4 rounded-2xl bg-canvas border border-warmgray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-warmgray-300 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-charcoal-900">{ord.orderNumber}</span>
                  <span className="px-2 py-0.5 rounded-full bg-forest-700/10 text-forest-700 font-bold text-[10px]">
                    {ord.trackingStatus}
                  </span>
                </div>
                <p className="font-sans font-bold text-charcoal-900">{ord.customerName}</p>
                <p className="text-[11px] text-warmgray-500">Destino: {ord.shippingProvince} • {ord.createdAt}</p>
              </div>

              <div className="flex items-center gap-4 self-end sm:self-auto">
                <span className="font-bold text-sm text-charcoal-900">${ord.totalAmount.toFixed(2)}</span>
                <button
                  onClick={() => openOrderInspector(ord)}
                  className="px-3 py-1.5 bg-charcoal-900 hover:bg-terracotta-600 text-white rounded-lg text-[11px] font-bold transition-colors"
                >
                  Imprimir Orden (PDF)
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
