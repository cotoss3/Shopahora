import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

export const CartDrawer: React.FC = () => {
  const { cart, isCartOpen, closeCart, updateQuantity, removeFromCart, openCheckout } = useCartStore();

  if (!isCartOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const freeShippingThreshold = 300;
  const progressPercent = Math.min((subtotal / freeShippingThreshold) * 100, 100);
  const amountLeftForFreeShipping = Math.max(freeShippingThreshold - subtotal, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      
      {/* Dark Overlay Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-charcoal-900/50 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        
        {/* Drawer Content */}
        <div className="w-screen max-w-md bg-canvas shadow-drawer border-l border-warmgray-200 flex flex-col justify-between transform transition-transform duration-300 ease-in-out">
          
          {/* Header */}
          <div className="p-6 border-b border-warmgray-200/80 bg-surface flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-terracotta-600" />
              <h2 className="font-serif text-xl font-bold text-charcoal-900">
                Tu Carrito ({cart.reduce((acc, item) => acc + item.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-2 text-warmgray-500 hover:text-charcoal-900 hover:bg-warmgray-100 rounded-full transition-colors"
              aria-label="Cerrar carrito"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-6 py-3.5 bg-warmgray-100/80 border-b border-warmgray-200 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono text-charcoal-900">
              <span className="flex items-center gap-1.5 font-medium">
                <Truck className="w-4 h-4 text-terracotta-600" />
                {amountLeftForFreeShipping === 0
                  ? '¡Felicidades! Tienes Envío Gratis 🎉'
                  : `Faltan $${amountLeftForFreeShipping.toFixed(2)} para Envío Gratis`}
              </span>
              <span className="font-bold">{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full bg-warmgray-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-terracotta-600 h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-warmgray-500 py-12">
                <ShoppingBag className="w-16 h-16 stroke-1 text-warmgray-400 mb-4" />
                <p className="font-serif text-lg font-semibold text-charcoal-900">Tu carrito está vacío</p>
                <p className="text-xs text-warmgray-500 max-w-xs mt-1">
                  Explora nuestro catálogo y descubre productos de diseño excepcional.
                </p>
                <button
                  onClick={closeCart}
                  className="mt-6 px-6 py-2.5 bg-charcoal-900 text-white text-xs font-medium rounded-full hover:bg-terracotta-600 transition-colors shadow-sm"
                >
                  Empezar a Comprar
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 p-4 bg-surface rounded-2xl border border-warmgray-200/80 shadow-soft"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-xl bg-warmgray-100 flex-shrink-0"
                  />

                  {/* Item Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <h4 className="font-serif text-sm font-bold text-charcoal-900 line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-warmgray-400 hover:text-red-600 transition-colors p-1"
                          title="Eliminar producto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {item.selectedColor && (
                        <p className="text-[11px] text-warmgray-500 font-mono">
                          Color: {item.selectedColor}
                        </p>
                      )}
                    </div>

                    {/* Quantity Selector & Item Subtotal */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-warmgray-200 rounded-full bg-canvas">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1.5 text-charcoal-900 hover:text-terracotta-600 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-mono font-bold text-charcoal-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1.5 text-charcoal-900 hover:text-terracotta-600 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="font-mono text-sm font-bold text-charcoal-900">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>

                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-warmgray-200 bg-surface space-y-4">
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between text-warmgray-700">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-warmgray-700">
                  <span>Envío estimado</span>
                  <span>{amountLeftForFreeShipping === 0 ? 'GRATIS' : '$15.00'}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-charcoal-900 pt-2 border-t border-warmgray-200">
                  <span>Total final</span>
                  <span className="text-terracotta-600">
                    ${(subtotal + (amountLeftForFreeShipping === 0 ? 0 : 15)).toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={openCheckout}
                className="w-full py-4 bg-charcoal-900 hover:bg-terracotta-600 text-white rounded-2xl font-medium text-sm transition-all duration-300 shadow-lifted flex items-center justify-center gap-2 group"
              >
                <span>Proceder al Pago</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
