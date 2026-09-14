import React from 'react';
import { ArrowRight, ShieldCheck, Truck, Star } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useInventoryStore } from '../store/useInventoryStore';
import { PRODUCTS } from '../data/products';

export const Hero: React.FC = () => {
  const { addToCart } = useCartStore();
  const { products } = useInventoryStore();
  const featuredProduct = products.length > 0 ? products[0] : PRODUCTS[0];

  if (!featuredProduct) return null;

  return (
    <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden">
      {/* Decorative Warm Ambient Glows */}
      <div className="absolute top-10 right-0 w-[500px] h-[500px] bg-terracotta-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-forest-700/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Main Content Column */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Editorial Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-warmgray-100 border border-warmgray-200 text-charcoal-900 text-xs font-mono tracking-wide">
              <span className="w-2 h-2 rounded-full bg-terracotta-600 animate-ping" />
              <span>Novedad Temporada 2026</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-charcoal-900 leading-[1.1]">
                Diseño Intencional para tu <span className="italic font-normal text-terracotta-600">Estilo de Vida</span>.
              </h1>
              <p className="text-lg sm:text-xl text-warmgray-700 max-w-2xl font-light leading-relaxed">
                Productos esenciales creados con materiales nobles, estética minimalista y rendimiento acústico & tecnológico sin concesiones.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#catalogo"
                className="px-7 py-3.5 bg-charcoal-900 hover:bg-terracotta-600 text-white rounded-full font-medium text-sm transition-all duration-300 shadow-lifted hover:shadow-xl flex items-center gap-2 group"
              >
                <span>Explorar Colección</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <button
                onClick={() => addToCart(featuredProduct)}
                className="px-6 py-3.5 bg-surface hover:bg-warmgray-100 text-charcoal-900 border border-warmgray-200 rounded-full font-medium text-sm transition-all shadow-sm flex items-center gap-2"
              >
                <span>Comprar Producto Estrella (${featuredProduct.price})</span>
              </button>
            </div>

            {/* Value Proposition Pills */}
            <div className="pt-6 border-t border-warmgray-200/80 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-medium text-warmgray-700">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-full bg-warmgray-100 text-terracotta-600">
                  <Truck className="w-4 h-4" />
                </div>
                <span>Envío Express 24h</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-full bg-warmgray-100 text-forest-700">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span>Garantía de 2 Años</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-full bg-warmgray-100 text-amber-600">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                </div>
                <span>4.9 / 5 (1,200+ Reseñas)</span>
              </div>
            </div>

          </div>

          {/* Hero Visual Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Product Card Showcase Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-lifted bg-surface border border-warmgray-200/60 aspect-[4/5] group">
                <img
                  src={featuredProduct.images[0]}
                  alt={featuredProduct.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Image Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 via-transparent to-transparent opacity-80" />

                {/* Floating Bottom Card Details */}
                <div className="absolute bottom-6 left-6 right-6 text-white p-5 rounded-2xl bg-charcoal-900/60 backdrop-blur-md border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-widest text-terracotta-500">
                      {featuredProduct.badge}
                    </span>
                    <span className="font-mono text-sm font-semibold">${featuredProduct.price}</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold">{featuredProduct.name}</h3>
                  <p className="text-xs text-warmgray-200 line-clamp-1">{featuredProduct.subtitle}</p>
                </div>
              </div>

              {/* Decorative Secondary Badge */}
              <div className="absolute -top-4 -left-4 bg-surface p-4 rounded-2xl shadow-lifted border border-warmgray-200 hidden sm:flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-forest-700/10 text-forest-700 flex items-center justify-center font-bold">
                  98%
                </div>
                <div className="text-xs">
                  <p className="font-bold text-charcoal-900">Satisfacción</p>
                  <p className="text-warmgray-500">Clientes verificados</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
