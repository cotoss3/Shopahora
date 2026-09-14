import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, CreditCard, ShieldCheck, Lock, Truck, Building2, Calendar } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useInventoryStore } from '../../store/useInventoryStore';
import { useNavigationStore } from '../../store/useNavigationStore';
import { PanamaProvince, FleetVehicle } from '../../types/product';

export const CheckoutPage: React.FC = () => {
  const { cart, clearCart } = useCartStore();
  const { currentUser } = useAuthStore();
  const { calculatePanamaShipping } = useInventoryStore();
  const { navigateTo } = useNavigationStore();

  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [shippingProvince, setShippingProvince] = useState<PanamaProvince>('Panamá Centro');
  const [shippingVehicle, setShippingVehicle] = useState<FleetVehicle>('panel');
  const [paymentMethod, setPaymentMethod] = useState<'contado' | 'credito_b2b' | 'cheque_posfechado'>('contado');

  const isB2B = currentUser.role === 'cliente_b2b';
  const isTaxExempt = currentUser.isTaxExempt;

  const subtotal = cart.reduce((sum, item) => {
    const itemPrice = isB2B ? item.product.b2bPrice : item.product.price;
    return sum + itemPrice * item.quantity;
  }, 0);

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
    <section className="pt-28 pb-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
      
      {/* Back Button */}
      <button
        onClick={() => navigateTo('cart')}
        className="px-4 py-2 bg-surface border border-warmgray-200 rounded-full text-xs font-mono font-medium text-charcoal-900 hover:bg-warmgray-100 transition-colors flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4 text-terracotta-600" />
        <span>Volver al Carrito</span>
      </button>

      {/* Main Full Page Card */}
      <div className="bg-surface rounded-3xl border border-warmgray-200 shadow-soft overflow-hidden p-6 sm:p-10">
        
        {isSuccess ? (
          <div className="py-12 text-center space-y-6">
            <div className="w-20 h-20 bg-forest-700/10 text-forest-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            
            <div className="space-y-2">
              <h2 className="font-serif text-3xl font-bold text-charcoal-900">
                ¡Pedido #{Math.floor(100000 + Math.random() * 900000)} Registrado Exitosamente!
              </h2>
              <p className="text-sm text-warmgray-700 max-w-md mx-auto font-light">
                {isB2B
                  ? `Facturado a cuenta de crédito de ${currentUser.companyName} con vencimiento a ${currentUser.creditDays} días.`
                  : 'Hemos recibido tu orden y asignado la flota de transporte para el envío en Panamá.'}
              </p>
              <p className="font-mono text-xs text-terracotta-600 font-semibold pt-2">
                Provincia de Entrega: {shippingProvince}
              </p>
            </div>

            <button
              onClick={() => {
                setIsSuccess(false);
                navigateTo('home');
              }}
              className="px-8 py-3.5 bg-charcoal-900 hover:bg-terracotta-600 text-white rounded-full font-medium text-xs font-mono transition-colors shadow-soft"
            >
              Volver a la Tienda
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900">
                Checkout de Pago & Logística ({isB2B ? 'Canal B2B Mayorista' : 'Retail B2C'})
              </h1>
              <p className="text-xs text-warmgray-500 font-mono mt-1">
                Completar datos de entrega y método de pago
              </p>
            </div>

            {/* Order Items & Taxes Breakdown */}
            <div className="p-6 bg-canvas rounded-2xl border border-warmgray-200/80 space-y-4 font-mono text-xs">
              <div className="flex justify-between items-center">
                <h3 className="font-serif text-base font-bold text-charcoal-900 font-sans">Resumen de la Orden</h3>
                {isTaxExempt && (
                  <span className="px-2.5 py-0.5 rounded bg-forest-700/10 text-forest-700 text-[10px] font-bold">
                    ✓ Perfil Exonerado de ITBMS (7%)
                  </span>
                )}
              </div>

              <div className="space-y-2 text-warmgray-700">
                {cart.map((item) => {
                  const itemPrice = isB2B ? item.product.b2bPrice : item.product.price;
                  return (
                    <div key={item.product.id} className="flex justify-between">
                      <span>{item.quantity}x {item.product.name} {item.product.isItbmsExempt && '(Exento)'}</span>
                      <span className="font-bold">${(itemPrice * item.quantity).toFixed(2)}</span>
                    </div>
                  );
                })}

                <div className="border-t border-warmgray-200 pt-3 space-y-1.5">
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
              <h3 className="font-serif text-lg font-bold text-charcoal-900 flex items-center gap-2">
                <Truck className="w-5 h-5 text-terracotta-600" />
                Matriz Logística de Envíos en Panamá
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <label className="block text-warmgray-700 font-bold mb-1">Provincia / Destino</label>
                  <select
                    value={shippingProvince}
                    onChange={(e) => setShippingProvince(e.target.value as PanamaProvince)}
                    className="w-full px-3.5 py-2.5 bg-canvas border border-warmgray-200 rounded-xl text-charcoal-900 focus:outline-none"
                  >
                    {provinces.map((prov) => (
                      <option key={prov} value={prov}>{prov}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-warmgray-700 font-bold mb-1">Asignación de Flota</label>
                  <select
                    value={shippingVehicle}
                    onChange={(e) => setShippingVehicle(e.target.value as FleetVehicle)}
                    className="w-full px-3.5 py-2.5 bg-canvas border border-warmgray-200 rounded-xl text-charcoal-900 focus:outline-none"
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
              <h3 className="font-serif text-lg font-bold text-charcoal-900">Método de Pago</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('contado')}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between ${
                    paymentMethod === 'contado'
                      ? 'border-charcoal-900 bg-canvas shadow-sm font-bold'
                      : 'border-warmgray-200 bg-surface'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-terracotta-600 mb-2" />
                  <span>Pago Contado / Tarjeta</span>
                </button>

                {isB2B && (
                  <>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('credito_b2b')}
                      className={`p-4 rounded-2xl border text-left flex flex-col justify-between ${
                        paymentMethod === 'credito_b2b'
                          ? 'border-forest-700 bg-canvas shadow-sm font-bold'
                          : 'border-warmgray-200 bg-surface'
                      }`}
                    >
                      <Building2 className="w-5 h-5 text-forest-700 mb-2" />
                      <span>Línea de Crédito ({currentUser.creditDays} días)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cheque_posfechado')}
                      className={`p-4 rounded-2xl border text-left flex flex-col justify-between ${
                        paymentMethod === 'cheque_posfechado'
                          ? 'border-amber-600 bg-canvas shadow-sm font-bold'
                          : 'border-warmgray-200 bg-surface'
                      }`}
                    >
                      <Calendar className="w-5 h-5 text-amber-600 mb-2" />
                      <span>Cheque Posfechado</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-4 border-t border-warmgray-200 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-10 py-4 bg-charcoal-900 hover:bg-terracotta-600 text-white rounded-2xl font-medium text-xs font-mono transition-all shadow-lifted flex items-center gap-2"
              >
                {loading ? (
                  <span>Procesando...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    <span>Confirmar y Finalizar Orden — ${total.toFixed(2)}</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>

    </section>
  );
};
