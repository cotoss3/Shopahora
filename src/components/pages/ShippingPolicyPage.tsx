import React from 'react';
import { ArrowLeft, Truck, Package, MapPin, Clock, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useNavigationStore } from '../../store/useNavigationStore';

export const ShippingPolicyPage: React.FC = () => {
  const { navigateTo } = useNavigationStore();

  const PROVINCE_SLAS = [
    { province: 'Panamá Metro', time: '24 horas hábiles', vehicle: 'Moto / Sedán / Panel', price: 'Gratis a partir de $50' },
    { province: 'Panamá Oeste (Arraiján / La Chorrera)', time: '24 - 48 horas hábiles', vehicle: 'Panel Comercial', price: 'Gratis a partir de $75' },
    { province: 'Colón (Zona Libre / Centro)', time: '24 - 48 horas hábiles', vehicle: 'Panel Comercial', price: 'Gratis a partir de $100' },
    { province: 'Coclé (Penonomé / Aguadulce)', time: '48 horas hábiles', vehicle: 'Camión de Carga 5T / Courier', price: '$8.50 o Gratis > $150' },
    { province: 'Herrera & Los Santos (Chitré / Las Tablas)', time: '48 horas hábiles', vehicle: 'Camión de Carga 5T / Courier', price: '$9.50 o Gratis > $150' },
    { province: 'Veraguas (Santiago)', time: '48 horas hábiles', vehicle: 'Camión de Carga 5T / Courier', price: '$9.50 o Gratis > $150' },
    { province: 'Chiriquí (David / Boquete)', time: '48 - 72 horas hábiles', vehicle: 'Flota Expresa / Uno Express', price: '$12.00 o Gratis > $200' },
    { province: 'Bocas del Toro & Comarcas', time: '72 horas hábiles', vehicle: 'Courier Marítimo / Aéreo', price: 'Tarifa Fija $15.00' }
  ];

  return (
    <section className="pt-28 pb-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
      
      {/* Header & Back Button */}
      <div className="flex items-center justify-between border-b border-warmgray-200/80 pb-4 font-mono text-xs text-warmgray-500">
        <div className="flex items-center gap-2">
          <button onClick={() => navigateTo('home')} className="hover:text-terracotta-600 transition-colors">
            Inicio
          </button>
          <span>/</span>
          <span className="text-charcoal-900 font-bold">Políticas de Envío y Cobertura Nacional</span>
        </div>

        <button
          onClick={() => navigateTo('home')}
          className="px-4 py-2 bg-surface border border-warmgray-200 rounded-full text-xs font-mono font-medium text-charcoal-900 hover:bg-warmgray-100 transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4 text-terracotta-600" />
          <span>Volver al Catálogo</span>
        </button>
      </div>

      {/* Main Document Card */}
      <div className="p-8 sm:p-12 rounded-3xl bg-surface border border-warmgray-200 shadow-soft space-y-8">
        
        {/* Title Banner */}
        <div className="space-y-3 border-b border-warmgray-200 pb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-600/10 text-blue-700 font-mono text-xs font-bold">
            <Truck className="w-4 h-4" />
            <span>Cobertura & Logística Nacional</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900">
            Políticas de Envío, Despacho y Entrega
          </h1>
          <p className="text-xs text-warmgray-500 font-mono">
            Logística Integral Retail (B2C) & Distribución Comercial (B2B) en las 10 Provincias de Panamá
          </p>
        </div>

        {/* Cobertura Grid Table */}
        <div className="space-y-4">
          <h2 className="font-serif text-xl font-bold text-charcoal-900">Tiempos de Entrega & Cobertura por Provincia</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="border-b border-warmgray-200 text-warmgray-500">
                  <th className="py-3 px-4">Provincia / Zona</th>
                  <th className="py-3 px-4">Tiempo Estimado (SLA)</th>
                  <th className="py-3 px-4">Vehículo / Courier Asignado</th>
                  <th className="py-3 px-4">Costo de Envío</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warmgray-100">
                {PROVINCE_SLAS.map((item, idx) => (
                  <tr key={idx} className="hover:bg-warmgray-100/50 transition-colors">
                    <td className="py-4 px-4 font-bold text-charcoal-900">{item.province}</td>
                    <td className="py-4 px-4 text-forest-700 font-bold">{item.time}</td>
                    <td className="py-4 px-4 text-warmgray-700">{item.vehicle}</td>
                    <td className="py-4 px-4 text-terracotta-600 font-bold">{item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Shipping Policies Detailed */}
        <div className="space-y-6 text-xs sm:text-sm text-warmgray-700 leading-relaxed font-sans border-t border-warmgray-200 pt-6">
          
          <div className="space-y-2">
            <h3 className="font-serif text-lg font-bold text-charcoal-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-700 text-white font-mono text-xs flex items-center justify-center font-bold">1</span>
              Asignación Automática de Flota Vehicular
            </h3>
            <p>
              ShopAhora dispone de una flota vehicular propia optimizada por volumen y peso del pedido. Las motocicletas y sedanes atienden paquetería ligera en Panamá Metro, las paneles comerciales procesan volumen mediano en Panamá Oeste y Colón, y los camiones de carga pesada (5T) transportan mercancía B2B a provincias centrales y Chiriquí.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-serif text-lg font-bold text-charcoal-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-700 text-white font-mono text-xs flex items-center justify-center font-bold">2</span>
              Verificación en Entrega & Mermas por Transporte
            </h3>
            <p>
              Al momento del despacho, el cliente o receptor autorizado debe verificar el estado exterior del empaque. En caso de detectar cajas dañadas o inconsistencias en los ítems entregados, nuestro supervisor de bodega registrará la baja por merma en el sistema para reemplazo inmediato sin costo adicional.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-serif text-lg font-bold text-charcoal-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-700 text-white font-mono text-xs flex items-center justify-center font-bold">3</span>
              Rastreo y Notificaciones
            </h3>
            <p>
              Cada pedido cuenta con un número de guía/orden B2B (ejemplo: <code>OC-PAN-2026-X</code>) mediante el cual se puede rastrear el estado del despacho en tiempo real: <em>Pedido Recibido &rarr; En Preparación &rarr; Despachado en Flota &rarr; Entregado</em>.
            </p>
          </div>

        </div>

        {/* Footer Contact Stamp */}
        <div className="p-6 rounded-2xl bg-canvas border border-warmgray-200 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6 text-terracotta-600 flex-shrink-0" />
            <div>
              <p className="font-bold text-charcoal-900">Centro Logístico Principal</p>
              <p className="text-warmgray-500">Parque Industrial Costa del Este | Ciudad de Panamá</p>
            </div>
          </div>

          <button
            onClick={() => navigateTo('home')}
            className="px-5 py-2.5 bg-charcoal-900 text-white rounded-full font-medium hover:bg-terracotta-600 transition-colors"
          >
            Entendido
          </button>
        </div>

      </div>

    </section>
  );
};
