import React, { useState } from 'react';
import { ShoppingBag, Search, Eye, Edit3, Printer, CheckCircle2, Clock, Truck, Plus, Minus, X } from 'lucide-react';
import { useInventoryStore } from '../../../store/useInventoryStore';
import { useNavigationStore } from '../../../store/useNavigationStore';
import { Order } from '../../../types/product';

export const SalesOrdersTab: React.FC = () => {
  const { orders, updateOrderStatus, editOrderQuantity } = useInventoryStore();
  const { openOrderInspector } = useNavigationStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((o) =>
    o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.shippingProvince.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 font-mono text-xs animate-fadeIn">
      
      {/* Header */}
      <div className="p-6 rounded-3xl bg-surface border border-warmgray-200 shadow-soft flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-charcoal-900 font-sans">
            Órdenes & Preventas Comerciales B2B
          </h1>
          <p className="text-warmgray-500 text-xs">
            Revisión, edición de cantidades e impresión oficial de cotizaciones y pedidos.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-warmgray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por N° Orden o Cliente..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-canvas border border-warmgray-200 rounded-full text-charcoal-900 focus:outline-none"
          />
        </div>
      </div>

      {/* Orders List Table */}
      <div className="p-6 rounded-3xl bg-surface border border-warmgray-200 shadow-soft space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-warmgray-200 text-warmgray-500">
                <th className="py-3 px-4">N° Orden / Preventa</th>
                <th className="py-3 px-4">Cliente Comprador</th>
                <th className="py-3 px-4">Destino Panamá</th>
                <th className="py-3 px-4">Total ($)</th>
                <th className="py-3 px-4">Estado Seguimiento</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warmgray-100">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-canvas transition-colors">
                  <td className="py-4 px-4 font-bold text-charcoal-900">{ord.orderNumber}</td>
                  <td className="py-4 px-4 font-sans font-bold text-charcoal-900">{ord.customerName}</td>
                  <td className="py-4 px-4 text-warmgray-700">{ord.shippingProvince}</td>
                  <td className="py-4 px-4 font-bold text-purple-700">${ord.totalAmount.toFixed(2)}</td>
                  <td className="py-4 px-4">
                    <select
                      value={ord.trackingStatus}
                      onChange={(e) => updateOrderStatus(ord.id, e.target.value as any)}
                      className="px-2.5 py-1 bg-canvas border border-warmgray-200 rounded-lg font-bold text-charcoal-900 focus:outline-none cursor-pointer text-[11px]"
                    >
                      <option value="En Preparación">En Preparación</option>
                      <option value="Despachado">Despachado</option>
                      <option value="Entregado">Entregado</option>
                      <option value="Cancelado">Cancelado</option>
                    </select>
                  </td>
                  <td className="py-4 px-4 text-right space-x-2">
                    {/* Inspect PDF */}
                    <button
                      onClick={() => openOrderInspector(ord)}
                      className="px-3 py-1.5 bg-charcoal-900 hover:bg-terracotta-600 text-white rounded-lg font-bold transition-colors inline-flex items-center gap-1 text-[11px]"
                      title="Imprimir Orden Oficial PDF"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Imprimir PDF</span>
                    </button>

                    {/* Edit Items Modal Trigger */}
                    <button
                      onClick={() => setEditingOrder(ord)}
                      className="px-3 py-1.5 bg-canvas hover:bg-warmgray-200 text-charcoal-900 border border-warmgray-200 rounded-lg font-bold transition-colors inline-flex items-center gap-1 text-[11px]"
                      title="Editar Cantidades de la Orden"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Editar</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inline Order Editor Modal / Drawer */}
      {editingOrder && (
        <div className="p-6 rounded-3xl bg-surface border-2 border-terracotta-600 shadow-lifted space-y-4 animate-slideDown">
          <div className="flex justify-between items-center border-b border-warmgray-200 pb-3">
            <div>
              <h3 className="font-serif text-lg font-bold text-charcoal-900 font-sans">
                Edición de Cantidades — {editingOrder.orderNumber}
              </h3>
              <p className="text-warmgray-500 text-xs">Cliente: {editingOrder.customerName}</p>
            </div>

            <button
              onClick={() => setEditingOrder(null)}
              className="p-1.5 hover:bg-warmgray-200 rounded-full text-warmgray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3">
            {editingOrder.items.map((item) => (
              <div key={item.product.id} className="p-3 rounded-2xl bg-canvas border border-warmgray-200 flex justify-between items-center">
                <div>
                  <p className="font-sans font-bold text-charcoal-900">{item.product.name}</p>
                  <p className="text-warmgray-500">Precio B2B: ${item.product.b2bPrice}</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-warmgray-200 rounded-xl bg-surface p-1">
                    <button
                      onClick={() => editOrderQuantity(editingOrder.id, item.product.id, item.quantity - 1)}
                      className="p-1 hover:bg-warmgray-200 rounded-lg"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 font-bold">{item.quantity}</span>
                    <button
                      onClick={() => editOrderQuantity(editingOrder.id, item.product.id, item.quantity + 1)}
                      className="p-1 hover:bg-warmgray-200 rounded-lg"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="font-bold text-purple-700 w-20 text-right">${(item.product.b2bPrice * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setEditingOrder(null)}
              className="px-6 py-2.5 bg-charcoal-900 text-white rounded-full font-bold hover:bg-terracotta-600 transition-colors"
            >
              Listo / Finalizar Edición
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
