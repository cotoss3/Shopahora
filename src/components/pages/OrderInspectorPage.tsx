import React from 'react';
import { ArrowLeft, Printer, Truck, Building2, Briefcase, FileText, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useNavigationStore } from '../../store/useNavigationStore';
import { useInventoryStore } from '../../store/useInventoryStore';
import { FleetVehicle } from '../../types/product';

export const OrderInspectorPage: React.FC = () => {
  const { selectedOrder, navigateTo } = useNavigationStore();
  const { editOrderQuantity, updateOrderStatus } = useInventoryStore();

  if (!selectedOrder) {
    navigateTo('home');
    return null;
  }

  const vehicleLabels: Record<FleetVehicle, string> = {
    moto: 'Motocicleta (Carga Ligera)',
    sedan: 'Auto Sedán (Caja Chica)',
    panel: 'Panel Comercial (Hasta 1 Tonelada)',
    camion_5t: 'Camión de Carga (5 Toneladas)'
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section className="pt-28 pb-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn print-container">
      
      {/* On-Screen Navigation & Back Button (Hidden during print) */}
      <div className="no-print flex items-center justify-between border-b border-warmgray-200/80 pb-4 font-mono text-xs text-warmgray-500">
        <div className="flex items-center gap-2">
          <button onClick={() => navigateTo('home')} className="hover:text-terracotta-600 transition-colors">
            Inicio
          </button>
          <span>/</span>
          <span className="text-charcoal-900 font-bold">Orden de Compra {selectedOrder.orderNumber}</span>
        </div>

        <button
          onClick={() => navigateTo('home')}
          className="px-4 py-2 bg-surface border border-warmgray-200 rounded-full text-xs font-mono font-medium text-charcoal-900 hover:bg-warmgray-100 transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4 text-terracotta-600" />
          <span>Volver a la Lista</span>
        </button>
      </div>

      {/* Main Document Frame */}
      <div className="bg-surface rounded-3xl border border-warmgray-200 shadow-soft p-8 sm:p-12 space-y-8 print:p-0 print:border-none print:shadow-none">
        
        {/* Printable Official Letterhead Header */}
        <div className="flex justify-between items-start border-b-2 border-charcoal-900 pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-9 h-9 rounded-full bg-terracotta-600 text-white flex items-center justify-center font-bold text-lg">
                S
              </span>
              <span className="font-serif text-2xl font-bold tracking-tight text-charcoal-900">
                Shop<span className="italic font-normal text-terracotta-600">Ahora</span> S.A.
              </span>
            </div>
            <p className="text-xs font-mono text-warmgray-700">
              RUC: 155789234-2-2026 DV 45 | Parque Industrial Costa del Este
            </p>
            <p className="text-xs font-mono text-warmgray-500">
              Ciudad de Panamá, República de Panamá | Tel: +507 300-8800
            </p>
          </div>

          <div className="text-right space-y-1 font-mono text-xs">
            <div className="px-3.5 py-1.5 bg-charcoal-900 text-white rounded-lg font-bold text-sm inline-block print:bg-black">
              ORDEN DE COMPRA B2B
            </div>
            <p className="font-bold text-base text-charcoal-900 pt-1">{selectedOrder.orderNumber}</p>
            <p className="text-warmgray-600">Emisión: {selectedOrder.createdAt}</p>
          </div>
        </div>

        {/* Client & Sales Rep Information Box */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 rounded-2xl bg-canvas border border-warmgray-200/90 text-xs font-mono">
          <div className="space-y-1">
            <span className="text-[10px] text-warmgray-500 uppercase font-bold tracking-wider block">DATOS DEL COMPRADOR / CLIENTE:</span>
            <p className="font-bold text-sm text-charcoal-900 font-sans">{selectedOrder.customerName}</p>
            <p className="text-warmgray-700">Dirección: {selectedOrder.shippingAddress}</p>
            <p className="text-warmgray-700">Provincia: {selectedOrder.shippingProvince}</p>
            <p className="text-warmgray-700">Forma de Pago: <strong className="uppercase text-charcoal-900">{selectedOrder.paymentMethod.replace('_', ' ')}</strong></p>
          </div>

          <div className="space-y-1 sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-warmgray-200">
            <span className="text-[10px] text-warmgray-500 uppercase font-bold tracking-wider block">DETALLES COMERCIALES Y DESPACHO:</span>
            <p className="font-bold text-sm text-purple-700 font-sans">
              Vendedor: {selectedOrder.salesRepName || 'Carlos Mendoza (Vendedor)'}
            </p>
            <p className="text-warmgray-700">Flota Asignada: {vehicleLabels[selectedOrder.shippingVehicle]}</p>
            <p className="text-warmgray-700">Canal: <span className="uppercase font-bold">{selectedOrder.channel}</span></p>
            
            {/* Interactive Status Controls (Hidden during print) */}
            <div className="no-print pt-2 flex items-center justify-end gap-2">
              <span className="text-warmgray-500 font-bold">Estado:</span>
              <select
                value={selectedOrder.trackingStatus}
                onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value as any)}
                className="px-3 py-1 bg-surface border border-warmgray-200 rounded-lg text-xs font-bold text-charcoal-900 focus:outline-none"
              >
                <option value="Pedido Recibido">Pedido Recibido</option>
                <option value="En Preparación">En Preparación</option>
                <option value="Despachado en Flota">Despachado en Flota</option>
                <option value="Entregado">Entregado</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </div>
          </div>
        </div>

        {/* Itemized Order Table */}
        <div className="space-y-3 font-mono text-xs">
          <div className="flex justify-between items-center no-print">
            <span className="font-bold text-charcoal-900 text-sm">
              Detalle de Productos (Modificación de Cantidades Habilitada):
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-warmgray-200">
              <thead>
                <tr className="bg-canvas border-b border-warmgray-200 text-warmgray-700 font-bold uppercase text-[10px]">
                  <th className="py-3 px-3">#</th>
                  <th className="py-3 px-3">SKU / Ítem</th>
                  <th className="py-3 px-3">Descripción del Producto</th>
                  <th className="py-3 px-3 text-center">Cant.</th>
                  <th className="py-3 px-3 text-right">Precio Unit. B2B</th>
                  <th className="py-3 px-3 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warmgray-200">
                {selectedOrder.items.map((item, idx) => (
                  <tr key={item.product.id} className="hover:bg-warmgray-100/50">
                    <td className="py-3.5 px-3 text-warmgray-500 font-bold">{idx + 1}</td>
                    <td className="py-3.5 px-3 font-bold text-charcoal-900">SA-PROD-00{item.product.id}</td>
                    <td className="py-3.5 px-3 font-sans font-medium text-charcoal-900">
                      <div>
                        <p className="font-bold">{item.product.name}</p>
                        <p className="text-[10px] text-warmgray-500 font-mono">{item.product.subtitle}</p>
                      </div>
                    </td>
                    
                    {/* Quantity Cell: Interactive Input on Screen, Static Text on Print */}
                    <td className="py-3.5 px-3 text-center">
                      <div className="no-print inline-flex items-center">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={item.quantity}
                          onChange={(e) => editOrderQuantity(selectedOrder.id, item.product.id, parseInt(e.target.value) || 0)}
                          className="w-14 px-2 py-1 bg-canvas border border-warmgray-200 rounded text-center font-bold text-charcoal-900 focus:outline-none"
                        />
                      </div>
                      <span className="hidden print:inline font-bold">{item.quantity} u</span>
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono">${item.product.b2bPrice.toFixed(2)}</td>
                    <td className="py-3.5 px-3 text-right font-bold font-mono">${(item.product.b2bPrice * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Financial Totals Breakdown */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 pt-4 border-t border-warmgray-200 text-xs font-mono">
          
          <div className="space-y-1 text-warmgray-500 max-w-sm">
            <p className="font-bold text-charcoal-900">Notas de Facturación Panamá:</p>
            <p>Facturación electrónica SFEP registrada en la DGI. Impuesto al ITBMS desglosado conforme a las regulaciones de la República de Panamá.</p>
          </div>

          <div className="w-full sm:w-72 space-y-2 bg-canvas p-4 rounded-2xl border border-warmgray-200 font-mono">
            <div className="flex justify-between text-warmgray-700">
              <span>Subtotal Neto:</span>
              <span className="font-bold">${selectedOrder.subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-warmgray-700">
              <span>ITBMS (7% Panamá):</span>
              <span>${selectedOrder.itbmsTax.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-warmgray-700">
              <span>Flete / Despacho Flota:</span>
              <span>${selectedOrder.shippingCost.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-baseline pt-2 border-t border-warmgray-200 font-bold text-base text-charcoal-900">
              <span>TOTAL FACTURADO:</span>
              <span className="text-terracotta-600 font-mono">${selectedOrder.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Formal Signature Blocks (Visible on Document & Print) */}
        <div className="pt-12 grid grid-cols-2 gap-12 font-mono text-xs border-t border-warmgray-200 text-center">
          <div className="space-y-2">
            <div className="border-b border-charcoal-900 h-10 w-3/4 mx-auto" />
            <p className="font-bold text-charcoal-900">Firma Autorizada — ShopAhora S.A.</p>
            <p className="text-[10px] text-warmgray-500">Departamento Comercial B2B</p>
          </div>

          <div className="space-y-2">
            <div className="border-b border-charcoal-900 h-10 w-3/4 mx-auto" />
            <p className="font-bold text-charcoal-900">Recibido Conforme (Firma & Sello Cliente)</p>
            <p className="text-[10px] text-warmgray-500">Representante Legal / Receptor Bodega</p>
          </div>
        </div>

        {/* Action Controls Bar (Hidden during print) */}
        <div className="no-print pt-6 border-t border-warmgray-200 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-warmgray-500 font-mono text-xs">
            <ShieldCheck className="w-4 h-4 text-forest-700" />
            <span>Documento oficial apto para impresión y archivo comercial</span>
          </div>

          <button
            onClick={handlePrint}
            className="px-8 py-3.5 bg-charcoal-900 hover:bg-terracotta-600 text-white rounded-full text-xs font-mono font-medium transition-all shadow-lifted flex items-center gap-2"
          >
            <Printer className="w-4 h-4 text-terracotta-500" />
            <span>Imprimir Orden de Compra Oficial (PDF)</span>
          </button>
        </div>

      </div>

    </section>
  );
};
