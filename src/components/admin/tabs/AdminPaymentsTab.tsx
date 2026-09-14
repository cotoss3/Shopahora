import React from 'react';
import { CreditCard, Calendar, Check, Percent } from 'lucide-react';
import { useAdminStore } from '../../../store/useAdminStore';

export const AdminPaymentsTab: React.FC = () => {
  const { paymentConfig, updatePaymentConfig } = useAdminStore();

  return (
    <div className="space-y-6 animate-fadeIn">
      
      <div>
        <h2 className="font-serif text-2xl font-bold text-charcoal-900">Pagos, Pasarelas & Cobranzas</h2>
        <p className="text-xs text-warmgray-500 font-mono">
          Configuración de métodos de pago en Panamá y política de Descuento por Pronto Pago
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Payment Gateways */}
        <div className="p-6 rounded-3xl bg-surface border border-warmgray-200 shadow-soft space-y-4">
          <h3 className="font-serif text-lg font-bold text-charcoal-900">Pasarelas de Pago Habilitadas</h3>

          <div className="space-y-3 font-mono text-xs">
            
            <div className="p-4 rounded-2xl bg-canvas border border-warmgray-200/80 flex justify-between items-center">
              <div>
                <p className="font-bold text-charcoal-900">Yappy / Nequi Panamá</p>
                <p className="text-[11px] text-warmgray-500">Pago móvil directo e instantáneo</p>
              </div>
              <button
                onClick={() => updatePaymentConfig({ yappyActive: !paymentConfig.yappyActive })}
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  paymentConfig.yappyActive ? 'bg-forest-700 text-white' : 'bg-warmgray-300 text-charcoal-900'
                }`}
              >
                {paymentConfig.yappyActive ? 'Activo' : 'Desactivado'}
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-canvas border border-warmgray-200/80 flex justify-between items-center">
              <div>
                <p className="font-bold text-charcoal-900">Tarjetas de Crédito / Débito</p>
                <p className="text-[11px] text-warmgray-500">Visa, Mastercard, Clave</p>
              </div>
              <button
                onClick={() => updatePaymentConfig({ creditCardActive: !paymentConfig.creditCardActive })}
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  paymentConfig.creditCardActive ? 'bg-forest-700 text-white' : 'bg-warmgray-300 text-charcoal-900'
                }`}
              >
                {paymentConfig.creditCardActive ? 'Activo' : 'Desactivado'}
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-canvas border border-warmgray-200/80 flex justify-between items-center">
              <div>
                <p className="font-bold text-charcoal-900">Línea de Crédito B2B</p>
                <p className="text-[11px] text-warmgray-500">Facturación a 15, 30 y 45 días</p>
              </div>
              <button
                onClick={() => updatePaymentConfig({ b2bCreditActive: !paymentConfig.b2bCreditActive })}
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  paymentConfig.b2bCreditActive ? 'bg-forest-700 text-white' : 'bg-warmgray-300 text-charcoal-900'
                }`}
              >
                {paymentConfig.b2bCreditActive ? 'Activo' : 'Desactivado'}
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-canvas border border-warmgray-200/80 flex justify-between items-center">
              <div>
                <p className="font-bold text-charcoal-900">Cheques Posfechados</p>
                <p className="text-[11px] text-warmgray-500">Custodia física e ingreso en sistema</p>
              </div>
              <button
                onClick={() => updatePaymentConfig({ postdatedChecksActive: !paymentConfig.postdatedChecksActive })}
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  paymentConfig.postdatedChecksActive ? 'bg-forest-700 text-white' : 'bg-warmgray-300 text-charcoal-900'
                }`}
              >
                {paymentConfig.postdatedChecksActive ? 'Activo' : 'Desactivado'}
              </button>
            </div>

          </div>
        </div>

        {/* Early Payment Discount Setup */}
        <div className="p-6 rounded-3xl bg-surface border border-warmgray-200 shadow-soft space-y-4">
          <h3 className="font-serif text-lg font-bold text-charcoal-900 flex items-center gap-2">
            <Percent className="w-5 h-5 text-terracotta-600" />
            Política de Descuento por Pronto Pago
          </h3>

          <div className="space-y-4 text-xs font-mono">
            <div>
              <label className="block text-warmgray-700 mb-1">Porcentaje de Descuento Autorizado (%):</label>
              <input
                type="number"
                step="0.5"
                value={paymentConfig.earlyDiscountPercent}
                onChange={(e) => updatePaymentConfig({ earlyDiscountPercent: parseFloat(e.target.value) || 0 })}
                className="w-full px-3.5 py-2.5 bg-canvas border border-warmgray-200 rounded-xl font-bold text-charcoal-900 focus:outline-none"
              />
              <p className="text-[11px] text-warmgray-500 mt-1 font-sans">
                Este porcentaje se aplica automáticamente a las facturas a crédito canceladas antes del vencimiento.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
