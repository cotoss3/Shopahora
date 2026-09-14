import React, { useState } from 'react';
import { Tag, Plus, Check, Power } from 'lucide-react';
import { useAdminStore } from '../../../store/useAdminStore';

export const AdminDiscountsTab: React.FC = () => {
  const { coupons, addCoupon, toggleCouponActive } = useAdminStore();

  const [code, setCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(10);
  const [minPurchase, setMinPurchase] = useState(50);
  const [expiryDate, setExpiryDate] = useState('2026-12-31');

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;

    addCoupon({
      code: code.toUpperCase().trim(),
      discountPercent,
      minPurchase,
      expiryDate,
      isActive: true
    });

    setCode('');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      <div>
        <h2 className="font-serif text-2xl font-bold text-charcoal-900">Descuentos & Cupones Promocionales</h2>
        <p className="text-xs text-warmgray-500 font-mono">
          Creador y administrador de códigos promocionales para la tienda Retail B2C y B2B
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Coupon Form */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-surface border border-warmgray-200 shadow-soft space-y-4">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-terracotta-600" />
            <h3 className="font-serif text-lg font-bold text-charcoal-900">Crear Nuevo Cupón</h3>
          </div>

          <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs font-mono">
            <div>
              <label className="block text-warmgray-700 mb-1">Código del Cupón</label>
              <input
                type="text"
                required
                placeholder="Ejemplo: VERANO2026"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-canvas border border-warmgray-200 rounded-xl font-bold text-charcoal-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-warmgray-700 mb-1">Porcentaje de Descuento (%)</label>
              <input
                type="number"
                min="1"
                max="100"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(parseInt(e.target.value) || 10)}
                className="w-full px-3.5 py-2.5 bg-canvas border border-warmgray-200 rounded-xl font-bold text-charcoal-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-warmgray-700 mb-1">Monto Mínimo de Compra ($)</label>
              <input
                type="number"
                min="0"
                value={minPurchase}
                onChange={(e) => setMinPurchase(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-canvas border border-warmgray-200 rounded-xl font-bold text-charcoal-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-warmgray-700 mb-1">Fecha de Expiración</label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-canvas border border-warmgray-200 rounded-xl font-bold text-charcoal-900 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-charcoal-900 hover:bg-terracotta-600 text-white rounded-xl font-medium transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Guardar y Activar Cupón</span>
            </button>
          </form>
        </div>

        {/* Coupons List */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-surface border border-warmgray-200 shadow-soft space-y-4">
          <h3 className="font-serif text-lg font-bold text-charcoal-900">Cupones Registrados</h3>
          <div className="space-y-3 font-mono text-xs">
            {coupons.map((c) => (
              <div key={c.id} className="p-4 rounded-2xl bg-canvas border border-warmgray-200 flex justify-between items-center">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-charcoal-900">{c.code}</span>
                    <span className="px-2 py-0.5 rounded bg-terracotta-600/10 text-terracotta-700 font-bold">
                      {c.discountPercent ? `${c.discountPercent}% OFF` : `$${c.fixedAmount} OFF`}
                    </span>
                  </div>
                  <p className="text-warmgray-500">Compra Mínima: ${c.minPurchase} | Usos: {c.usesCount}</p>
                  <p className="text-warmgray-400">Vence: {c.expiryDate}</p>
                </div>

                <button
                  onClick={() => toggleCouponActive(c.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    c.isActive ? 'bg-forest-700 text-white' : 'bg-warmgray-300 text-charcoal-900'
                  }`}
                >
                  {c.isActive ? 'Activo' : 'Inactivo'}
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
