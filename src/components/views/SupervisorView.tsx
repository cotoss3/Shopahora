import React, { useState } from 'react';
import { Warehouse, AlertTriangle, Truck, Edit, Check, Plus, PackageCheck, Briefcase, Eye, Building2, ExternalLink } from 'lucide-react';
import { useInventoryStore } from '../../store/useInventoryStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useNavigationStore } from '../../store/useNavigationStore';
import { FleetVehicle, Order } from '../../types/product';

export const SupervisorView: React.FC = () => {
  const { currentUser } = useAuthStore();
  const { products, stockLosses, orders, reportStockLoss, editOrderQuantity, updateOrderStatus } = useInventoryStore();
  const { openOrderInspector, navigateTo } = useNavigationStore();

  const [selectedProductForLoss, setSelectedProductForLoss] = useState(products[0]?.id || '');
  const [lossQty, setLossQty] = useState(1);
  const [lossReason, setLossReason] = useState('');

  const handleLossSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductForLoss || lossQty <= 0 || !lossReason) return;

    reportStockLoss(selectedProductForLoss, lossQty, lossReason, currentUser.fullName);
    setLossReason('');
    setLossQty(1);
  };

  const vehicleLabels: Record<FleetVehicle, string> = {
    moto: 'Motocicleta (Carga Ligera)',
    sedan: 'Auto Sedán (Caja Chica)',
    panel: 'Panel Comercial (Hasta 1 Tonelada)',
    camion_5t: 'Camión de Carga (5 Toneladas)'
  };

  return (
    <section className="pt-28 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
      
      {/* Supervisor Header */}
      <div className="p-8 rounded-3xl bg-surface border border-warmgray-200/80 shadow-soft flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 text-blue-700 text-xs font-mono font-semibold">
            <Warehouse className="w-3.5 h-3.5" />
            <span>Módulo Operativo de Bodega & Despacho</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-charcoal-900">
            Supervisor: {currentUser.fullName}
          </h1>
          <p className="text-xs text-warmgray-500 font-mono">
            Verificación de Orden de Compra B2B | Trazabilidad de Vendedor | Registro de Mermas
          </p>
        </div>

        <button
          onClick={() => navigateTo('mermas')}
          className="px-6 py-3.5 bg-charcoal-900 hover:bg-terracotta-600 text-white rounded-full text-xs font-medium font-mono transition-all shadow-lifted flex items-center gap-2"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Gestión de Mermas (Pantalla Completa)</span>
        </button>
      </div>

      {/* Stock Losses (Mermas) Form & History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Form Column */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-surface border border-warmgray-200 shadow-soft space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h2 className="font-serif text-xl font-bold text-charcoal-900">Registrar Merma / Daño</h2>
          </div>

          <form onSubmit={handleLossSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-mono text-warmgray-700 mb-1">Producto Defectuoso</label>
              <select
                value={selectedProductForLoss}
                onChange={(e) => setSelectedProductForLoss(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-canvas border border-warmgray-200 rounded-xl text-charcoal-900 font-medium focus:outline-none"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (Stock Actual: {p.stockPhysical})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-mono text-warmgray-700 mb-1">Cantidad a Dar de Baja</label>
              <input
                type="number"
                min="1"
                max="50"
                value={lossQty}
                onChange={(e) => setLossQty(parseInt(e.target.value) || 1)}
                className="w-full px-3.5 py-2.5 bg-canvas border border-warmgray-200 rounded-xl font-mono text-charcoal-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-warmgray-700 mb-1">Justificación del Daño / Defecto</label>
              <textarea
                required
                rows={3}
                placeholder="Ejemplo: Caja abollada, pantalla rayada en inspección de empaque..."
                value={lossReason}
                onChange={(e) => setLossReason(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-canvas border border-warmgray-200 rounded-xl text-charcoal-900 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Confirmar Baja e Inactivar Inventario</span>
            </button>
          </form>
        </div>

        {/* History Column */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-surface border border-warmgray-200 shadow-soft space-y-4">
          <h2 className="font-serif text-xl font-bold text-charcoal-900">Historial de Mermas Registradas</h2>
          <div className="space-y-3 max-h-[350px] overflow-y-auto">
            {stockLosses.map((loss) => (
              <div key={loss.id} className="p-4 rounded-2xl bg-canvas border border-warmgray-200/80 text-xs font-mono space-y-1">
                <div className="flex justify-between items-center font-bold text-charcoal-900">
                  <span>{loss.productName}</span>
                  <span className="text-red-600">-{loss.quantity} Unidad(es)</span>
                </div>
                <p className="text-warmgray-700 font-sans">{loss.reason}</p>
                <div className="flex justify-between text-[11px] text-warmgray-400 pt-1">
                  <span>Reportado por: {loss.reportedBy}</span>
                  <span>{loss.createdAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Orders Active Dispatch & Modification */}
      <div className="p-6 rounded-3xl bg-surface border border-warmgray-200 shadow-soft space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl font-bold text-charcoal-900">Control de Pedidos Activos, Vendedores & Despacho</h2>
            <p className="text-xs text-warmgray-500 font-mono">Trazabilidad de vendedor comercial, edición de cantidades por faltantes y asignación de flota</p>
          </div>
        </div>

        <div className="space-y-4">
          {orders.map((ord) => (
            <div key={ord.id} className="p-6 rounded-2xl bg-canvas border border-warmgray-200 space-y-4">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-warmgray-200 pb-4 text-xs font-mono">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-charcoal-900">{ord.orderNumber}</span>
                    <button
                      onClick={() => openOrderInspector(ord)}
                      className="px-2.5 py-1 bg-surface border border-warmgray-200 hover:border-terracotta-500 rounded text-[11px] font-bold text-charcoal-900 flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5 text-purple-700" />
                      <span>Ver Orden B2B Completa</span>
                    </button>
                  </div>
                  
                  <p className="text-warmgray-700 font-sans font-medium mt-1 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-forest-700" /> {ord.customerName} ({ord.channel.toUpperCase()})
                  </p>
                  
                  <p className="text-purple-700 font-mono text-[11px] font-semibold flex items-center gap-1 mt-0.5">
                    <Briefcase className="w-3.5 h-3.5 text-amber-600" /> Vendedor Asignado: {ord.salesRepName || 'Carlos Mendoza (Vendedor)'}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-bold text-charcoal-900">${ord.totalAmount.toFixed(2)}</p>
                    <p className="text-[11px] text-warmgray-500">{ord.shippingProvince}</p>
                  </div>
                  
                  {/* Status Dropdown */}
                  <select
                    value={ord.trackingStatus}
                    onChange={(e) => updateOrderStatus(ord.id, e.target.value as any)}
                    className="px-3 py-1.5 bg-surface border border-warmgray-200 rounded-lg text-xs font-bold text-charcoal-900 focus:outline-none"
                  >
                    <option value="Pedido Recibido">Pedido Recibido</option>
                    <option value="En Preparación">En Preparación</option>
                    <option value="Despachado en Flota">Despachado en Flota</option>
                    <option value="Entregado">Entregado</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
                </div>
              </div>

              {/* Order Items & Edit Quantity */}
              <div className="space-y-2 text-xs">
                <span className="font-mono text-warmgray-500 font-semibold block">Ítems del Pedido (Edición Habilitada por Faltante o Merma):</span>
                {ord.items.map((item) => (
                  <div key={item.product.id} className="flex items-center justify-between p-3 rounded-xl bg-surface border border-warmgray-200 font-mono">
                    <span className="font-bold text-charcoal-900">{item.product.name}</span>
                    <div className="flex items-center gap-4">
                      <span>Precio Unit: ${item.product.price}</span>
                      
                      {/* Quantity Modifier */}
                      <div className="flex items-center gap-2">
                        <span className="text-warmgray-500">Cant:</span>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={item.quantity}
                          onChange={(e) => editOrderQuantity(ord.id, item.product.id, parseInt(e.target.value) || 0)}
                          className="w-16 px-2 py-1 bg-canvas border border-warmgray-200 rounded text-center font-bold text-charcoal-900 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Assigned Vehicle */}
              <div className="flex items-center justify-between text-xs font-mono pt-2 text-warmgray-700">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-terracotta-600" /> Vehículo Asignado: <strong>{vehicleLabels[ord.shippingVehicle]}</strong>
                </span>
                {ord.isModified && (
                  <span className="text-amber-600 font-bold">✓ Modificado por Supervisor</span>
                )}
              </div>

            </div>
          ))}
        </div>
      </div>

    </section>
  );
};
