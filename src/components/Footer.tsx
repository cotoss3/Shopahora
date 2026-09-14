import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, Lock, FileText, Truck } from 'lucide-react';
import { useNavigationStore } from '../store/useNavigationStore';
import { useAuthStore } from '../store/useAuthStore';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { navigateTo } = useNavigationStore();
  const { currentUser } = useAuthStore();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const isB2B = currentUser.role !== 'cliente_b2c';

  return (
    <footer className="bg-charcoal-900 text-white pt-16 pb-12 border-t border-charcoal-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-charcoal-800">
          
          {/* Brand & Newsletter */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigateTo('home')}>
              <span className="w-9 h-9 rounded-full bg-terracotta-600 text-white flex items-center justify-center font-bold text-lg">
                S
              </span>
              <span className="font-serif text-2xl font-bold tracking-tight">
                Shop<span className="italic font-normal text-terracotta-500">Ahora</span>
              </span>
            </div>

            <p className="text-sm text-warmgray-500 font-light max-w-sm">
              {isB2B
                ? 'Plataforma Comercial Panamá Retail & Distribución B2B. Facturación oficial DGI (ITBMS 7%), crédito y despacho nacional.'
                : 'Tienda Oficial de Comercio Electrónico en Panamá. Productos seleccionados con garantía certificada, facturación fiscal (ITBMS 7%) y envíos a todo el país.'}
            </p>

            {/* Newsletter Form */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-warmgray-200 uppercase tracking-wider block">
                Únete al Club Privado (10% OFF en tu primer pedido)
              </span>

              {subscribed ? (
                <div className="flex items-center gap-2 text-xs font-mono text-terracotta-500 bg-charcoal-800 p-3 rounded-full">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>¡Te has suscrito con éxito! Revisa tu bandeja de entrada.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex items-center gap-2 max-w-md">
                  <input
                    type="email"
                    required
                    placeholder="tu.email@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-4 py-3 bg-charcoal-800 border border-charcoal-700 rounded-full text-xs text-white placeholder-warmgray-500 focus:outline-none focus:border-terracotta-500"
                  />
                  <button
                    type="submit"
                    className="px-5 py-3 bg-terracotta-600 hover:bg-terracotta-500 text-white text-xs font-medium rounded-full transition-colors flex items-center gap-1.5"
                  >
                    <span>Unirme</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>

          </div>

          {/* Quick Links */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs font-mono">
            <div className="space-y-3">
              <h4 className="text-white uppercase tracking-wider font-semibold">Navegación</h4>
              <ul className="space-y-2.5 text-warmgray-400 font-light">
                <li><button onClick={() => navigateTo('home')} className="hover:text-white transition-colors">Catálogo Completo</button></li>
                <li><button onClick={() => navigateTo('shipping-policy')} className="hover:text-white transition-colors">Matriz de Envíos Panamá</button></li>
                <li><button onClick={() => navigateTo('terms')} className="hover:text-white transition-colors">Términos Comerciales B2B</button></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-white uppercase tracking-wider font-semibold">Políticas & Legal</h4>
              <ul className="space-y-2.5 text-warmgray-400 font-light">
                <li><button onClick={() => navigateTo('terms')} className="hover:text-white transition-colors flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-terracotta-500" /> Términos de Compra</button></li>
                <li><button onClick={() => navigateTo('privacy')} className="hover:text-white transition-colors flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-forest-500" /> Protección de Datos</button></li>
                <li><button onClick={() => navigateTo('terms')} className="hover:text-white transition-colors flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-purple-500" /> Garantías al Consumidor</button></li>
                <li><button onClick={() => navigateTo('shipping-policy')} className="hover:text-white transition-colors flex items-center gap-1.5"><Truck className="w-3.5 h-3.5 text-blue-500" /> Envíos a Nivel Nacional</button></li>
              </ul>
            </div>

            <div className="space-y-3 col-span-2 sm:col-span-1">
              <h4 className="text-white uppercase tracking-wider font-semibold">Garantía Anti-Slop</h4>
              <p className="text-warmgray-400 font-light leading-relaxed font-sans text-xs">
                Cada producto es inspeccionado con criterios estrictos de calidad, sostenibilidad y trazabilidad legal en Panamá.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-warmgray-500 gap-4 font-mono">
          <p>© 2026 ShopAhora S.A. Panamá. RUC 155789234-2-2026 DV 45. Todos los derechos reservados.</p>
          <div className="flex items-center space-x-6">
            <button onClick={() => navigateTo('privacy')} className="hover:text-white transition-colors">Privacidad & Datos</button>
            <button onClick={() => navigateTo('terms')} className="hover:text-white transition-colors">Términos de Servicio</button>
            <button onClick={() => navigateTo('shipping-policy')} className="hover:text-white transition-colors">Políticas de Envío</button>
          </div>
        </div>

      </div>
    </footer>
  );
};
