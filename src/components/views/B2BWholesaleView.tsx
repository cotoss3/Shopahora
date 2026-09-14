import React from 'react';
import { Building2, Package, CreditCard, Download, Truck, Plus, Eye } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useInventoryStore } from '../../store/useInventoryStore';
import { useCartStore } from '../../store/useCartStore';
import { useNavigationStore } from '../../store/useNavigationStore';

export const B2BWholesaleView: React.FC = () => {
  const { currentUser } = useAuthStore();
  const { products } = useInventoryStore();
  const { addToCart } = useCartStore();
  const { openProductDetail } = useNavigationStore();

  const availableCredit = currentUser.creditLimit - currentUser.creditUsed;

  return (
    <section className="pt-28 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* B2B Header Banner */}
      <div className="p-8 rounded-3xl bg-surface border border-warmgray-200/80 shadow-soft flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-700/10 text-forest-700 text-xs font-mono font-semibold">
            <Building2 className="w-3.5 h-3.5" />
            <span>Canal Comercial B2B Autorizado</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-charcoal-900">
            {currentUser.companyName || currentUser.fullName}
          </h1>
          <p className="text-xs text-warmgray-500 font-mono">
            RUC / DV: {currentUser.rucDv || 'N/A'} | Vendedor Asignado: {currentUser.salesRepName || 'Carlos Mendoza'}
          </p>
        </div>

        {/* Credit Limit Card */}
        <div className="p-5 rounded-2xl bg-canvas border border-warmgray-200 space-y-2 text-xs font-mono min-w-[280px]">
          <div className="flex justify-between items-center text-warmgray-700">
            <span>Línea de Crédito ({currentUser.creditDays} Días)</span>
            <CreditCard className="w-4 h-4 text-terracotta-600" />
          </div>
          <div className="flex justify-between items-baseline font-bold text-sm text-charcoal-900">
            <span>Disponible: ${availableCredit.toFixed(2)}</span>
            <span className="text-warmgray-500 font-normal">/ ${currentUser.creditLimit.toFixed(2)}</span>
          </div>
          <div className="w-full bg-warmgray-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-forest-700 h-full rounded-full"
              style={{ width: `${(currentUser.creditUsed / currentUser.creditLimit) * 100}%` }}
            />
          </div>
          {currentUser.isTaxExempt && (
            <p className="text-[11px] text-forest-700 font-semibold pt-1">
              ✓ Cliente Exonerado de ITBMS (7%)
            </p>
          )}
        </div>
      </div>

      {/* Catalog Table Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl font-bold text-charcoal-900">Catálogo Mayorista de Bodega</h2>
          <p className="text-xs text-warmgray-500 font-mono">Visualización estricta de existencias físicas & dropshipping</p>
        </div>
      </div>

      {/* Wholesale Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          const isLowStock = product.stockPhysical < 5;
          const isOutOfStock = product.stockPhysical === 0;

          return (
            <div
              key={product.id}
              className="p-6 rounded-2xl bg-surface border border-warmgray-200/80 shadow-soft hover:shadow-lifted transition-all flex flex-col justify-between space-y-4"
            >
              <div className="flex gap-4 cursor-pointer" onClick={() => openProductDetail(product)}>
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-24 h-24 object-cover rounded-xl bg-warmgray-100 flex-shrink-0 hover:scale-105 transition-transform"
                />
                <div className="space-y-1.5 flex-1">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono uppercase text-warmgray-500">{product.category}</span>
                    <span className="px-2 py-0.5 rounded bg-terracotta-600/10 text-terracotta-700 text-[10px] font-mono font-bold">
                      -{product.b2bDiscountPercent}% B2B
                    </span>
                  </div>
                  <h3 className="font-serif text-base font-bold text-charcoal-900 line-clamp-1 hover:text-terracotta-600 transition-colors">
                    {product.name}
                  </h3>
                  
                  {/* Prices comparison */}
                  <div className="flex items-baseline gap-2 font-mono text-xs">
                    <span className="text-warmgray-500 line-through">${product.price} (Retail)</span>
                    <span className="text-sm font-bold text-charcoal-900">${product.b2bPrice} B2B</span>
                  </div>
                </div>
              </div>

              {/* Inventory Stock Indicator */}
              <div className="p-3 rounded-xl bg-canvas border border-warmgray-200/60 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-warmgray-500" />
                  <span>Existencia Física:</span>
                </div>
                {isOutOfStock ? (
                  product.allowDropshipping ? (
                    <span className="text-amber-600 font-bold">Sin Stock (Dropshipping Habilitado)</span>
                  ) : (
                    <span className="text-red-600 font-bold">Agotado en Bodega</span>
                  )
                ) : (
                  <span className={`font-bold ${isLowStock ? 'text-amber-600' : 'text-forest-700'}`}>
                    {product.stockPhysical} unidades
                  </span>
                )}
              </div>

              {/* Add to Order Button */}
              <button
                onClick={() => addToCart(product)}
                disabled={isOutOfStock && !product.allowDropshipping}
                className="w-full py-3 bg-charcoal-900 hover:bg-terracotta-600 disabled:bg-warmgray-300 text-white rounded-xl text-xs font-medium transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar al Pedido B2B (${product.b2bPrice})</span>
              </button>

            </div>
          );
        })}
      </div>

    </section>
  );
};
