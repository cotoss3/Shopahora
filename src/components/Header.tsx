import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Sparkles, Menu, X, Shield, Building2, Briefcase, Warehouse, Key, User } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigationStore } from '../store/useNavigationStore';
import { UserRole } from '../types/product';
import { MOCK_USERS } from '../data/mockUsers';

interface HeaderProps {
  onSearchChange: (query: string) => void;
  searchQuery: string;
}

export const Header: React.FC<HeaderProps> = ({ onSearchChange, searchQuery }) => {
  const { cart } = useCartStore();
  const { currentUser, switchRole } = useAuthStore();
  const { navigateTo } = useNavigationStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isRoleBarOpen, setIsRoleBarOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const roleLabels: Record<UserRole, { label: string; bg: string }> = {
    cliente_b2c: { label: 'Retail (B2C)', bg: 'bg-warmgray-200 text-charcoal-900' },
    cliente_b2b: { label: 'Comercial (B2B)', bg: 'bg-forest-700 text-white' },
    vendedor_b2b: { label: 'Vendedor B2B', bg: 'bg-amber-600 text-white' },
    supervisor: { label: 'Supervisor', bg: 'bg-blue-600 text-white' },
    admin: { label: 'Admin', bg: 'bg-purple-600 text-white' }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-canvas/85 backdrop-blur-md shadow-soft border-b border-warmgray-200/50 py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
        <div className="flex items-center justify-between">
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-charcoal-900 hover:text-terracotta-600 transition-colors"
            aria-label="Abrir menú"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Brand Logo */}
          <button onClick={() => navigateTo('home')} className="flex items-center gap-2 group text-left">
            <span className="w-9 h-9 rounded-full bg-terracotta-600 text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
              S
            </span>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-tight text-charcoal-900 group-hover:text-terracotta-600 transition-colors">
                Shop<span className="italic font-normal text-terracotta-600">Ahora</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-warmgray-700 font-mono -mt-1">
                {currentUser.role === 'cliente_b2c' ? 'Tienda Oficial Panamá' : 'Panamá Commercial & B2B'}
              </span>
            </div>
          </button>

          {/* Role Switcher Pill Button */}
          <button
            onClick={() => setIsRoleBarOpen(!isRoleBarOpen)}
            className={`hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold shadow-xs border border-white/20 transition-transform hover:scale-105 ${
              roleLabels[currentUser.role].bg
            }`}
            title="Cambiar Perfil / Rol RBAC"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Rol Activo: {roleLabels[currentUser.role].label}</span>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium font-mono">
            <button onClick={() => navigateTo('home')} className="text-charcoal-900 hover:text-terracotta-600 transition-colors">
              Catálogo
            </button>
            {currentUser.role === 'cliente_b2b' && (
              <button onClick={() => navigateTo('home')} className="text-forest-700 font-bold flex items-center gap-1">
                <Building2 className="w-4 h-4" /> Portal Mayorista
              </button>
            )}
            {currentUser.role === 'vendedor_b2b' && (
              <button onClick={() => navigateTo('home')} className="text-amber-600 font-bold flex items-center gap-1">
                <Briefcase className="w-4 h-4" /> Cartera & Cotizaciones
              </button>
            )}
            {currentUser.role === 'supervisor' && (
              <button onClick={() => navigateTo('home')} className="text-blue-600 font-bold flex items-center gap-1">
                <Warehouse className="w-4 h-4" /> Mermas & Despacho
              </button>
            )}
            {currentUser.role === 'admin' && (
              <button onClick={() => navigateTo('home')} className="text-purple-600 font-bold flex items-center gap-1">
                <Key className="w-4 h-4" /> Backoffice Admin
              </button>
            )}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-3">
            
            {/* Search Input Toggle */}
            <div className="relative">
              {isSearchOpen ? (
                <div className="flex items-center bg-surface border border-warmgray-200 rounded-full px-3 py-1.5 shadow-sm">
                  <Search className="w-4 h-4 text-warmgray-500 mr-2" />
                  <input
                    type="text"
                    placeholder="Buscar producto..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="bg-transparent text-sm text-charcoal-900 focus:outline-none w-36 sm:w-48 font-mono"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      setIsSearchOpen(false);
                      onSearchChange('');
                    }}
                    className="text-warmgray-500 hover:text-charcoal-900 ml-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 text-charcoal-900 hover:text-terracotta-600 hover:bg-warmgray-100 rounded-full transition-all"
                  aria-label="Buscar"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Shopping Cart Full Page Trigger Button */}
            <button
              onClick={() => navigateTo('cart')}
              className="relative p-2.5 bg-charcoal-900 text-white hover:bg-terracotta-600 rounded-full transition-all duration-300 shadow-soft hover:shadow-lifted flex items-center justify-center group"
              aria-label="Ir al Carrito"
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-terracotta-600 text-white font-mono text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-canvas animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Inline Role Switcher Bar (No Popups!) */}
        {isRoleBarOpen && (
          <div className="p-3 bg-surface rounded-2xl border border-warmgray-200 shadow-soft flex flex-wrap items-center justify-between gap-2 font-mono text-xs animate-slideDown">
            <span className="text-warmgray-500 font-bold">Cambiar Perfil RBAC:</span>
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(MOCK_USERS) as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    switchRole(r);
                    setIsRoleBarOpen(false);
                    navigateTo('home');
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    currentUser.role === r
                      ? 'bg-charcoal-900 text-white shadow-xs'
                      : 'bg-canvas hover:bg-warmgray-200 text-charcoal-900 border border-warmgray-200'
                  }`}
                >
                  {roleLabels[r].label}
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </header>
  );
};
