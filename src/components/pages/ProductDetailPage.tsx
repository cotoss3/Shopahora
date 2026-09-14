import React, { useState } from 'react';
import { ArrowLeft, Star, ShieldCheck, Truck, Check, ShoppingBag, Package, FileText, Plus, Minus, Tag } from 'lucide-react';
import { useNavigationStore } from '../../store/useNavigationStore';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';

export const ProductDetailPage: React.FC = () => {
  const { selectedProduct, navigateTo, openCategoryPage } = useNavigationStore();
  const { addToCart } = useCartStore();
  const { currentUser } = useAuthStore();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  if (!selectedProduct) {
    navigateTo('home');
    return null;
  }

  const activeColor = selectedColor || selectedProduct.colors?.[0]?.name || '';
  const isB2B = currentUser.role === 'cliente_b2b' || currentUser.role === 'vendedor_b2b';
  const effectivePrice = isB2B ? selectedProduct.b2bPrice : selectedProduct.price;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(selectedProduct, activeColor);
    }
  };

  return (
    <section className="pt-28 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
      
      {/* Breadcrumb & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs text-warmgray-500 border-b border-warmgray-200/80 pb-4">
        <div className="flex items-center gap-2">
          <button onClick={() => navigateTo('home')} className="hover:text-terracotta-600 transition-colors">
            Inicio
          </button>
          <span>/</span>
          <button onClick={() => openCategoryPage(selectedProduct.category)} className="hover:text-terracotta-600 transition-colors uppercase font-semibold">
            {selectedProduct.category}
          </button>
          <span>/</span>
          <span className="text-charcoal-900 font-bold truncate max-w-[200px] sm:max-w-none">{selectedProduct.name}</span>
        </div>

        <button
          onClick={() => navigateTo('home')}
          className="px-4 py-2 bg-surface border border-warmgray-200 rounded-full text-xs font-mono font-medium text-charcoal-900 hover:bg-warmgray-100 transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <ArrowLeft className="w-4 h-4 text-terracotta-600" />
          <span>Volver al Catálogo</span>
        </button>
      </div>

      {/* Main Full-Page Showcase Card */}
      <div className="bg-surface rounded-3xl border border-warmgray-200 shadow-soft overflow-hidden p-6 sm:p-10 flex flex-col md:flex-row gap-10">
        
        {/* Gallery Column */}
        <div className="md:w-1/2 flex flex-col justify-between space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-warmgray-100 border border-warmgray-200/60 shadow-inner group">
            <img
              src={selectedProduct.images[selectedImageIndex] || selectedProduct.images[0]}
              alt={selectedProduct.name}
              className="w-full h-full object-cover object-center transition-all duration-300 group-hover:scale-105"
            />
            {selectedProduct.badge && (
              <span className="absolute top-4 left-4 px-3 py-1 bg-charcoal-900/90 backdrop-blur-md text-white text-xs font-mono tracking-wider uppercase rounded-full">
                {selectedProduct.badge}
              </span>
            )}
          </div>

          {selectedProduct.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
              {selectedProduct.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    selectedImageIndex === idx
                      ? 'border-terracotta-600 ring-2 ring-terracotta-600/20 scale-105'
                      : 'border-warmgray-200 hover:border-warmgray-400'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info Column */}
        <div className="md:w-1/2 flex flex-col justify-between space-y-6">
          
          <div className="space-y-4">
            
            {/* Category & ITBMS Tag */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <button 
                onClick={() => openCategoryPage(selectedProduct.category)}
                className="text-xs font-mono uppercase tracking-widest text-warmgray-500 hover:text-terracotta-600 font-bold transition-colors"
              >
                Categoría: {selectedProduct.category}
              </button>

              <div className="flex items-center gap-2">
                {selectedProduct.isItbmsExempt ? (
                  <span className="px-3 py-1 bg-forest-700/10 text-forest-700 text-xs font-mono font-semibold rounded-full flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" /> Exento ITBMS (0%)
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-amber-500/10 text-amber-700 text-xs font-mono font-semibold rounded-full flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" /> ITBMS Panamá (7%)
                  </span>
                )}
              </div>
            </div>

            {/* Title & Subtitle */}
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900">
                {selectedProduct.name}
              </h1>
              <p className="text-base text-warmgray-700 font-light mt-1">
                {selectedProduct.subtitle}
              </p>
            </div>

            {/* Ratings & Price Box */}
            <div className="p-4 rounded-2xl bg-canvas border border-warmgray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 font-mono text-sm font-semibold text-amber-600">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>{selectedProduct.rating}</span>
                <span className="text-warmgray-500 font-normal">({selectedProduct.reviewsCount} evaluaciones)</span>
              </div>

              <div className="flex items-baseline gap-3">
                {isB2B ? (
                  <div className="text-right">
                    <span className="text-xs text-warmgray-500 line-through font-mono block">
                      ${selectedProduct.price} (Precio Retail)
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-3xl font-bold text-forest-700">
                        ${selectedProduct.b2bPrice}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-forest-700 text-white font-mono text-[10px] font-bold">
                        B2B (-{selectedProduct.b2bDiscountPercent}%)
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-baseline gap-2">
                    {selectedProduct.originalPrice && (
                      <span className="text-sm text-warmgray-500 line-through font-mono">
                        ${selectedProduct.originalPrice}
                      </span>
                    )}
                    <span className="font-mono text-3xl font-bold text-charcoal-900">
                      ${selectedProduct.price}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-warmgray-700 leading-relaxed font-sans">
              {selectedProduct.description}
            </p>

            {/* Stock Availability Indicator */}
            <div className="p-3.5 rounded-2xl bg-surface border border-warmgray-200/80 flex items-center justify-between text-xs font-mono">
              <span className="flex items-center gap-2 text-warmgray-700 font-semibold">
                <Package className="w-4 h-4 text-terracotta-600" /> Inventario en Bodega Panamá:
              </span>
              {selectedProduct.stockPhysical > 0 ? (
                <span className="font-bold text-forest-700">
                  ✓ {selectedProduct.stockPhysical} unidades disponibles
                </span>
              ) : selectedProduct.allowDropshipping ? (
                <span className="font-bold text-amber-600">
                  Sin stock en bodega (Dropshipping Habilitado)
                </span>
              ) : (
                <span className="font-bold text-red-600">
                  Agotado
                </span>
              )}
            </div>

            {/* Color Swatches */}
            {selectedProduct.colors && selectedProduct.colors.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-warmgray-700 font-semibold">
                  Color Seleccionado: <span className="text-charcoal-900 font-bold">{activeColor}</span>
                </label>
                <div className="flex items-center gap-3">
                  {selectedProduct.colors.map((color, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-9 h-9 rounded-full border-2 transition-all flex items-center justify-center ${
                        activeColor === color.name
                          ? 'border-charcoal-900 scale-110 shadow-sm ring-2 ring-charcoal-900/10'
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

            {/* Full Technical Specifications Grid */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-mono uppercase text-warmgray-700 font-semibold block">
                Especificaciones Técnicas & Características Completa
              </span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-warmgray-700 font-mono">
                {selectedProduct.features.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2 p-3 rounded-xl bg-canvas border border-warmgray-200">
                    <span className="w-2 h-2 rounded-full bg-terracotta-600 flex-shrink-0" />
                    <span className="font-medium text-charcoal-900">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Action Bar & Quantity Controls */}
          <div className="pt-6 border-t border-warmgray-200 space-y-4">
            
            <div className="flex items-center gap-4">
              {/* Quantity Selector */}
              <div className="flex items-center border border-warmgray-200 rounded-2xl bg-canvas p-1 text-xs font-mono">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-warmgray-200 rounded-xl transition-colors text-charcoal-900"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 font-bold text-sm text-charcoal-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-warmgray-200 rounded-xl transition-colors text-charcoal-900"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="flex-grow py-4 bg-charcoal-900 hover:bg-terracotta-600 text-white rounded-2xl font-medium text-sm font-mono transition-all shadow-lifted flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Agregar al Carrito — ${(effectivePrice * quantity).toFixed(2)}</span>
              </button>
            </div>

            <div className="flex flex-wrap justify-around gap-2 text-xs text-warmgray-500 font-mono pt-2 border-t border-warmgray-100">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-terracotta-600" /> Logística Integrada Panamá (Provincias & Flota)
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-forest-700" /> Garantía de Calidad Certificada
              </span>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
};

