import React, { useState } from 'react';
import { ArrowLeft, Building2, Plus, Minus, Printer, Send, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useInventoryStore } from '../../store/useInventoryStore';
import { useCartStore } from '../../store/useCartStore';
import { useNavigationStore } from '../../store/useNavigationStore';
import { Product, PanamaProvince, FleetVehicle, UserProfile } from '../../types/product';

interface PresaleItem {
  product: Product;
  quantity: number;
}

export const PresalePage: React.FC = () => {
  const { currentUser } = useAuthStore();
  const { products, calculatePanamaShipping } = useInventoryStore();
  const { showNotification } = useCartStore();
  const { navigateTo } = useNavigationStore();

  const [step, setStep] = useState<1 | 2>(1);
  const [isSuccess, setIsSuccess] = useState(false);

  const clientPortfolio: UserProfile[] = [
    {
      id: 'cli-b2b-1',
      email: 'cliente.b2b@shopahora.com',
      fullName: 'Distribuidora Istmo S.A.',
      companyName: 'Distribuidora Istmo S.A.',
      rucDv: '155729102-2-2021 DV 45',
      role: 'cliente_b2b',
      creditLimit: 15000,
      creditDays: 30,
      creditUsed: 4250,
      isTaxExempt: true
    },
    {
      id: 'cli-b2b-2',
      email: 'chiriqui@comercial.com',
      fullName: 'Comercial Chiriquí RUC 8-901-23',
      companyName: 'Comercial Chiriquí S.A.',
      rucDv: '8-901-23 DV 88',
      role: 'cliente_b2b',
      creditLimit: 25000,
      creditDays: 45,
      creditUsed: 1200,
      isTaxExempt: false
    }
  ];

  const [selectedClient, setSelectedClient] = useState<UserProfile>(clientPortfolio[0]);
  const [items, setItems] = useState<PresaleItem[]>([]);
  const [shippingProvince, setShippingProvince] = useState<PanamaProvince>('Panamá Centro');
  const [shippingVehicle, setShippingVehicle] = useState<FleetVehicle>('panel');
  const [paymentMethod, setPaymentMethod] = useState<'contado' | 'credito_b2b' | 'cheque_posfechado'>('credito_b2b');

  const handleAddProduct = (prod: Product) => {
    const existingIndex = items.findIndex((i) => i.product.id === prod.id);
    if (existingIndex > -1) {
      const updated = [...items];
      updated[existingIndex].quantity += 1;
      setItems(updated);
    } else {
      setItems([...items, { product: prod, quantity: 1 }]);
    }
  };

  const handleUpdateQty = (productId: string, newQty: number) => {
    if (newQty <= 0) {
      setItems(items.filter((i) => i.product.id !== productId));
      return;
    }
    setItems(items.map((i) => (i.product.id === productId ? { ...i, quantity: newQty } : i)));
  };

  const subtotalRetail = items.reduce((acc, i) => acc + i.product.price * i.quantity, 0);
  const subtotalB2B = items.reduce((acc, i) => acc + i.product.b2bPrice * i.quantity, 0);
  const discountB2B = subtotalRetail - subtotalB2B;

  const itbmsTax = selectedClient.isTaxExempt
    ? 0
    : items.reduce((acc, i) => {
        if (i.product.isItbmsExempt) return acc;
        return acc + i.product.b2bPrice * i.quantity * 0.07;
      }, 0);

  const shippingCost = items.length > 0 ? calculatePanamaShipping(shippingProvince, shippingVehicle) : 0;
  const totalFinal = subtotalB2B + itbmsTax + shippingCost;

  const handleConfirmOrder = () => {
    setIsSuccess(true);
    showNotification(`Preventa registrada para ${selectedClient.companyName}`);
  };

  const presaleNumber = `PRE-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  return (
    <section className="pt-28 pb-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
      
      {/* Back Button */}
      <button
        onClick={() => navigateTo('home')}
        className="px-4 py-2 bg-surface border border-warmgray-200 rounded-full text-xs font-mono font-medium text-charcoal-900 hover:bg-warmgray-100 transition-colors flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4 text-terracotta-600" />
        <span>Volver a Mi Cartera</span>
      </button>

      {/* Main Full Page Content */}
      <div className="bg-surface rounded-3xl border border-warmgray-200 shadow-soft overflow-hidden p-6 sm:p-10">
        
        {isSuccess ? (
          <div className="py-12 text-center space-y-6">
            <div className="w-20 h-20 bg-forest-700/10 text-forest-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            
            <div className="space-y-2 font-mono">
              <h2 className="font-serif text-3xl font-bold text-charcoal-900">
                ¡Orden de Preventa #{presaleNumber} Generada!
              </h2>
              <p className="text-sm text-warmgray-700 max-w-md mx-auto font-light font-sans">
                La orden de preventa para <strong>{selectedClient.companyName}</strong> ha sido transmitida a bodega y facturación.
              </p>
              <p className="text-xs text-terracotta-600 font-bold pt-2">
                Monto Total: ${totalFinal.toFixed(2)} (Crédito a {selectedClient.creditDays} Días)
              </p>
            </div>

            <div className="flex justify-center gap-4 pt-4">
              <button
                onClick={() => window.print()}
                className="px-6 py-3 bg-canvas hover:bg-warmgray-200 text-charcoal-900 border border-warmgray-200 rounded-full text-xs font-mono font-medium flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir Cotización</span>
              </button>

              <button
                onClick={() => {
                  setIsSuccess(false);
                  navigateTo('home');
                }}
                className="px-8 py-3 bg-charcoal-900 hover:bg-terracotta-600 text-white rounded-full text-xs font-mono font-medium"
              >
                Volver al Panel
              </button>
            </div>
          </div>
        ) : step === 1 ? (
          /* Step 1: Config */
          <div className="space-y-6">
            <div>
              <h1 className="font-serif text-3xl font-bold text-charcoal-900">
                Creación de Preventa & Cotización Mayorista B2B
              </h1>
              <p className="text-xs text-warmgray-500 font-mono mt-1">
                Selección de cliente de cartera, productos y matriz logística de Panamá
              </p>
            </div>

            {/* Client Picker */}
            <div className="p-5 rounded-2xl bg-canvas border border-warmgray-200 space-y-3 font-mono text-xs">
              <label className="block font-bold uppercase text-charcoal-900">
                Cliente Mayorista Comprador
              </label>
              <select
                value={selectedClient.id}
                onChange={(e) => {
                  const found = clientPortfolio.find((c) => c.id === e.target.value);
                  if (found) setSelectedClient(found);
                }}
                className="w-full px-3.5 py-2.5 bg-surface border border-warmgray-200 rounded-xl text-charcoal-900 font-bold focus:outline-none"
              >
                {clientPortfolio.map((cli) => (
                  <option key={cli.id} value={cli.id}>
                    {cli.companyName} ({cli.rucDv}) — Crédito Disponible: ${ (cli.creditLimit - cli.creditUsed).toFixed(2) }
                  </option>
                ))}
              </select>
            </div>

            {/* Products Picker Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-3">
                <span className="text-xs font-mono font-bold uppercase text-warmgray-500 block">
                  Catálogo Mayorista
                </span>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {products.map((p) => (
                    <div key={p.id} className="p-3 rounded-2xl bg-canvas border border-warmgray-200 flex items-center justify-between font-mono text-xs">
                      <div className="flex items-center gap-3">
                        <img src={p.images[0]} alt="" className="w-10 h-10 object-cover rounded-xl bg-warmgray-100" />
                        <div>
                          <p className="font-bold text-charcoal-900 font-sans line-clamp-1">{p.name}</p>
                          <p className="text-warmgray-500">B2B: ${p.b2bPrice} | Stock: {p.stockPhysical} u</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleAddProduct(p)}
                        className="p-2 bg-charcoal-900 text-white rounded-lg hover:bg-terracotta-600 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Items Selected Summary */}
              <div className="space-y-3">
                <span className="text-xs font-mono font-bold uppercase text-warmgray-500 block">
                  Resumen de Preventa ({items.reduce((acc, i) => acc + i.quantity, 0)} ítems)
                </span>
                <div className="p-4 rounded-2xl bg-canvas border border-warmgray-200 min-h-[300px] flex flex-col justify-between space-y-3 font-mono text-xs">
                  {items.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-center text-warmgray-400 py-12">
                      Selecciona productos del catálogo para armar la preventa.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[220px] overflow-y-auto">
                      {items.map((item) => (
                        <div key={item.product.id} className="flex items-center justify-between p-2 rounded-xl bg-surface border border-warmgray-200">
                          <span className="font-bold text-charcoal-900 font-sans line-clamp-1 flex-1">
                            {item.product.name}
                          </span>
                          <div className="flex items-center gap-2">
                            <button onClick={() => handleUpdateQty(item.product.id, item.quantity - 1)} className="p-1">
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-bold">{item.quantity}</span>
                            <button onClick={() => handleAddProduct(item.product)} className="p-1">
                              <Plus className="w-3 h-3" />
                            </button>
                            <span className="font-bold text-purple-700 ml-2">${(item.product.b2bPrice * item.quantity).toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="pt-2 border-t border-warmgray-200 flex justify-between font-bold text-charcoal-900">
                    <span>Subtotal B2B:</span>
                    <span className="text-purple-700">${subtotalB2B.toFixed(2)}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Panama Shipping & Payment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
              <div>
                <label className="block text-warmgray-700 font-bold mb-1">Destino de Entrega Panamá</label>
                <select
                  value={shippingProvince}
                  onChange={(e) => setShippingProvince(e.target.value as PanamaProvince)}
                  className="w-full px-3.5 py-2.5 bg-canvas border border-warmgray-200 rounded-xl font-bold text-charcoal-900 focus:outline-none"
                >
                  <option value="Panamá Centro">Panamá Centro</option>
                  <option value="Panamá Oeste">Panamá Oeste</option>
                  <option value="Colón">Colón</option>
                  <option value="Provincias Centrales (Coclé, Herrera, Los Santos, Veraguas)">Provincias Centrales</option>
                  <option value="Chiriquí">Chiriquí</option>
                  <option value="Bocas del Toro & Comarcas">Bocas del Toro & Comarcas</option>
                </select>
              </div>

              <div>
                <label className="block text-warmgray-700 font-bold mb-1">Forma de Pago Solicitada</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-canvas border border-warmgray-200 rounded-xl font-bold text-charcoal-900 focus:outline-none"
                >
                  <option value="credito_b2b">Línea de Crédito ({selectedClient.creditDays} Días)</option>
                  <option value="cheque_posfechado">Cheque Posfechado</option>
                  <option value="contado">Pago Contado / Transferencia</option>
                </select>
              </div>
            </div>

            {/* Proceed to Preview */}
            <div className="pt-4 border-t border-warmgray-200 flex justify-end">
              <button
                disabled={items.length === 0}
                onClick={() => setStep(2)}
                className="px-8 py-3.5 bg-charcoal-900 hover:bg-terracotta-600 disabled:bg-warmgray-300 text-white rounded-2xl font-medium text-xs font-mono transition-all shadow-lifted flex items-center gap-2"
              >
                <span>Generar Vista Previa Completa</span>
                <Send className="w-4 h-4" />
              </button>
            </div>

          </div>
        ) : (
          /* Step 2: Full Presale Document Preview */
          <div className="space-y-6 font-mono text-xs">
            <div className="p-8 bg-canvas rounded-3xl border border-warmgray-200 space-y-6">
              
              <div className="flex justify-between items-start border-b border-warmgray-200 pb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-7 h-7 rounded-full bg-terracotta-600 text-white flex items-center justify-center font-bold text-xs font-sans">
                      S
                    </span>
                    <span className="font-serif text-xl font-bold text-charcoal-900 font-sans">
                      Shop<span className="italic text-terracotta-600">Ahora</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-warmgray-500">ShopAhora Panamá S.A. | RUC: 155789021-2-2022 DV 98</p>
                </div>

                <div className="text-right space-y-1">
                  <span className="px-3 py-1 bg-purple-600/10 text-purple-700 font-bold rounded-full text-xs">
                    HOJA DE PREVENTA B2B
                  </span>
                  <p className="font-bold text-base text-charcoal-900 pt-1">{presaleNumber}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 p-4 rounded-2xl bg-surface border border-warmgray-200">
                <div className="space-y-1">
                  <span className="text-[10px] text-warmgray-500 uppercase font-bold">Cliente B2B:</span>
                  <p className="font-bold text-charcoal-900 font-sans">{selectedClient.companyName}</p>
                  <p className="text-warmgray-700">RUC/DV: {selectedClient.rucDv}</p>
                </div>
                <div className="space-y-1 text-right">
                  <span className="text-[10px] text-warmgray-500 uppercase font-bold">Vendedor Comercial:</span>
                  <p className="font-bold text-purple-700 font-sans">{currentUser.fullName}</p>
                  <p className="text-warmgray-700">Destino: {shippingProvince}</p>
                </div>
              </div>

              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-warmgray-200 text-warmgray-500 text-[11px]">
                    <th className="py-2">Producto</th>
                    <th className="py-2 text-center">Cant</th>
                    <th className="py-2 text-right">Precio B2B</th>
                    <th className="py-2 text-right">Total B2B</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-warmgray-100">
                  {items.map((i) => (
                    <tr key={i.product.id}>
                      <td className="py-2.5 font-bold text-charcoal-900 font-sans">{i.product.name}</td>
                      <td className="py-2.5 text-center font-bold">{i.quantity}</td>
                      <td className="py-2.5 text-right font-bold text-purple-700">${i.product.b2bPrice.toFixed(2)}</td>
                      <td className="py-2.5 text-right font-bold text-charcoal-900">${(i.product.b2bPrice * i.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="border-t border-warmgray-200 pt-4 flex flex-col items-end space-y-1 text-xs">
                <div className="flex justify-between w-64 text-warmgray-700">
                  <span>Subtotal B2B:</span>
                  <span>${subtotalB2B.toFixed(2)}</span>
                </div>
                <div className="flex justify-between w-64 text-warmgray-700">
                  <span>Impuesto ITBMS (7%):</span>
                  <span>${itbmsTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between w-64 text-warmgray-700">
                  <span>Flete Panamá:</span>
                  <span>${shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between w-64 font-bold text-sm text-charcoal-900 pt-2 border-t border-warmgray-200">
                  <span>Total Facturado:</span>
                  <span className="text-terracotta-600">${totalFinal.toFixed(2)}</span>
                </div>
              </div>

            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setStep(1)}
                className="px-5 py-2.5 bg-canvas hover:bg-warmgray-200 text-charcoal-900 border border-warmgray-200 rounded-full font-medium"
              >
                Modificar Ítems
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2.5 bg-canvas hover:bg-warmgray-200 text-charcoal-900 border border-warmgray-200 rounded-full font-medium flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir Cotización</span>
                </button>

                <button
                  onClick={handleConfirmOrder}
                  className="px-8 py-3 bg-charcoal-900 hover:bg-terracotta-600 text-white rounded-full font-medium shadow-lifted flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Confirmar y Enviar Pedido</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

    </section>
  );
};
