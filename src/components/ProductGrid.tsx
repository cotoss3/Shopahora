import React, { useState, useMemo } from 'react';
import { ProductCard } from './ProductCard';
import { PRODUCTS } from '../data/products';
import { SlidersHorizontal, PackageSearch } from 'lucide-react';
import { useNavigationStore } from '../store/useNavigationStore';

interface ProductGridProps {
  searchQuery: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ searchQuery }) => {
  const { openCategoryPage } = useNavigationStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [sortBy, setSortBy] = useState<'recommended' | 'price-low' | 'price-high' | 'rating'>('recommended');

  const categories = [
    { id: 'todos', label: 'Todos los Productos' },
    { id: 'audio', label: 'Audio & Sonido' },
    { id: 'hogar', label: 'Hogar & Ambiente' },
    { id: 'tecnologia', label: 'Tecnología' },
    { id: 'accesorios', label: 'Accesorios' },
  ];

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesCategory = selectedCategory === 'todos' || product.category === selectedCategory;
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.subtitle.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // recommended / default
    });
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <section id="catalogo" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-terracotta-600 font-semibold">
            Colección Curada
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900 mt-1">
            Explora la Selección
          </h2>
        </div>

        {/* Filter Pills & Sorting */}
        <div className="flex flex-wrap items-center gap-3 justify-between md:justify-end">
          
          {/* Sorting Dropdown */}
          <div className="flex items-center gap-2 bg-surface border border-warmgray-200 rounded-full px-3.5 py-1.5 text-xs font-medium text-charcoal-900 shadow-sm">
            <SlidersHorizontal className="w-3.5 h-3.5 text-warmgray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="recommended">Recomendados</option>
              <option value="price-low">Precio: Menor a Mayor</option>
              <option value="price-high">Precio: Mayor a Menor</option>
              <option value="rating">Mejor Valorados</option>
            </select>
          </div>

        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-8 border-b border-warmgray-200/60">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              if (cat.id === 'todos') {
                setSelectedCategory('todos');
              } else {
                openCategoryPage(cat.id);
              }
            }}
            className={`px-5 py-2.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 ${
              selectedCategory === cat.id
                ? 'bg-charcoal-900 text-white shadow-soft'
                : 'bg-surface hover:bg-warmgray-100 text-charcoal-900 border border-warmgray-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Product Results Status Bar */}
      <div className="flex items-center justify-between text-xs text-warmgray-500 mb-6 font-mono">
        <span>Mostrando {filteredProducts.length} resultado(s)</span>
        {searchQuery && (
          <span>Búsqueda: "{searchQuery}"</span>
        )}
      </div>

      {/* Grid or Empty State */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-surface rounded-3xl border border-dashed border-warmgray-200 max-w-md mx-auto my-8 p-8">
          <PackageSearch className="w-12 h-12 text-warmgray-500 mx-auto mb-4" />
          <h3 className="font-serif text-xl font-bold text-charcoal-900">No encontramos productos</h3>
          <p className="text-sm text-warmgray-500 mt-2">
            Intenta cambiar los términos de búsqueda o selecciona otra categoría.
          </p>
        </div>
      )}

    </section>
  );
};
