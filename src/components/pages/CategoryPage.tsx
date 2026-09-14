import React, { useState, useMemo } from 'react';
import { useNavigationStore } from '../../store/useNavigationStore';
import { PRODUCTS } from '../../data/products';
import { ProductCard } from '../ProductCard';
import { 
  Headphones, 
  Home, 
  Cpu, 
  ShoppingBag, 
  ChevronRight, 
  SlidersHorizontal, 
  PackageSearch,
  Sparkles,
  Search,
  ShieldCheck,
  Truck,
  ArrowLeft
} from 'lucide-react';

interface CategoryInfo {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  badge: string;
  bgGradient: string;
}

const CATEGORY_MAP: Record<string, CategoryInfo> = {
  audio: {
    id: 'audio',
    name: 'Audio & Sonido',
    subtitle: 'Audífonos, Bocinas HD & Alta Fidelidad',
    description: 'Sumérgete en una experiencia de sonido superior. Colección seleccionada de audífonos con cancelación activa de ruido, bocinas inalámbricas Bluetooth y sonido de alta resolución en Panamá.',
    icon: <Headphones className="w-8 h-8 text-terracotta-600" />,
    badge: 'Hi-Fi & Wireless',
    bgGradient: 'from-amber-500/10 via-terracotta-500/5 to-transparent'
  },
  hogar: {
    id: 'hogar',
    name: 'Hogar & Ambiente',
    subtitle: 'Confort Doméstico, Difusores & Iluminación LED',
    description: 'Transforma tus espacios en santuarios de bienestar. Humidificadores ultrasónicos silentes, luces ambientales RGB y dispositivos inteligentes para el hogar moderno.',
    icon: <Home className="w-8 h-8 text-forest-600" />,
    badge: 'Confort & Wellness',
    bgGradient: 'from-emerald-500/10 via-forest-500/5 to-transparent'
  },
  tecnologia: {
    id: 'tecnologia',
    name: 'Tecnología',
    subtitle: 'Gadgets, Smartwatches & Periféricos Pro',
    description: 'Las últimas innovaciones tecnológicas al alcance de tu mano. Relojes inteligentes de salud y deporte, teclados mecánicos RGB, estaciones de carga rápida y periféricos de alto rendimiento.',
    icon: <Cpu className="w-8 h-8 text-blue-600" />,
    badge: 'Tech & Gadgets',
    bgGradient: 'from-blue-500/10 via-indigo-500/5 to-transparent'
  },
  accesorios: {
    id: 'accesorios',
    name: 'Accesorios',
    subtitle: 'Mochilas Anti-Robo, Soportes & Estilo',
    description: 'Complementos diseñados para el profesional en movimiento. Mochilas ejecutivas impermeables con puerto de carga USB, soportes de aluminio articulados y accesorios esenciales.',
    icon: <ShoppingBag className="w-8 h-8 text-purple-600" />,
    badge: 'Mobility & Style',
    bgGradient: 'from-purple-500/10 via-purple-600/5 to-transparent'
  }
};

