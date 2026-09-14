import React, { useState } from 'react';
import { Settings, Save, ShieldCheck, Check } from 'lucide-react';
import { useAdminStore } from '../../../store/useAdminStore';

export const AdminSettingsTab: React.FC = () => {
  const { storeSettings, updateStoreSettings } = useAdminStore();
  const [savedMessage, setSavedMessage] = useState(false);

  const [form, setForm] = useState({ ...storeSettings });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreSettings(form);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      <div>
        <h2 className="font-serif text-2xl font-bold text-charcoal-900">Configuración General de la Tienda</h2>
        <p className="text-xs text-warmgray-500 font-mono">
          Datos comerciales de Panamá (RUC/DV), correo oficial, moneda y políticas legales
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Basic Info Box */}
        <div className="p-6 rounded-3xl bg-surface border border-warmgray-200 shadow-soft space-y-4 font-mono text-xs">
          <h3 className="font-serif text-lg font-bold text-charcoal-900 font-sans">Información de la Empresa</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-warmgray-700 mb-1">Nombre Comercial de la Tienda</label>
              <input
                type="text"
                required
                value={form.storeName}
                onChange={(e) => setForm({ ...form, storeName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-canvas border border-warmgray-200 rounded-xl font-bold text-charcoal-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-warmgray-700 mb-1">RUC & DV (República de Panamá)</label>
              <input
                type="text"
                required
                value={form.rucDv}
                onChange={(e) => setForm({ ...form, rucDv: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-canvas border border-warmgray-200 rounded-xl font-bold text-charcoal-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-warmgray-700 mb-1">Correo Electrónico de Contacto</label>
              <input
                type="email"
                required
                value={form.contactEmail}
                onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-canvas border border-warmgray-200 rounded-xl font-bold text-charcoal-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-warmgray-700 mb-1">Moneda del Sistema</label>
              <select
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value as any })}
                className="w-full px-3.5 py-2.5 bg-canvas border border-warmgray-200 rounded-xl font-bold text-charcoal-900 focus:outline-none"
              >
                <option value="USD">USD ($) - Dólar Estadounidense</option>
                <option value="PAB">PAB (B/.) - Balboa Panameño</option>
              </select>
            </div>
          </div>
        </div>

        {/* Legal Policies Box */}
        <div className="p-6 rounded-3xl bg-surface border border-warmgray-200 shadow-soft space-y-4 font-mono text-xs">
          <h3 className="font-serif text-lg font-bold text-charcoal-900 font-sans">Políticas Legales</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-warmgray-700 mb-1">Términos & Condiciones</label>
              <textarea
                rows={3}
                value={form.termsPolicy}
                onChange={(e) => setForm({ ...form, termsPolicy: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-canvas border border-warmgray-200 rounded-xl text-charcoal-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-warmgray-700 mb-1">Política de Devolución & Garantías</label>
              <textarea
                rows={3}
                value={form.refundPolicy}
                onChange={(e) => setForm({ ...form, refundPolicy: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-canvas border border-warmgray-200 rounded-xl text-charcoal-900 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between">
          {savedMessage && (
            <span className="text-xs font-mono font-bold text-forest-700 flex items-center gap-1">
              <Check className="w-4 h-4" /> Configuración Guardada Exitosamente
            </span>
          )}

          <button
            type="submit"
            className="px-8 py-3.5 bg-charcoal-900 hover:bg-terracotta-600 text-white rounded-full text-xs font-medium transition-all shadow-soft flex items-center gap-2 ml-auto"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Cambios de Configuración</span>
          </button>
        </div>

      </form>

    </div>
  );
};
