import React, { useState } from 'react';
import { X, CheckCircle2, CreditCard, ShieldCheck, Lock, ArrowLeft, Truck, Building2, Calendar } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { useInventoryStore } from '../store/useInventoryStore';
import { PanamaProvince, FleetVehicle } from '../types/product';

export const CheckoutModal: React.FC = () => {
  const { cart, isCheckoutOpen, closeCheckout, clearCart } = useCartStore();
  const { currentUser } = useAuthStore();
  const { calculatePanamaShipping } = useInventoryStore();

  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [shippingProvince, setShippingProvince] = useState<PanamaProvince>('Panamá Centro');
  const [shippingVehicle, setShippingVehicle] = useState<FleetVehicle>('panel');
  const [paymentMethod, setPaymentMethod] = useState<'contado' | 'credito_b2b' | 'cheque_posfechado'>('contado');

  if (!isCheckoutOpen) return null;

  // Pricing calculations according to user role & Panama Tax ITBMS (7%)
  const isB2B = currentUser.role === 'cliente_b2b';
  const isTaxExempt = currentUser.isTaxExempt;

  const subtotal = cart.reduce((sum, item) => {
    const itemPrice = isB2B ? item.product.b2bPrice : item.product.price;
    return sum + itemPrice * item.quantity;
  }, 0);

  // ITBMS 7% calculated only on non-exempt products and non-exempt B2B clients
  const itbmsTax = isTaxExempt
    ? 0
    : cart.reduce((sum, item) => {
        if (item.product.isItbmsExempt) return sum;
        const itemPrice = isB2B ? item.product.b2bPrice : item.product.price;
        return sum + itemPrice * item.quantity * 0.07;
      }, 0);

  const shippingCost = calculatePanamaShipping(shippingProvince, shippingVehicle);
  const total = subtotal + itbmsTax + shippingCost;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setIsSuccess(true);
      clearCart();
    }, 1500);
  };

  const provinces: PanamaProvince[] = [
    'Panamá Centro',
    'Panamá Oeste',
    'Colón',
    'Provincias Centrales (Coclé, Herrera, Los Santos, Veraguas)',
    'Chiriquí',
    'Bocas del Toro & Comarcas'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-charcoal-900/60 backdrop-blur-sm animate-fadeIn">
      
      <div className="relative w-full max-w-3xl bg-canvas rounded-3xl shadow-lifted border border-warmgray-200 overflow-hidden max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="p-6 border-b border-warmgray-200/80 bg-surface flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-forest-700" />
            <h2 className="font-serif text-xl font-bold text-charcoal-900">
              {isSuccess ? '¡Pedido Confirmado!' : `Checkout Panamá (${isB2B ? 'B2B Mayorista' : 'Retail B2C'})`}
            </h2>
          </div>
          <button
            onClick={() => {
              closeCheckout();
              setIsSuccess(false);
            }}
            className="p-2 text-warmgray-500 hover:text-charcoal-900 hover:bg-warmgray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 sm:p-12 text-center space-y-6">
            <div className="w-20 h-20 bg-forest-700/10 text-forest-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900">
                ¡Pedido #{Math.floor(100000 + Math.random() * 900000)} Registrado!
              </h3>
              <p className="text-sm text-warmgray-700 max-w-md mx-auto font-light">
                {isB2B
                  ? `Facturado a cuenta de crédito de ${currentUser.companyName} con vencimiento a ${currentUser.creditDays} días.`
                  : 'Hemos recibido tu orden y asignado la flota de transporte para el envío.'}
              </p>
              <p className="font-mono text-xs text-terracotta-600 font-semibold pt-2">
                Provincia de Entrega: {shippingProvince}
              </p>
            </div>

            <button
              onClick={() => {
                closeCheckout();
                setIsSuccess(false);
              }}
              className="px-8 py-3.5 bg-charcoal-900 hover:bg-terracotta-600 text-white rounded-full font-medium text-sm transition-colors shadow-soft"
            >
              Volver a la Tienda
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            
            {/* Order Items & Taxes Breakdown */}
            <div className="p-4 bg-surface rounded-2xl border border-warmgray-200/80 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-serif text-sm font-bold text-charcoal-900">Resumen del Pedido</h4>
                {isTaxExempt && (
                  <span className="px-2.5 py-0.5 rounded bg-forest-700/10 text-forest-700 text-[10px] font-mono font-bold">
                    ✓ Perfil Exonerado de ITBMS (7%)
                  </span>
                )}
              </div>

              <div className="space-y-1.5 text-xs font-mono text-warmgray-700">
                {cart.map((item) => {
                  const itemPrice = isB2B ? item.product.b2bPrice : item.product.price;
                  return (
                    <div key={item.product.id} className="flex justify-between">
                      <span>{item.quantity}x {item.product.name} {item.product.isItbmsExempt && '(Exento)'}</span>
                      <span>${(itemPrice * item.quantity).toFixed(2)}</span>
                    </div>
                  );
                })}

                <div className="border-t border-warmgray-200 pt-2 space-y-1">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Impuesto ITBMS (7%)</span>
                    <span>${itbmsTax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Flete Logístico Panamá ({shippingProvince})</span>
                    <span>${shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-charcoal-900 text-sm pt-2 border-t border-warmgray-200">
                    <span>Total Final</span>
                    <span className="text-terracotta-600">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Panama Shipping Matrix Controls */}
            <div className="space-y-4">
              <h4 className="font-serif text-base font-bold text-charcoal-900 flex items-center gap-2">
                <Truck className="w-4 h-4 text-terracotta-600" />
                Matriz Logística de Envíos en Panamá
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <label className="block text-warmgray-700 mb-1">Provincia / Destino</label>
                  <select
                    value={shippingProvince}
                    onChange={(e) => setShippingProvince(e.target.value as PanamaProvince)}
                    className="w-full px-3.5 py-2.5 bg-surface border border-warmgray-200 rounded-xl text-charcoal-900 focus:outline-none"
                  >
                    {provinces.map((prov) => (
                      <option key={prov} value={prov}>{prov}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-warmgray-700 mb-1">Asignación de Flota</label>
                  <select
                    value={shippingVehicle}
                    onChange={(e) => setShippingVehicle(e.target.value as FleetVehicle)}
                    className="w-full px-3.5 py-2.5 bg-surface border border-warmgray-200 rounded-xl text-charcoal-900 focus:outline-none"
                  >
                    <option value="moto">Motocicleta (Carga Ligera)</option>
                    <option value="sedan">Sedán (Caja Chica)</option>
                    <option value="panel">Panel Comercial (Hasta 1T)</option>
                    <option value="camion_5t">Camión de Carga (5 Toneladas)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-4 pt-2">
              <h4 className="font-serif text-base font-bold text-charcoal-900">Método de Pago</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('contado')}
                  className={`p-3.5 rounded-xl border text-left flex flex-col justify-between ${
                    paymentMethod === 'contado'
                      ? 'border-charcoal-900 bg-surface shadow-sm font-bold'
                      : 'border-warmgray-200 bg-canvas'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-terracotta-600 mb-2" />
                  <span>Pago Contado / Tarjeta</span>
                </button>

                {isB2B && (
                  <>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('credito_b2b')}
                      className={`p-3.5 rounded-xl border text-left flex flex-col justify-between ${
                        paymentMethod === 'credito_b2b'
                          ? 'border-forest-700 bg-surface shadow-sm font-bold'
                          : 'border-warmgray-200 bg-canvas'
                      }`}
                    >
                      <Building2 className="w-4 h-4 text-forest-700 mb-2" />
                      <span>Línea de Crédito ({currentUser.creditDays} días)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cheque_posfechado')}
                      className={`p-3.5 rounded-xl border text-left flex flex-col justify-between ${
                        paymentMethod === 'cheque_posfechado'
                          ? 'border-amber-600 bg-surface shadow-sm font-bold'
                          : 'border-warmgray-200 bg-canvas'
                      }`}
                    >
                      <Calendar className="w-4 h-4 text-amber-600 mb-2" />
                      <span>Cheque Posfechado</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-warmgray-200 flex items-center justify-between">
              <button
                type="button"
                onClick={closeCheckout}
                className="text-xs font-medium text-warmgray-700 hover:text-charcoal-900 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Volver al Carrito
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3.5 bg-charcoal-900 hover:bg-terracotta-600 text-white rounded-2xl font-medium text-sm transition-all shadow-lifted flex items-center gap-2"
              >
                {loading ? (
                  <span>Procesando...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Confirmar Pedido — ${total.toFixed(2)}</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>

    </div>
  );
};