export const CategoryPage: React.FC = () => {
  const { selectedCategory, navigateTo, openCategoryPage } = useNavigationStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recommended' | 'price-low' | 'price-high' | 'rating'>('recommended');

  const catKey = (selectedCategory || 'audio').toLowerCase();
  const categoryInfo = CATEGORY_MAP[catKey] || {
    id: catKey,
    name: catKey.toUpperCase(),
    subtitle: 'Colección de Productos',
    description: `Catálogo completo de productos en la categoría ${catKey} con facturación fiscal DGI e impuestos ITBMS (7%) incluidos en Panamá.`,
    icon: <Sparkles className="w-8 h-8 text-terracotta-600" />,
    badge: 'Categoría Especial',
    bgGradient: 'from-warmgray-200/50 to-transparent'
  };

  const categoryProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchesCategory = p.category.toLowerCase() === catKey;
      const matchesSearch = 
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [catKey, searchQuery, sortBy]);

  const allCategories = [
    { id: 'audio', label: 'Audio & Sonido' },
    { id: 'hogar', label: 'Hogar & Ambiente' },
    { id: 'tecnologia', label: 'Tecnología' },
    { id: 'accesorios', label: 'Accesorios' },
  ];

  return (
    <div className="pt-24 pb-20 min-h-screen bg-canvas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center text-xs font-mono text-warmgray-500 mb-6 flex-wrap gap-2">
          <button 
            onClick={() => navigateTo('home')} 
            className="hover:text-charcoal-900 transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Inicio</span>
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-warmgray-400" />
          <span>Categorías</span>
          <ChevronRight className="w-3.5 h-3.5 text-warmgray-400" />
          <span className="text-charcoal-900 font-bold capitalize">{categoryInfo.name}</span>
        </nav>

        {/* Category Hero Banner */}
        <div className={`relative overflow-hidden rounded-3xl bg-surface border border-warmgray-200 p-8 sm:p-12 mb-10 shadow-soft bg-gradient-to-br ${categoryInfo.bgGradient}`}>
          <div className="relative z-10 max-w-3xl">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-warmgray-200 text-xs font-mono font-bold text-charcoal-900 mb-4 shadow-xs">
              {categoryInfo.icon}
              <span className="uppercase tracking-widest">{categoryInfo.badge}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-charcoal-900 tracking-tight mb-3">
              {categoryInfo.name}
            </h1>

            <p className="font-mono text-sm sm:text-base text-terracotta-600 font-semibold mb-4">
              {categoryInfo.subtitle}
            </p>

            <p className="text-sm sm:text-base text-warmgray-600 leading-relaxed font-light mb-6">
              {categoryInfo.description}
            </p>

            {/* Badges / Value Props */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-warmgray-700">
              <span className="flex items-center gap-1.5 bg-white/60 px-3 py-1.5 rounded-full border border-warmgray-200">
                <Truck className="w-4 h-4 text-forest-600" />
                <span>Envíos a las 10 Provincias</span>
              </span>
              <span className="flex items-center gap-1.5 bg-white/60 px-3 py-1.5 rounded-full border border-warmgray-200">
                <ShieldCheck className="w-4 h-4 text-terracotta-600" />
                <span>Garantía Oficial & Factura ITBMS 7%</span>
              </span>
            </div>

          </div>
        </div>

        {/* Category Navigation Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-8 border-b border-warmgray-200/60">
          <button
            onClick={() => navigateTo('home')}
            className="px-4 py-2 rounded-full text-xs font-medium bg-surface hover:bg-warmgray-100 text-charcoal-900 border border-warmgray-200 transition-colors"
          >
            Todos los Productos
          </button>
          {allCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => openCategoryPage(cat.id)}
              className={`px-5 py-2.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                catKey === cat.id
                  ? 'bg-charcoal-900 text-white shadow-soft font-semibold'
                  : 'bg-surface hover:bg-warmgray-100 text-charcoal-900 border border-warmgray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Filters and Sorting Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8 bg-surface p-4 rounded-2xl border border-warmgray-200 shadow-xs">
          
          {/* Search within Category */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-warmgray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Buscar en ${categoryInfo.name}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs font-mono bg-canvas border border-warmgray-200 rounded-full focus:outline-none focus:border-terracotta-500"
            />
          </div>

          {/* Sort & Status */}
          <div className="flex items-center justify-between sm:justify-end gap-3 font-mono text-xs text-warmgray-600">
            <span>{categoryProducts.length} producto(s)</span>

            <div className="flex items-center gap-2 bg-canvas border border-warmgray-200 rounded-full px-3.5 py-1.5 font-medium text-charcoal-900">
              <SlidersHorizontal className="w-3.5 h-3.5 text-warmgray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent focus:outline-none cursor-pointer text-xs"
              >
                <option value="recommended">Recomendados</option>
                <option value="price-low">Precio: Menor a Mayor</option>
                <option value="price-high">Precio: Mayor a Menor</option>
                <option value="rating">Mejor Valorados</option>
              </select>
            </div>
          </div>

        </div>

        {/* Product Grid or Empty State */}
        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-surface rounded-3xl border border-dashed border-warmgray-200 max-w-md mx-auto my-8 p-8">
            <PackageSearch className="w-12 h-12 text-warmgray-400 mx-auto mb-4" />
            <h3 className="font-serif text-xl font-bold text-charcoal-900">No encontramos productos</h3>
            <p className="text-sm text-warmgray-500 mt-2">
              No hay productos coincidentes en {categoryInfo.name}. Intenta modificar la búsqueda o explora otras categorías.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
