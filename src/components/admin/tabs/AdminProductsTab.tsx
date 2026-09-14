import React, { useState } from 'react';
import { Package, Plus, Search, Filter, Power, Edit3, Check, X } from 'lucide-react';
import { useInventoryStore } from '../../../store/useInventoryStore';
import { useNavigationStore } from '../../../store/useNavigationStore';
import { Product } from '../../../types/product';

export const AdminProductsTab: React.FC = () => {
  const { products, toggleProductActive } = useInventoryStore();
  const { openAdminProductEditor } = useNavigationStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.subtitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-charcoal-900">Catálogo de Productos & Inventario</h2>
          <p className="text-xs text-warmgray-500 font-mono">Gestión de existencias físicas, precios B2B, dropshipping e impuestos</p>
        </div>

        <button
          onClick={() => openAdminProductEditor(null)}
          className="px-5 py-2.5 bg-charcoal-900 hover:bg-terracotta-600 text-white rounded-full text-xs font-medium transition-all shadow-soft flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar Producto</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-surface border border-warmgray-200/80 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center bg-canvas border border-warmgray-200 rounded-full px-3.5 py-2 w-full sm:w-80 text-xs">
          <Search className="w-4 h-4 text-warmgray-500 mr-2" />
          <input
            type="text"
            placeholder="Buscar por nombre o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent focus:outline-none w-full text-charcoal-900"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto font-mono text-xs">
          <Filter className="w-4 h-4 text-warmgray-500" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-canvas border border-warmgray-200 rounded-full px-3.5 py-2 text-charcoal-900 focus:outline-none cursor-pointer"
          >
            <option value="all">Todas las Categorías</option>
            <option value="audio">Audio & Sonido</option>
            <option value="hogar">Hogar & Ambiente</option>
            <option value="tecnologia">Tecnología</option>
            <option value="accesorios">Accesorios</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="p-6 rounded-3xl bg-surface border border-warmgray-200 shadow-soft overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs font-mono">
          <thead>
            <tr className="border-b border-warmgray-200 text-warmgray-500">
              <th className="py-3 px-4">Producto</th>
              <th className="py-3 px-4">Categoría</th>
              <th className="py-3 px-4">Precio Retail</th>
              <th className="py-3 px-4">Precio B2B</th>
              <th className="py-3 px-4">Stock Físico</th>
              <th className="py-3 px-4">Dropshipping</th>
              <th className="py-3 px-4">ITBMS Exento</th>
              <th className="py-3 px-4">Estado</th>
              <th className="py-3 px-4 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-warmgray-100">
            {filteredProducts.map((p) => (
              <tr key={p.id} className="hover:bg-warmgray-100/50 transition-colors">
                <td className="py-4 px-4 font-bold text-charcoal-900 font-sans flex items-center gap-3">
                  <img src={p.images[0]} alt="" className="w-10 h-10 object-cover rounded-xl bg-warmgray-100" />
                  <div>
                    <p className="line-clamp-1">{p.name}</p>
                    <p className="text-[10px] text-warmgray-500 font-mono">SKU: SA-PROD-00{p.id}</p>
                  </div>
                </td>
                <td className="py-4 px-4 uppercase text-warmgray-500">{p.category}</td>
                <td className="py-4 px-4 font-bold">${p.price}</td>
                <td className="py-4 px-4 text-purple-700 font-bold">${p.b2bPrice}</td>
                <td className="py-4 px-4 font-bold">{p.stockPhysical} u</td>
                <td className="py-4 px-4">
                  {p.allowDropshipping ? (
                    <span className="px-2 py-0.5 rounded bg-forest-700/10 text-forest-700 font-bold">Habilitado</span>
                  ) : (
                    <span className="text-warmgray-400">Desactivado</span>
                  )}
                </td>
                <td className="py-4 px-4">
                  {p.isItbmsExempt ? (
                    <span className="px-2 py-0.5 rounded bg-forest-700/10 text-forest-700 font-bold">SÍ Exento</span>
                  ) : (
                    <span className="text-warmgray-400">7% ITBMS</span>
                  )}
                </td>
                <td className="py-4 px-4">
                  {p.isActive ? (
                    <span className="px-2.5 py-1 rounded-full bg-forest-700/10 text-forest-700 font-bold">Activo</span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-red-600/10 text-red-600 font-bold">Inactivo</span>
                  )}
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openAdminProductEditor(p)}
                      className="px-3 py-1.5 bg-charcoal-900 hover:bg-terracotta-600 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                      title="Editar producto a pantalla completa"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Editar</span>
                    </button>

                    <button
                      onClick={() => toggleProductActive(p.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                        p.isActive
                          ? 'bg-warmgray-200 text-charcoal-900 hover:bg-red-600 hover:text-white'
                          : 'bg-purple-700 text-white hover:bg-purple-800'
                      }`}
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span>{p.isActive ? 'Inactivar' : 'Activar'}</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
