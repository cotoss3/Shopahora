import React, { useState } from 'react';
import { ShoppingBag, Printer, FileText, CheckCircle2, Truck, Clock, Eye, Briefcase, Building2, Search, Filter, ShieldCheck, XCircle, AlertCircle } from 'lucide-react';
import { useInventoryStore } from '../../../store/useInventoryStore';
import { useCartStore } from '../../../store/useCartStore';
import { useNavigationStore } from '../../../store/useNavigationStore';
import { Order } from '../../../types/product';

export const AdminOrdersTab: React.FC = () => {
  const { orders, updateOrderStatus, approveOrderProposal, rejectOrderProposal } = useInventoryStore();
  const { showNotification } = useCartStore();
  const { openOrderInspector } = useNavigationStore();

  const [channelFilter, setChannelFilter] = useState<'all' | 'b2c' | 'b2b' | 'sales_rep'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [proposalModalOrder, setProposalModalOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((o) => {
    const matchesChannel =
      channelFilter === 'all' ||
      (channelFilter === 'b2c' && o.channel === 'b2c') ||
      (channelFilter === 'b2b' && o.channel === 'b2b') ||
      (channelFilter === 'sales_rep' && Boolean(o.salesRepName));

    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.salesRepName && o.salesRepName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      o.shippingProvince.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesChannel && matchesSearch;
  });

  const pendingProposalsCount = orders.filter((o) => o.approvalStatus === 'pendiente_aprobacion').length;

  const handleApprove = (order: Order) => {
    approveOrderProposal(order.id);
    showNotification(`Cotización #${order.orderNumber} aprobada por Administración.`);
    if (proposalModalOrder?.id === order.id) setProposalModalOrder(null);
  };

  const handleReject = (order: Order) => {
    rejectOrderProposal(order.id);
    showNotification(`Cotización #${order.orderNumber} propuesta por vendedor fue rechazada.`);
    if (proposalModalOrder?.id === order.id) setProposalModalOrder(null);
  };

  return (
    <div className="space-y-6 font-mono text-xs animate-fadeIn">
      
      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-surface border border-warmgray-200 shadow-soft flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gradient-to-br from-purple-500/5 via-terracotta-500/5 to-transparent">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-600/10 text-purple-700 font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Control Gerencial Absoluto de Pedidos</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-charcoal-900 font-sans">
            Gestión de Órdenes B2B, B2C & Precios Vendedores
          </h1>
          <p className="text-xs text-warmgray-600 font-sans">
            Seguimiento multitrazabilidad de envíos en Panamá y aprobación de precios especiales propuestos por la fuerza de ventas.
          </p>
        </div>

        {pendingProposalsCount > 0 && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 space-y-1">
            <span className="font-bold flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>{pendingProposalsCount} Propuesta(s) de Precio Pendiente(s)</span>
            </span>
            <p className="text-[11px] font-sans">Vendedores requieren tu aprobación para cerrar venta B2B.</p>
          </div>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="p-6 rounded-3xl bg-surface border border-warmgray-200 shadow-soft flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
        
        {/* Channel Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none font-bold">
          <button
            onClick={() => setChannelFilter('all')}
            className={`px-4 py-2 rounded-full transition-all ${
              channelFilter === 'all'
                ? 'bg-charcoal-900 text-white shadow-soft'
                : 'bg-canvas hover:bg-warmgray-200 text-charcoal-900 border border-warmgray-200'
            }`}
          >
            Todos los Canales ({orders.length})
          </button>

          <button
            onClick={() => setChannelFilter('b2b')}
            className={`px-4 py-2 rounded-full transition-all ${
              channelFilter === 'b2b'
                ? 'bg-purple-700 text-white shadow-soft'
                : 'bg-canvas hover:bg-warmgray-200 text-charcoal-900 border border-warmgray-200'
            }`}
          >
            Comercial Mayorista B2B
          </button>

          <button
            onClick={() => setChannelFilter('sales_rep')}
            className={`px-4 py-2 rounded-full transition-all ${
              channelFilter === 'sales_rep'
                ? 'bg-amber-600 text-white shadow-soft'
                : 'bg-canvas hover:bg-warmgray-200 text-charcoal-900 border border-warmgray-200'
            }`}
          >
            Fuerza de Ventas (Vendedores)
          </button>

          <button
            onClick={() => setChannelFilter('b2c')}
            className={`px-4 py-2 rounded-full transition-all ${
              channelFilter === 'b2c'
                ? 'bg-terracotta-600 text-white shadow-soft'
                : 'bg-canvas hover:bg-warmgray-200 text-charcoal-900 border border-warmgray-200'
            }`}
          >
            Retail Tienda B2C
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-warmgray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por N° Orden, Cliente..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-canvas border border-warmgray-200 rounded-full text-charcoal-900 focus:outline-none"
          />
        </div>

      </div>

      {/* Orders Table */}
      <div className="p-6 rounded-3xl bg-surface border border-warmgray-200 shadow-soft overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-warmgray-200 text-warmgray-500">
              <th className="py-3 px-4">Nº Orden / Cotización</th>
              <th className="py-3 px-4">Canal</th>
              <th className="py-3 px-4">Cliente / Comprador</th>
              <th className="py-3 px-4">Vendedor Responsable</th>
              <th className="py-3 px-4">Destino Panamá</th>
              <th className="py-3 px-4">Monto Total</th>
              <th className="py-3 px-4">Aprobación de Precios</th>
              <th className="py-3 px-4">Seguimiento Logístico</th>
              <th className="py-3 px-4 text-right">Acción Gerencial</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-warmgray-100">
            {filteredOrders.map((o) => (
              <tr key={o.id} className="hover:bg-canvas transition-colors">
                <td className="py-4 px-4 font-bold text-charcoal-900">{o.orderNumber}</td>
                <td className="py-4 px-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    o.channel === 'b2b' ? 'bg-purple-600/10 text-purple-700' : 'bg-warmgray-200 text-charcoal-900'
                  }`}>
                    {o.channel}
                  </span>
                </td>
                <td className="py-4 px-4 font-sans font-bold text-charcoal-900">
                  <div className="flex items-center gap-1.5">
                    {o.channel === 'b2b' && <Building2 className="w-3.5 h-3.5 text-forest-700 flex-shrink-0" />}
                    <span>{o.customerName}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-warmgray-700">
                  <div className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                    <span>{o.salesRepName || 'Venta Web Directa'}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-warmgray-700">{o.shippingProvince}</td>
                <td className="py-4 px-4 font-bold text-purple-700">${o.totalAmount.toFixed(2)}</td>
                
                {/* Approval Status Column */}
                <td className="py-4 px-4">
                  {o.approvalStatus === 'pendiente_aprobacion' ? (
                    <div className="space-y-1">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-800 font-bold flex items-center gap-1 w-max">
                        <Clock className="w-3 h-3" /> Pendiente Aprobación
                      </span>
                      <button
                        onClick={() => setProposalModalOrder(o)}
                        className="text-[10px] font-bold text-terracotta-600 underline block"
                      >
                        Revisar Descuento {o.proposedDiscountPercent}% OFF
                      </button>
                    </div>
                  ) : o.approvalStatus === 'aprobado' ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-forest-700/10 text-forest-700 font-bold flex items-center gap-1 w-max">
                      <CheckCircle2 className="w-3 h-3" /> Aprobado por Admin
                    </span>
                  ) : o.approvalStatus === 'rechazado' ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-red-600/10 text-red-600 font-bold flex items-center gap-1 w-max">
                      <XCircle className="w-3 h-3" /> Rechazado
                    </span>
                  ) : (
                    <span className="text-warmgray-400">N/A (Estándar)</span>
                  )}
                </td>

                {/* Tracking Status Dropdown */}
                <td className="py-4 px-4">
                  <select
                    value={o.trackingStatus}
                    onChange={(e) => updateOrderStatus(o.id, e.target.value as any)}
                    className="px-2.5 py-1 bg-canvas border border-warmgray-200 rounded font-bold text-charcoal-900 focus:outline-none cursor-pointer text-[11px]"
                  >
                    <option value="Pedido Recibido">Pedido Recibido</option>
                    <option value="En Preparación">En Preparación</option>
                    <option value="Despachado en Flota">Despachado en Flota</option>
                    <option value="Entregado">Entregado</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
                </td>

                {/* Actions */}
                <td className="py-4 px-4 text-right space-x-2">
                  {o.approvalStatus === 'pendiente_aprobacion' && (
                    <button
                      onClick={() => setProposalModalOrder(o)}
                      className="px-3 py-1.5 bg-forest-700 hover:bg-forest-800 text-white rounded-lg font-bold transition-colors text-[11px]"
                    >
                      Aprobar / Revisar
                    </button>
                  )}

                  <button
                    onClick={() => openOrderInspector(o)}
                    className="px-3 py-1.5 bg-charcoal-900 text-white rounded-lg font-bold hover:bg-terracotta-600 transition-colors inline-flex items-center gap-1 text-[11px]"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Ver Orden (PDF)</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Proposed Price Approval Modal */}
      {proposalModalOrder && (
        <div className="p-8 rounded-3xl bg-surface border-2 border-amber-500 shadow-lifted space-y-6 animate-slideDown">
          <div className="flex justify-between items-center border-b border-warmgray-200 pb-3">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-800 font-bold text-[10px]">
                Propuesta Comercial de Vendedor Pendiente
              </span>
              <h3 className="font-serif text-xl font-bold text-charcoal-900 font-sans pt-1">
                Revisión de Cotización #{proposalModalOrder.orderNumber}
              </h3>
            </div>

            <button
              onClick={() => setProposalModalOrder(null)}
              className="p-1.5 hover:bg-warmgray-200 rounded-full text-warmgray-600"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-2xl bg-canvas border border-warmgray-200">
            <div className="space-y-1">
              <p className="text-warmgray-500">Cliente Comprador B2B:</p>
              <p className="font-bold text-charcoal-900 font-sans">{proposalModalOrder.customerName}</p>
              <p className="text-warmgray-700">Vendedor: {proposalModalOrder.salesRepName}</p>
            </div>

            <div className="space-y-1 text-right">
              <p className="text-warmgray-500">Descuento Propuesto:</p>
              <p className="font-bold text-lg text-terracotta-600">-{proposalModalOrder.proposedDiscountPercent}% OFF</p>
              <p className="font-bold text-charcoal-900">Total a Facturar: ${proposalModalOrder.totalAmount.toFixed(2)}</p>
            </div>
          </div>

          {proposalModalOrder.proposedNotes && (
            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-amber-900 font-sans">
              <span className="font-bold block text-xs">Nota Explicativa del Vendedor:</span>
              <p className="text-xs italic pt-1 font-mono">"{proposalModalOrder.proposedNotes}"</p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2 border-t border-warmgray-200">
            <button
              onClick={() => handleReject(proposalModalOrder)}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold transition-colors"
            >
              Rechazar Propuesta
            </button>

            <button
              onClick={() => handleApprove(proposalModalOrder)}
              className="px-8 py-2.5 bg-forest-700 hover:bg-forest-800 text-white rounded-full font-bold shadow-lifted flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>Aprobar Precio & Autorizar Facturación</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
