import React from 'react';
import { X, ShieldCheck, User, Building2, Briefcase, Warehouse, Key, Database } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { MOCK_USERS } from '../data/mockUsers';
import { UserRole } from '../types/product';
import { isSupabaseConfigured } from '../lib/supabase';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, switchRole, currentUser } = useAuthStore();

  if (!isAuthModalOpen) return null;

  const roleIcons: Record<UserRole, React.ReactNode> = {
    cliente_b2c: <User className="w-5 h-5 text-terracotta-600" />,
    cliente_b2b: <Building2 className="w-5 h-5 text-forest-700" />,
    vendedor_b2b: <Briefcase className="w-5 h-5 text-amber-600" />,
    supervisor: <Warehouse className="w-5 h-5 text-blue-600" />,
    admin: <Key className="w-5 h-5 text-purple-600" />
  };

  const roleTitles: Record<UserRole, string> = {
    cliente_b2c: 'Cliente Retail (B2C)',
    cliente_b2b: 'Cliente Comercial (B2B)',
    vendedor_b2b: 'Vendedor Comercial (Sales Rep)',
    supervisor: 'Supervisor de Operaciones',
    admin: 'Administrador / Gerente'
  };

  const roleDescriptions: Record<UserRole, string> = {
    cliente_b2c: 'Acceso a precios de venta directa, ocultamiento de stock exacto, pago con ITBMS 7%.',
    cliente_b2b: 'Precios mayoristas con descuento, stock físico en bodega, líneas de crédito 15/30/45 días.',
    vendedor_b2b: 'Gestión de cartera B2B, revisión de estados de cuenta, cobros y cheques posfechados.',
    supervisor: 'Módulo de mermas/productos defectuosos, edición de pedidos por faltantes y control de flota.',
    admin: 'Control total sobre reglas de precio, márgenes, aprobación de créditos, impuestos y reactivación de productos.'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-charcoal-900/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-canvas rounded-3xl shadow-lifted border border-warmgray-200 overflow-hidden max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="p-6 border-b border-warmgray-200/80 bg-surface flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-terracotta-600" />
            <h2 className="font-serif text-xl font-bold text-charcoal-900">
              Matriz de Roles y Autenticación RBAC
            </h2>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-2 text-warmgray-500 hover:text-charcoal-900 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Supabase Connection Status Badge */}
          <div className="p-4 rounded-2xl bg-surface border border-warmgray-200/80 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-forest-700" />
              <span>Estado de Conexión Backend:</span>
            </div>
            {isSupabaseConfigured() ? (
              <span className="px-3 py-1 rounded-full bg-forest-700/10 text-forest-700 font-bold">
                Conectado a Supabase Producción
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 font-bold">
                Modo Simulación RBAC (Esperando API Key en .env)
              </span>
            )}
          </div>

          <p className="text-xs text-warmgray-500 font-light">
            Selecciona un perfil para cambiar inmediatamente de vista y evaluar los permisos del sistema:
          </p>

          {/* User Role List */}
          <div className="space-y-3">
            {(Object.keys(MOCK_USERS) as UserRole[]).map((role) => {
              const user = MOCK_USERS[role];
              const isSelected = currentUser.role === role;

              return (
                <div
                  key={role}
                  onClick={() => switchRole(role)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                    isSelected
                      ? 'bg-surface border-terracotta-600 ring-2 ring-terracotta-600/20 shadow-soft'
                      : 'bg-surface/60 hover:bg-surface border-warmgray-200'
                  }`}
                >
                  <div className="p-2.5 rounded-xl bg-warmgray-100 mt-0.5">
                    {roleIcons[role]}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif text-sm font-bold text-charcoal-900">
                        {roleTitles[role]}
                      </h4>
                      {isSelected && (
                        <span className="px-2.5 py-0.5 rounded-full bg-terracotta-600 text-white text-[10px] font-mono uppercase font-bold">
                          Activo
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-warmgray-700 font-mono">
                      {user.fullName} ({user.email})
                    </p>
                    <p className="text-xs text-warmgray-500 font-light pt-1">
                      {roleDescriptions[role]}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
};
