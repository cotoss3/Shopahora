import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Package, DollarSign, Tag, ShieldCheck, Plus, Trash2, Check, Image as ImageIcon, Power, Layers } from 'lucide-react';
import { useNavigationStore } from '../../store/useNavigationStore';
import { useInventoryStore } from '../../store/useInventoryStore';
import { useCartStore } from '../../store/useCartStore';
import { ImageS3Uploader } from '../common/ImageS3Uploader';
import { Product } from '../../types/product';

export const AdminProductEditorPage: React.FC = () => {
  const { editingProduct, navigateTo } = useNavigationStore();
  const { addProduct, updateProduct } = useInventoryStore();
  const { showNotification } = useCartStore();

  const isEditing = Boolean(editingProduct);

  const [formData, setFormData] = useState<Partial<Product>>({
    id: editingProduct?.id || `SA-PROD-${Date.now().toString().slice(-4)}`,
    name: editingProduct?.name || '',
    subtitle: editingProduct?.subtitle || '',
    description: editingProduct?.description || '',
    price: editingProduct?.price || 0,
    b2bPrice: editingProduct?.b2bPrice || 0,
    b2bDiscountPercent: editingProduct?.b2bDiscountPercent || 20,
    category: editingProduct?.category || 'tecnologia',
    isItbmsExempt: editingProduct?.isItbmsExempt || false,
    stockPhysical: editingProduct?.stockPhysical ?? 10,
    allowDropshipping: editingProduct?.allowDropshipping || false,
    isActive: editingProduct?.isActive ?? true,
    rating: editingProduct?.rating || 5.0,
    reviewsCount: editingProduct?.reviewsCount || 1,
    badge: editingProduct?.badge || undefined,
    colors: editingProduct?.colors || [
      { name: 'Negro Azabache', hex: '#121212' },
      { name: 'Plata Metálico', hex: '#E0E0E0' }
    ],
    features: editingProduct?.features || [
      'Garantía Oficial en Panamá por 12 meses',
      'Cumplimiento de estándares de calidad internacional'
    ],
    images: editingProduct?.images || [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop'
    ]
  });

  const [newFeature, setNewFeature] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');

  // Auto-calculate B2B discount when retail or b2b price changes
  const handlePriceChange = (field: 'price' | 'b2bPrice', val: number) => {
    setFormData(prev => {
      const price = field === 'price' ? val : prev.price || 0;
      const b2bPrice = field === 'b2bPrice' ? val : prev.b2bPrice || 0;
      let discount = prev.b2bDiscountPercent || 0;

      if (price > 0 && b2bPrice > 0 && price >= b2bPrice) {
        discount = Math.round(((price - b2bPrice) / price) * 100);
      }

      return {
        ...prev,
        [field]: val,
        b2bDiscountPercent: discount
      };
    });
  };

  const handleAddFeature = () => {
    if (!newFeature.trim()) return;
    setFormData(prev => ({
      ...prev,
      features: [...(prev.features || []), newFeature.trim()]
    }));
    setNewFeature('');
  };

  const handleRemoveFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: (prev.features || []).filter((_, idx) => idx !== index)
    }));
  };

  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    setFormData(prev => ({
      ...prev,
      images: [...(prev.images || []), newImageUrl.trim()]
    }));
    setNewImageUrl('');
  };

  const handleRemoveImage = (index: number) => {
    if ((formData.images || []).length <= 1) return;
    setFormData(prev => ({
      ...prev,
      images: (prev.images || []).filter((_, idx) => idx !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price || formData.price <= 0) {
      alert('Por favor completa los campos obligatorios (Nombre y Precio Retail).');
      return;
    }

    const finalProduct: Product = {
      id: formData.id || `SA-PROD-${Date.now()}`,
      name: formData.name || 'Producto Sin Nombre',
      subtitle: formData.subtitle || '',
      description: formData.description || '',
      price: Number(formData.price),
      b2bPrice: Number(formData.b2bPrice || formData.price),
      b2bDiscountPercent: Number(formData.b2bDiscountPercent || 0),
      category: formData.category || 'tecnologia',
      isItbmsExempt: Boolean(formData.isItbmsExempt),
      stockPhysical: Number(formData.stockPhysical || 0),
      allowDropshipping: Boolean(formData.allowDropshipping),
      isActive: Boolean(formData.isActive),
      rating: Number(formData.rating || 5.0),
      reviewsCount: Number(formData.reviewsCount || 1),
      badge: formData.badge || undefined,
      colors: formData.colors || [],
      features: formData.features || [],
      images: formData.images || ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop']
    };

    if (isEditing) {
      updateProduct(finalProduct);
      showNotification(`Producto "${finalProduct.name}" actualizado con éxito.`);
    } else {
      addProduct(finalProduct);
      showNotification(`Nuevo producto "${finalProduct.name}" creado en el catálogo.`);
    }

    navigateTo('home');
  };

  return (
    <section className="pt-28 pb-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
      
      {/* Header Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-warmgray-200/80 pb-4 font-mono text-xs text-warmgray-500">
        <div className="flex items-center gap-2">
          <button onClick={() => navigateTo('home')} className="hover:text-terracotta-600 transition-colors">
            Backoffice Admin
          </button>
          <span>/</span>
          <button onClick={() => navigateTo('home')} className="hover:text-terracotta-600 transition-colors">
            Gestión de Productos
          </button>
          <span>/</span>
          <span className="text-charcoal-900 font-bold">
            {isEditing ? `Editar: ${editingProduct?.name}` : 'Crear Nuevo Producto'}
          </span>
        </div>

        <button
          onClick={() => navigateTo('home')}
          className="px-4 py-2 bg-surface border border-warmgray-200 rounded-full text-xs font-mono font-medium text-charcoal-900 hover:bg-warmgray-100 transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <ArrowLeft className="w-4 h-4 text-terracotta-600" />
          <span>Volver al Backoffice</span>
        </button>
      </div>

      {/* Main Full-Page Form Card */}
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Title Banner */}
        <div className="p-8 rounded-3xl bg-surface border border-warmgray-200 shadow-soft flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-600/10 text-purple-700 text-xs font-mono font-semibold">
              <Package className="w-3.5 h-3.5" />
              <span>Módulo de Administración de Catálogo & Productos</span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-charcoal-900">
              {isEditing ? `Editar Producto #${formData.id}` : 'Registrar Nuevo Producto'}
            </h1>
            <p className="text-xs text-warmgray-500 font-mono">
              Configuración completa de precios Retail/B2B, impuestos ITBMS, existencias físicas y dropshipping
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigateTo('home')}
              className="px-5 py-3 bg-canvas hover:bg-warmgray-200 text-charcoal-900 border border-warmgray-200 rounded-full text-xs font-medium font-mono transition-all shadow-xs"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-7 py-3 bg-charcoal-900 hover:bg-terracotta-600 text-white rounded-full text-xs font-medium font-mono transition-all shadow-lifted flex items-center gap-2"
            >
              <Save className="w-4 h-4 text-terracotta-500" />
              <span>{isEditing ? 'Guardar Cambios' : 'Publicar Producto'}</span>
            </button>
          </div>
        </div>

        {/* Form Body Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Info Column */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* General Info Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-warmgray-200 shadow-soft space-y-4">
              <h2 className="font-serif text-xl font-bold text-charcoal-900 border-b border-warmgray-200 pb-3">
                Información General del Producto
              </h2>

              <div className="space-y-4 text-xs font-mono">
                <div>
                  <label className="block text-warmgray-700 font-bold mb-1">Nombre Comercial *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Audífonos Studio Pro Wireless"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 bg-canvas border border-warmgray-200 rounded-xl text-charcoal-900 font-sans text-sm focus:outline-none focus:border-terracotta-600"
                  />
                </div>

                <div>
                  <label className="block text-warmgray-700 font-bold mb-1">Subtítulo / Eslogan Corto</label>
                  <input
                    type="text"
                    placeholder="Ej. Cancelación de Ruido Activa & Audio Espacial HD"
                    value={formData.subtitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                    className="w-full px-4 py-3 bg-canvas border border-warmgray-200 rounded-xl text-charcoal-900 font-sans focus:outline-none focus:border-terracotta-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-warmgray-700 font-bold mb-1">Categoría</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as Product['category'] }))}
                      className="w-full px-4 py-3 bg-canvas border border-warmgray-200 rounded-xl text-charcoal-900 focus:outline-none focus:border-terracotta-600 cursor-pointer"
                    >
                      <option value="audio">Audio & Sonido</option>
                      <option value="hogar">Hogar & Ambiente</option>
                      <option value="tecnologia">Tecnología</option>
                      <option value="accesorios">Accesorios</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-warmgray-700 font-bold mb-1">Etiqueta Promocional (Badge)</label>
                    <select
                      value={formData.badge || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, badge: (e.target.value || undefined) as Product['badge'] }))}
                      className="w-full px-4 py-3 bg-canvas border border-warmgray-200 rounded-xl text-charcoal-900 focus:outline-none focus:border-terracotta-600 cursor-pointer"
                    >
                      <option value="">Sin Etiqueta</option>
                      <option value="Destacado">Destacado</option>
                      <option value="Nuevo">Nuevo</option>
                      <option value="Oferta">Oferta</option>
                      <option value="Edición Limitada">Edición Limitada</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-warmgray-700 font-bold mb-1">Descripción Comercial Detallada</label>
                  <textarea
                    rows={4}
                    placeholder="Escribe la descripción completa del producto..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 bg-canvas border border-warmgray-200 rounded-xl text-charcoal-900 font-sans focus:outline-none focus:border-terracotta-600"
                  />
                </div>
              </div>
            </div>

            {/* Pricing & B2B Discounts Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-warmgray-200 shadow-soft space-y-4">
              <div className="flex items-center gap-2 border-b border-warmgray-200 pb-3">
                <DollarSign className="w-5 h-5 text-forest-700" />
                <h2 className="font-serif text-xl font-bold text-charcoal-900">
                  Precios Retail & Descuentos Mayoristas B2B
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                <div>
                  <label className="block text-warmgray-700 font-bold mb-1">Precio Retail (B2C) *</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3 text-warmgray-500 font-bold">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      value={formData.price}
                      onChange={(e) => handlePriceChange('price', parseFloat(e.target.value) || 0)}
                      className="w-full pl-8 pr-4 py-3 bg-canvas border border-warmgray-200 rounded-xl text-charcoal-900 font-bold text-sm focus:outline-none focus:border-terracotta-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-warmgray-700 font-bold mb-1">Precio Mayorista (B2B)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3 text-forest-700 font-bold">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.b2bPrice}
                      onChange={(e) => handlePriceChange('b2bPrice', parseFloat(e.target.value) || 0)}
                      className="w-full pl-8 pr-4 py-3 bg-canvas border border-warmgray-200 rounded-xl text-forest-700 font-bold text-sm focus:outline-none focus:border-forest-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-warmgray-700 font-bold mb-1">Descuento B2B Calculado</label>
                  <div className="px-4 py-3 bg-forest-700/10 border border-forest-700/30 rounded-xl text-forest-700 font-bold text-sm text-center">
                    -{formData.b2bDiscountPercent}% OFF B2B
                  </div>
                </div>
              </div>
            </div>

            {/* Features & Technical Specs Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-warmgray-200 shadow-soft space-y-4">
              <h2 className="font-serif text-xl font-bold text-charcoal-900 border-b border-warmgray-200 pb-3">
                Especificaciones & Características Técnicas
              </h2>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Agregar nueva especificación técnica..."
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                    className="flex-1 px-4 py-2.5 bg-canvas border border-warmgray-200 rounded-xl text-charcoal-900 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-4 py-2.5 bg-charcoal-900 text-white rounded-xl font-bold hover:bg-terracotta-600 transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Agregar
                  </button>
                </div>

                <ul className="space-y-2">
                  {formData.features?.map((feat, idx) => (
                    <li key={idx} className="flex items-center justify-between p-3 rounded-xl bg-canvas border border-warmgray-200">
                      <span className="text-charcoal-900 font-medium">{feat}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
                        className="p-1.5 text-warmgray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>

          {/* Settings & Media Column */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Inventory & Status Card */}
            <div className="p-6 rounded-3xl bg-surface border border-warmgray-200 shadow-soft space-y-4 font-mono text-xs">
              <h3 className="font-serif text-lg font-bold text-charcoal-900 border-b border-warmgray-200 pb-3">
                Inventario & Configuración
              </h3>

              <div>
                <label className="block text-warmgray-700 font-bold mb-1">Stock Físico en Bodega (Unidades)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.stockPhysical}
                  onChange={(e) => setFormData(prev => ({ ...prev, stockPhysical: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-3 bg-canvas border border-warmgray-200 rounded-xl font-bold text-charcoal-900 text-sm focus:outline-none"
                />
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-2">
                <label className="flex items-center justify-between p-3 rounded-xl bg-canvas border border-warmgray-200 cursor-pointer">
                  <span>Permitir Dropshipping (Vender Sin Stock):</span>
                  <input
                    type="checkbox"
                    checked={formData.allowDropshipping}
                    onChange={(e) => setFormData(prev => ({ ...prev, allowDropshipping: e.target.checked }))}
                    className="w-4 h-4 text-terracotta-600 rounded focus:ring-0 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-canvas border border-warmgray-200 cursor-pointer">
                  <span>Exento de ITBMS (0% Impuesto Panamá):</span>
                  <input
                    type="checkbox"
                    checked={formData.isItbmsExempt}
                    onChange={(e) => setFormData(prev => ({ ...prev, isItbmsExempt: e.target.checked }))}
                    className="w-4 h-4 text-forest-700 rounded focus:ring-0 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-canvas border border-warmgray-200 cursor-pointer">
                  <span>Producto Activo en Tienda:</span>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="w-4 h-4 text-purple-700 rounded focus:ring-0 cursor-pointer"
                  />
                </label>
              </div>
            </div>

            {/* Media Gallery & S3 File Explorer Card */}
            <div className="p-6 rounded-3xl bg-surface border border-warmgray-200 shadow-soft space-y-4 font-mono text-xs">
              <h3 className="font-serif text-lg font-bold text-charcoal-900 border-b border-warmgray-200 pb-3 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-terracotta-600" /> Galería & Carga de Archivos (S3 Ready)
              </h3>

              <ImageS3Uploader
                images={formData.images || []}
                onChange={(newImages) => setFormData(prev => ({ ...prev, images: newImages }))}
              />
            </div>

          </div>

        </div>

      </form>

    </section>
  );
};
