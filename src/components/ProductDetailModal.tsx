import React, { useState } from 'react';
import { X, Star, ShieldCheck, Truck, Check, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

export const ProductDetailModal: React.FC = () => {
  const { selectedProduct, setSelectedProduct, addToCart } = useCartStore();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>('');

  if (!selectedProduct) return null;

  const activeColor = selectedColor || selectedProduct.colors?.[0]?.name || '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-charcoal-900/60 backdrop-blur-sm animate-fadeIn">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-canvas rounded-3xl shadow-lifted border border-warmgray-200 overflow-hidden max-h-[90vh] flex flex-col md:flex-row">
        
        {/* Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-surface/80 hover:bg-surface text-charcoal-900 shadow-sm border border-warmgray-200 transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gallery Section */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between bg-surface border-b md:border-b-0 md:border-r border-warmgray-200/80">
          
          {/* Main Image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-warmgray-100 mb-4">
            <img
              src={selectedProduct.images[selectedImageIndex] || selectedProduct.images[0]}
              alt={selectedProduct.name}
              className="w-full h-full object-cover object-center transition-all duration-300"
            />
          </div>

          {/* Thumbnails */}
          {selectedProduct.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {selectedProduct.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    selectedImageIndex === idx
                      ? 'border-terracotta-600 ring-2 ring-terracotta-600/20'
                      : 'border-warmgray-200 hover:border-warmgray-400'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

        </div>

        {/* Product Info Section */}
        <div className="md:w-1/2 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between space-y-6">
          
          <div className="space-y-4">
            {/* Category & Badge */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-widest text-warmgray-500">
                {selectedProduct.category}
              </span>
              {selectedProduct.badge && (
                <span className="px-3 py-1 bg-terracotta-600/10 text-terracotta-700 text-xs font-mono font-semibold rounded-full">
                  {selectedProduct.badge}
                </span>
              )}
            </div>

            {/* Title & Subtitle */}
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900">
                {selectedProduct.name}
              </h2>
              <p className="text-sm text-warmgray-700 font-light mt-1">
                {selectedProduct.subtitle}
              </p>
            </div>

            {/* Rating & Price */}
            <div className="flex items-center justify-between py-3 border-y border-warmgray-200">
              <div className="flex items-center gap-1.5 font-mono text-sm font-semibold text-amber-600">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>{selectedProduct.rating}</span>
                <span className="text-warmgray-500 font-normal">({selectedProduct.reviewsCount} reseñas)</span>
              </div>
              <div className="flex items-baseline gap-2">
                {selectedProduct.originalPrice && (
                  <span className="text-sm text-warmgray-500 line-through font-mono">
                    ${selectedProduct.originalPrice}
                  </span>
                )}
                <span className="font-mono text-2xl font-bold text-charcoal-900">
                  ${selectedProduct.price}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-warmgray-700 leading-relaxed">
              {selectedProduct.description}
            </p>

            {/* Colors Selector */}
            {selectedProduct.colors && selectedProduct.colors.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-warmgray-700 font-semibold">
                  Color Seleccionado: <span className="text-charcoal-900">{activeColor}</span>
                </label>
                <div className="flex items-center gap-3">
                  {selectedProduct.colors.map((color, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${
                        activeColor === color.name
                          ? 'border-charcoal-900 scale-110 shadow-sm'
                          : 'border-warmgray-200 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      {activeColor === color.name && (
                        <Check className="w-4 h-4 text-white drop-shadow-sm" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Key Features List */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-mono uppercase text-warmgray-700 font-semibold">
                Características Destacadas
              </span>
              <ul className="space-y-1.5 text-xs text-warmgray-700">
                {selectedProduct.features.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-terracotta-600" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-warmgray-200 space-y-3">
            <button
              onClick={() => {
                addToCart(selectedProduct, activeColor);
                setSelectedProduct(null);
              }}
              className="w-full py-4 bg-charcoal-900 hover:bg-terracotta-600 text-white rounded-2xl font-medium text-sm transition-all duration-300 shadow-soft hover:shadow-lifted flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Agregar al Carrito — ${selectedProduct.price}</span>
            </button>

            <div className="flex justify-around text-[11px] text-warmgray-500 font-mono pt-1">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-terracotta-600" /> Envío rápido a todo el país
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-forest-700" /> Garantía de devolución 30 días
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
