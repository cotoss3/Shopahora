import React, { useState } from 'react';
import { ArrowLeft, AlertTriangle, Warehouse, CheckCircle2 } from 'lucide-react';
import { useInventoryStore } from '../../store/useInventoryStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useNavigationStore } from '../../store/useNavigationStore';

export const StockLossPage: React.FC = () => {
  const { currentUser } = useAuthStore();
  const { products, stockLosses, reportStockLoss } = useInventoryStore();
  const { navigateTo } = useNavigationStore();

  const [selectedProductForLoss, setSelectedProductForLoss] = useState(products[0]?.id || '');
  const [lossQty, setLossQty] = useState(1);
  const [lossReason, setLossReason] = useState('');
  const [successMessage, setSuccessMessage] = useState(false);

  const handleLossSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductForLoss || lossQty <= 0 || !lossReason) return;

    reportStockLoss(selectedProductForLoss, lossQty, lossReason, currentUser.fullName);
    setLossReason('');
    setLossQty(1);
    setSuccessMessage(true);
    setTimeout(() => setSuccessMessage(false), 3000);
  };

  return (
    <section className="pt-28 pb-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
      
      <button
        onClick={() => navigateTo('home')}
        className="px-4 py-2 bg-surface border border-warmgray-200 rounded-full text-xs font-mono font-medium text-charcoal-900 hover:bg-warmgray-100 transition-colors flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4 text-terracotta-600" />
        <span>Volver a Control de Despacho</span>
      </button>

      <div>
        <h1 className="font-serif text-3xl font-bold text-charcoal-900">
          Módulo de Gestión de Mermas & Artículos Defectuosos
        </h1>
        <p className="text-xs text-warmgray-500 font-mono mt-1">
          Registro oficial de baja de productos dañados e inactivación de stock en bodega
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Form */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-surface border border-warmgray-200 shadow-soft space-y-4 font-mono text-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h2 className="font-serif text-lg font-bold text-charcoal-900 font-sans">Registrar Merma</h2>
          </div>

          {successMessage && (
            <div className="p-3 rounded-xl bg-forest-700/10 text-forest-700 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Merma registrada e inventario ajustado.</span>
            </div>
          )}

          <form onSubmit={handleLossSubmit} className="space-y-4">
            <div>
              <label className="block text-warmgray-700 mb-1">Producto Defectuoso</label>
              <select
                value={selectedProductForLoss}
                onChange={(e) => setSelectedProductForLoss(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-canvas border border-warmgray-200 rounded-xl text-charcoal-900 font-bold focus:outline-none"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (Stock: {p.stockPhysical} u)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-warmgray-700 mb-1">Cantidad a Dar de Baja</label>
              <input
                type="number"
                min="1"
                max="50"
                value={lossQty}
                onChange={(e) => setLossQty(parseInt(e.target.value) || 1)}
                className="w-full px-3.5 py-2.5 bg-canvas border border-warmgray-200 rounded-xl font-bold text-charcoal-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-warmgray-700 mb-1">Justificación del Daño / Defecto</label>
              <textarea
                required
                rows={3}
                placeholder="Ejemplo: Caja abollada, pantalla rayada en inspección..."
                value={lossReason}
                onChange={(e) => setLossReason(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-canvas border border-warmgray-200 rounded-xl text-charcoal-900 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Confirmar Baja e Inactivar Inventario</span>
            </button>
          </form>
        </div>

        {/* History Log */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-surface border border-warmgray-200 shadow-soft space-y-4 font-mono text-xs">
          <h2 className="font-serif text-lg font-bold text-charcoal-900 font-sans">Historial de Mermas Registradas</h2>
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {stockLosses.map((loss) => (
              <div key={loss.id} className="p-4 rounded-2xl bg-canvas border border-warmgray-200/80 space-y-1">
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

    </section>
  );
};
