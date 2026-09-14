import React from 'react';
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useNavigationStore } from '../../store/useNavigationStore';

export const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeFromCart } = useCartStore();
  const { navigateTo } = useNavigationStore();

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const freeShippingThreshold = 300;
  const progressPercent = Math.min((subtotal / freeShippingThreshold) * 100, 100);
  const amountLeftForFreeShipping = Math.max(freeShippingThreshold - subtotal, 0);

  return (
    <section className="pt-28 pb-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
      
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateTo('home')}
          className="px-4 py-2 bg-surface border border-warmgray-200 rounded-full text-xs font-mono font-medium text-charcoal-900 hover:bg-warmgray-100 transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4 text-terracotta-600" />
          <span>Seguir Comprando</span>
        </button>

        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900">
          Tu Carrito de Compras ({cart.reduce((acc, item) => acc + item.quantity, 0)})
        </h1>
      </div>

      {/* Free Shipping Progress Indicator */}
      <div className="p-6 rounded-3xl bg-surface border border-warmgray-200 shadow-soft space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-charcoal-900">
          <span className="flex items-center gap-2 font-bold">
            <Truck className="w-4 h-4 text-terracotta-600" />
            {amountLeftForFreeShipping === 0
              ? '¡Felicidades! Tienes Envío Gratis en Panamá 🎉'
              : `Faltan $${amountLeftForFreeShipping.toFixed(2)} para Envío Gratis`}
          </span>
          <span className="font-bold">{Math.round(progressPercent)}%</span>
        </div>
        <div className="w-full bg-warmgray-200 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-terracotta-600 h-full transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Cart Items List */}
      {cart.length === 0 ? (
        <div className="py-20 text-center bg-surface rounded-3xl border border-warmgray-200 p-8 space-y-4">
          <ShoppingBag className="w-16 h-16 stroke-1 text-warmgray-400 mx-auto" />
          <h2 className="font-serif text-xl font-bold text-charcoal-900">Tu carrito está vacío</h2>
          <p className="text-xs text-warmgray-500 max-w-sm mx-auto font-mono">
            Explora nuestro catálogo y descubre productos de diseño excepcional.
          </p>
          <button
            onClick={() => navigateTo('home')}
            className="px-8 py-3.5 bg-charcoal-900 text-white text-xs font-mono font-medium rounded-full hover:bg-terracotta-600 transition-colors shadow-soft"
          >
            Ir al Catálogo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Items List Column */}
          <div className="lg:col-span-8 space-y-4">
            {cart.map((item) => (
              <div
                key={item.product.id}
                className="p-6 rounded-3xl bg-surface border border-warmgray-200/80 shadow-soft flex flex-col sm:flex-row items-center gap-6"
              >
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-24 h-24 object-cover rounded-2xl bg-warmgray-100 flex-shrink-0"
                />

                <div className="flex-1 space-y-2 w-full text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h3 className="font-serif text-base font-bold text-charcoal-900">
                      {item.product.name}
                    </h3>
                    <span className="font-mono text-base font-bold text-charcoal-900">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  {item.selectedColor && (
                    <p className="text-xs text-warmgray-500 font-mono">
                      Color: {item.selectedColor}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center border border-warmgray-200 rounded-full bg-canvas">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-2 text-charcoal-900 hover:text-terracotta-600 transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-4 text-xs font-mono font-bold text-charcoal-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-2 text-charcoal-900 hover:text-terracotta-600 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-warmgray-400 hover:text-red-600 transition-colors p-2 flex items-center gap-1 text-xs font-mono"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Eliminar</span>
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Sidebar Column */}
          <div className="lg:col-span-4 p-6 rounded-3xl bg-surface border border-warmgray-200 shadow-soft space-y-6 self-start">
            <h3 className="font-serif text-lg font-bold text-charcoal-900">Resumen del Pedido</h3>

            <div className="space-y-3 text-xs font-mono border-t border-b border-warmgray-200 py-4">
              <div className="flex justify-between text-warmgray-700">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-warmgray-700">
                <span>Envío estimado Panamá</span>
                <span>{amountLeftForFreeShipping === 0 ? 'GRATIS' : '$15.00'}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-charcoal-900 pt-2 border-t border-warmgray-100">
                <span>Total Estimado</span>
                <span className="text-terracotta-600">
                  ${(subtotal + (amountLeftForFreeShipping === 0 ? 0 : 15)).toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigateTo('checkout')}
              className="w-full py-4 bg-charcoal-900 hover:bg-terracotta-600 text-white rounded-2xl font-medium text-xs font-mono transition-all duration-300 shadow-lifted flex items-center justify-center gap-2 group"
            >
              <span>Proceder al Checkout</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>
      )}

    </section>
  );
};
