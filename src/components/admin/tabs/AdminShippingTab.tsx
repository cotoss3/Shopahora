import React from 'react';
import { Truck, MapPin, Edit3, ShieldCheck } from 'lucide-react';
import { PANAMA_SHIPPING_RATES } from '../../../data/products';
import { FleetVehicle } from '../../../types/product';

export const AdminShippingTab: React.FC = () => {
  const vehicleNames: Record<FleetVehicle, string> = {
    moto: 'Motocicleta (Carga Ligera)',
    sedan: 'Auto Sedán (Caja Chica)',
    panel: 'Panel Comercial (Hasta 1 Tonelada)',
    camion_5t: 'Camión de Carga (5 Toneladas)'
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      <div>
        <h2 className="font-serif text-2xl font-bold text-charcoal-900">Envíos & Logística Panamá</h2>
        <p className="text-xs text-warmgray-500 font-mono">
          Matriz de tarifas por zona geográfica y tipo de vehículo de carga asignado
        </p>
      </div>

      <div className="p-6 rounded-3xl bg-surface border border-warmgray-200 shadow-soft space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-serif text-lg font-bold text-charcoal-900">Tarifario de Fletes Nacionales</h3>
          <span className="text-xs font-mono text-forest-700 font-bold">✓ Cobertura Nacional 100% Panamá</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="border-b border-warmgray-200 text-warmgray-500">
                <th className="py-3 px-4">Provincia / Destino</th>
                <th className="py-3 px-4">Vehículo Requerido</th>
                <th className="py-3 px-4">Tarifa Base ($)</th>
                <th className="py-3 px-4">Tiempo Estimado</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warmgray-100">
              {PANAMA_SHIPPING_RATES.map((rate, idx) => (
                <tr key={idx} className="hover:bg-warmgray-100/50 transition-colors">
                  <td className="py-4 px-4 font-bold text-charcoal-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-terracotta-600" />
                    <span>{rate.province}</span>
                  </td>
                  <td className="py-4 px-4 font-sans font-medium text-charcoal-900">
                    {vehicleNames[rate.vehicle]}
                  </td>
                  <td className="py-4 px-4 font-bold text-terracotta-600">${rate.rate.toFixed(2)}</td>
                  <td className="py-4 px-4 text-warmgray-700">{rate.estimatedHours} horas</td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => alert('Modificador de tarifa habilitado.')}
                      className="px-3 py-1.5 bg-canvas hover:bg-warmgray-200 text-charcoal-900 border border-warmgray-200 rounded-lg text-xs font-medium transition-colors ml-auto"
                    >
                      Ajustar Tarifa
                    </button>
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
