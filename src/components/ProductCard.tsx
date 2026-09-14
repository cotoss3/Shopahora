import React from 'react';
import { Star, Plus, Eye } from 'lucide-react';
import { Product } from '../types/product';
import { useCartStore } from '../store/useCartStore';
import { useNavigationStore } from '../store/useNavigationStore';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCartStore();
  const { openProductDetail, openCategoryPage } = useNavigationStore();

  return (
    <div className="group relative bg-surface rounded-2xl overflow-hidden border border-warmgray-200/70 hover:border-warmgray-500/30 shadow-soft hover:shadow-lifted transition-all duration-300 flex flex-col h-full">
      
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-warmgray-100 cursor-pointer" onClick={() => openProductDetail(product)}>
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badge */}
        {product.badge && (
          <span className="absolute top-3 left-3 px-3 py-1 bg-charcoal-900/80 backdrop-blur-md text-white text-[11px] font-mono tracking-wider uppercase rounded-full">
            {product.badge}
          </span>
        )}

        {/* Quick View Button Overlay */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            openProductDetail(product);
          }}
          className="absolute top-3 right-3 p-2 bg-surface/80 backdrop-blur-md text-charcoal-900 hover:text-terracotta-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:scale-110 duration-200"
          title="Ver Producto"
        >
          <Eye className="w-4 h-4" />
        </button>

        {/* Quick Add Button Overlay */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product);
          }}
          className="absolute bottom-3 right-3 px-3.5 py-2 bg-terracotta-600 hover:bg-charcoal-900 text-white rounded-full text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar</span>
        </button>
      </div>

      {/* Product Content Details */}
      <div className="p-5 flex flex-col flex-grow justify-between space-y-3">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <button
              onClick={(e) => {
                e.stopPropagation();
                openCategoryPage(product.category);
              }}
              className="uppercase tracking-wider font-mono text-warmgray-500 hover:text-terracotta-600 font-semibold transition-colors"
            >
              {product.category}
            </button>
            <div className="flex items-center gap-1 text-amber-500 font-mono text-xs font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{product.rating}</span>
              <span className="text-warmgray-500 font-normal">({product.reviewsCount})</span>
            </div>
          </div>

          <h3
            onClick={() => openProductDetail(product)}
            className="font-serif text-lg font-bold text-charcoal-900 group-hover:text-terracotta-600 transition-colors cursor-pointer line-clamp-1"
          >
            {product.name}
          </h3>

          <p className="text-xs text-warmgray-700 line-clamp-1 font-light">
            {product.subtitle}
          </p>
        </div>

        {/* Color Indicators & Price */}
        <div className="pt-2 border-t border-warmgray-100 flex items-center justify-between">
          
          {/* Colors */}
          <div className="flex items-center gap-1.5">
            {product.colors?.map((color, idx) => (
              <span
                key={idx}
                className="w-3 h-3 rounded-full border border-warmgray-200 shadow-inner"
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>

          {/* Price Tag */}
          <div className="flex items-baseline gap-2">
            {product.originalPrice && (
              <span className="text-xs text-warmgray-500 line-through font-mono">
                ${product.originalPrice}
              </span>
            )}
            <span className="font-mono text-base font-bold text-charcoal-900">
              ${product.price}
            </span>
          </div>

        </div>

      </div>

    </div>
  );
};
