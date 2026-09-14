import React from 'react';
import { Percent, ShieldCheck } from 'lucide-react';
import { useAdminStore } from '../../../store/useAdminStore';
import { useInventoryStore } from '../../../store/useInventoryStore';

export const AdminTaxesTab: React.FC = () => {
  const { storeSettings, updateStoreSettings } = useAdminStore();
  const { products, toggleProductActive } = useInventoryStore();

  return (
    <div className="space-y-6 animate-fadeIn">
      
      <div>
        <h2 className="font-serif text-2xl font-bold text-charcoal-900">Impuestos (ITBMS 7% Panamá)</h2>
        <p className="text-xs text-warmgray-500 font-mono">
          Parametrización de la tasa de impuesto oficial e exenciones fiscales por categoría de producto
        </p>
      </div>

      <div className="p-6 rounded-3xl bg-surface border border-warmgray-200 shadow-soft space-y-4">
        <h3 className="font-serif text-lg font-bold text-charcoal-900">Configuración Fiscal General</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 rounded-2xl bg-canvas border border-warmgray-200 space-y-1">
            <span className="text-warmgray-500">Tasa Impuesto ITBMS Panamá</span>
            <p className="text-2xl font-bold text-charcoal-900">7.00%</p>
            <p className="text-[11px] text-warmgray-500 font-sans">Tasa fija según código fiscal de la República de Panamá</p>
          </div>

          <div className="p-4 rounded-2xl bg-canvas border border-warmgray-200 flex items-center justify-between">
            <div>
              <p className="font-bold text-charcoal-900">Precios Incluyen ITBMS</p>
              <p className="text-[11px] text-warmgray-500">Desactivado = Impuesto se calcula en checkout</p>
            </div>
            <button
              onClick={() => updateStoreSettings({ pricesIncludeTax: !storeSettings.pricesIncludeTax })}
              className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                storeSettings.pricesIncludeTax ? 'bg-forest-700 text-white' : 'bg-warmgray-300 text-charcoal-900'
              }`}
            >
              {storeSettings.pricesIncludeTax ? 'SÍ Incluido' : 'NO Incluido'}
            </button>
          </div>
        </div>
      </div>

      {/* Exempt Products Table */}
      <div className="p-6 rounded-3xl bg-surface border border-warmgray-200 shadow-soft space-y-4">
        <h3 className="font-serif text-lg font-bold text-charcoal-900">Productos con Exención de ITBMS (7%)</h3>
        <div className="overflow-x-auto text-xs font-mono">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-warmgray-200 text-warmgray-500">
                <th className="py-3 px-4">Producto</th>
                <th className="py-3 px-4">Categoría</th>
                <th className="py-3 px-4">Precio Retail</th>
                <th className="py-3 px-4">Estado Fiscal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warmgray-100">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-warmgray-100/50">
                  <td className="py-4 px-4 font-bold text-charcoal-900 font-sans">{p.name}</td>
                  <td className="py-4 px-4 uppercase text-warmgray-500">{p.category}</td>
                  <td className="py-4 px-4 font-bold">${p.price}</td>
                  <td className="py-4 px-4">
                    {p.isItbmsExempt ? (
                      <span className="px-2.5 py-1 rounded-full bg-forest-700/10 text-forest-700 font-bold">
                        ✓ EXENTO DE ITBMS
                      </span>
                    ) : (
                      <span className="text-warmgray-500">Gravado al 7%</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
