import React, { useState } from 'react';
import { Users, Search, Plus, Building2, ShieldCheck, MapPin, DollarSign, FileText, ArrowUpRight, X, UserPlus, CheckCircle2 } from 'lucide-react';
import { useNavigationStore } from '../../../store/useNavigationStore';
import { useCartStore } from '../../../store/useCartStore';

interface SalesCustomersTabProps {
  onNavigateTab: (tabId: string) => void;
}

interface B2BClient {
  id: string;
  name: string;
  ruc: string;
  contactPerson: string;
  phone: string;
  email: string;
  location: string;
  creditLimit: number;
  creditUsed: number;
  creditDays: number;
  isTaxExempt: boolean;
  status: string;
}

export const SalesCustomersTab: React.FC<SalesCustomersTabProps> = ({ onNavigateTab }) => {
  const { navigateTo } = useNavigationStore();
  const { showNotification } = useCartStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreatingClient, setIsCreatingClient] = useState(false);

  const [clientPortfolio, setClientPortfolio] = useState<B2BClient[]>([
    {
      id: 'cli-b2b-1',
      name: 'Distribuidora Istmo S.A.',
      ruc: '155729102-2-2021 DV 45',
      contactPerson: 'Ing. Carlos Bermúdez',
      phone: '+507 6902-1188',
      email: 'compras@dististmo.com',
      location: 'Parque Industrial Costa del Este, Panamá Centro',
      creditLimit: 15000,
      creditUsed: 4250,
      creditDays: 30,
      isTaxExempt: true,
      status: 'excelente'
    },
    {
      id: 'cli-b2b-2',
      name: 'Comercial Chiriquí S.A.',
      ruc: '8-901-23 DV 88',
      contactPerson: 'Lic. María Elena Santos',
      phone: '+507 775-4300',
      email: 'facturacion@comercialchiriqui.com',
      location: 'Vía Boquete, David, Chiriquí',
      creditLimit: 25000,
      creditUsed: 1200,
      creditDays: 45,
      isTaxExempt: false,
      status: 'al_dia'
    }
  ]);

  // New client form state
  const [newClientForm, setNewClientForm] = useState({
    name: '',
    ruc: '',
    contactPerson: '',
    phone: '',
    email: '',
    location: 'Panamá Centro',
    creditLimit: 10000,
    creditDays: 30,
    isTaxExempt: false
  });

  const handleCreateClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientForm.name.trim() || !newClientForm.ruc.trim()) {
      alert('Por favor ingresa la Razón Social y el RUC del cliente.');
      return;
    }

    const created: B2BClient = {
      id: `cli-b2b-${Date.now()}`,
      name: newClientForm.name.trim(),
      ruc: newClientForm.ruc.trim(),
      contactPerson: newClientForm.contactPerson.trim() || 'Contacto Comercial',
      phone: newClientForm.phone.trim() || '+507 6000-0000',
      email: newClientForm.email.trim() || 'info@cliente.pa',
      location: newClientForm.location,
      creditLimit: Number(newClientForm.creditLimit || 5000),
      creditUsed: 0,
      creditDays: Number(newClientForm.creditDays || 30),
      isTaxExempt: Boolean(newClientForm.isTaxExempt),
      status: 'excelente'
    };

    setClientPortfolio([created, ...clientPortfolio]);
    showNotification(`Cliente B2B "${created.name}" registrado con éxito.`);
    setIsCreatingClient(false);
    setNewClientForm({
      name: '',
      ruc: '',
      contactPerson: '',
      phone: '',
      email: '',
      location: 'Panamá Centro',
      creditLimit: 10000,
      creditDays: 30,
      isTaxExempt: false
    });
  };

  const filteredClients = clientPortfolio.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.ruc.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 font-mono text-xs animate-fadeIn">
      
      {/* Header & Search */}
      <div className="p-6 rounded-3xl bg-surface border border-warmgray-200 shadow-soft flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-charcoal-900 font-sans">
            Cartera de Clientes Mayoristas B2B
          </h1>
          <p className="text-warmgray-500 text-xs">
            Clientes asignados con límite de crédito fiscal y condiciones comerciales aprobadas.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:w-56">
            <Search className="w-4 h-4 text-warmgray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar cliente o RUC..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-canvas border border-warmgray-200 rounded-full text-charcoal-900 focus:outline-none"
            />
          </div>

          {/* New Client Button */}
          <button
            onClick={() => setIsCreatingClient(!isCreatingClient)}
            className="px-5 py-2.5 bg-charcoal-900 hover:bg-terracotta-600 text-white rounded-full font-bold transition-all shadow-xs flex items-center gap-2 whitespace-nowrap"
          >
            <UserPlus className="w-4 h-4 text-terracotta-500" />
            <span>Registrar Nuevo Cliente</span>
          </button>
        </div>
      </div>

      {/* New Client Creation Modal / Form */}
      {isCreatingClient && (
        <form onSubmit={handleCreateClientSubmit} className="p-8 rounded-3xl bg-surface border-2 border-terracotta-600 shadow-lifted space-y-6 animate-slideDown">
          <div className="flex justify-between items-center border-b border-warmgray-200 pb-3">
            <div className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-terracotta-600" />
              <h3 className="font-serif text-xl font-bold text-charcoal-900 font-sans">
                Formulario de Registro de Nuevo Cliente B2B
              </h3>
            </div>

            <button
              type="button"
              onClick={() => setIsCreatingClient(false)}
              className="p-1.5 hover:bg-warmgray-200 rounded-full text-warmgray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-charcoal-900 mb-1">Razón Social / Nombre Comercial *</label>
              <input
                type="text"
                required
                placeholder="Ej. Distribuidora del Pacífico S.A."
                value={newClientForm.name}
                onChange={(e) => setNewClientForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2.5 bg-canvas border border-warmgray-200 rounded-xl text-charcoal-900 focus:outline-none focus:border-terracotta-600 font-sans"
              />
            </div>

            <div>
              <label className="block font-bold text-charcoal-900 mb-1">RUC & DV (República de Panamá) *</label>
              <input
                type="text"
                required
                placeholder="Ej. 155890123-2-2024 DV 90"
                value={newClientForm.ruc}
                onChange={(e) => setNewClientForm(prev => ({ ...prev, ruc: e.target.value }))}
                className="w-full px-4 py-2.5 bg-canvas border border-warmgray-200 rounded-xl text-charcoal-900 focus:outline-none focus:border-terracotta-600"
              />
            </div>

            <div>
              <label className="block font-bold text-charcoal-900 mb-1">Persona de Contacto</label>
              <input
                type="text"
                placeholder="Ej. Lic. Roberto Méndez"
                value={newClientForm.contactPerson}
                onChange={(e) => setNewClientForm(prev => ({ ...prev, contactPerson: e.target.value }))}
                className="w-full px-4 py-2.5 bg-canvas border border-warmgray-200 rounded-xl text-charcoal-900 focus:outline-none focus:border-terracotta-600 font-sans"
              />
            </div>

            <div>
              <label className="block font-bold text-charcoal-900 mb-1">Teléfono Directo</label>
              <input
                type="text"
                placeholder="Ej. +507 6890-5544"
                value={newClientForm.phone}
                onChange={(e) => setNewClientForm(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-4 py-2.5 bg-canvas border border-warmgray-200 rounded-xl text-charcoal-900 focus:outline-none focus:border-terracotta-600"
              />
            </div>

            <div>
              <label className="block font-bold text-charcoal-900 mb-1">Correo Electrónico de Facturación</label>
              <input
                type="email"
                placeholder="Ej. compras@empresa.pa"
                value={newClientForm.email}
                onChange={(e) => setNewClientForm(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-2.5 bg-canvas border border-warmgray-200 rounded-xl text-charcoal-900 focus:outline-none focus:border-terracotta-600"
              />
            </div>

            <div>
              <label className="block font-bold text-charcoal-900 mb-1">Dirección & Provincia en Panamá</label>
              <input
                type="text"
                placeholder="Ej. Vía Tocumen, Complejo Bodegas 4, Panamá Centro"
                value={newClientForm.location}
                onChange={(e) => setNewClientForm(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-4 py-2.5 bg-canvas border border-warmgray-200 rounded-xl text-charcoal-900 focus:outline-none focus:border-terracotta-600 font-sans"
              />
            </div>

            <div>
              <label className="block font-bold text-charcoal-900 mb-1">Límite de Crédito Solicitado ($)</label>
              <input
                type="number"
                min="500"
                step="500"
                value={newClientForm.creditLimit}
                onChange={(e) => setNewClientForm(prev => ({ ...prev, creditLimit: parseFloat(e.target.value) || 0 }))}
                className="w-full px-4 py-2.5 bg-canvas border border-warmgray-200 rounded-xl text-charcoal-900 focus:outline-none font-bold text-forest-700"
              />
            </div>

            <div>
              <label className="block font-bold text-charcoal-900 mb-1">Días de Crédito Solicitados</label>
              <select
                value={newClientForm.creditDays}
                onChange={(e) => setNewClientForm(prev => ({ ...prev, creditDays: parseInt(e.target.value) }))}
                className="w-full px-4 py-2.5 bg-canvas border border-warmgray-200 rounded-xl text-charcoal-900 focus:outline-none font-bold"
              >
                <option value={15}>15 Días</option>
                <option value={30}>30 Días (Estándar)</option>
                <option value={45}>45 Días</option>
                <option value={60}>60 Días (Gran Cuenta)</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-warmgray-200">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={newClientForm.isTaxExempt}
                onChange={(e) => setNewClientForm(prev => ({ ...prev, isTaxExempt: e.target.checked }))}
                className="w-4 h-4 text-forest-700 rounded focus:ring-0 cursor-pointer"
              />
              <span className="font-bold text-charcoal-900">Cliente Exento de Impuesto ITBMS (0% Panamá)</span>
            </label>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsCreatingClient(false)}
                className="px-5 py-2.5 bg-canvas hover:bg-warmgray-200 text-charcoal-900 border border-warmgray-200 rounded-full font-bold"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="px-7 py-2.5 bg-charcoal-900 hover:bg-terracotta-600 text-white rounded-full font-bold shadow-lifted flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-terracotta-500" />
                <span>Registrar Cliente en Cartera</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Clients Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredClients.map((cli) => {
          const availableCredit = cli.creditLimit - cli.creditUsed;
          const usedPercent = Math.round((cli.creditUsed / cli.creditLimit) * 100);

          return (
            <div key={cli.id} className="p-6 rounded-3xl bg-surface border border-warmgray-200 shadow-soft space-y-4 flex flex-col justify-between hover:border-warmgray-300 transition-all">
              
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-forest-700/10 text-forest-700 font-bold text-[10px]">
                      Cliente Verificado B2B
                    </span>
                    <h3 className="font-serif text-xl font-bold text-charcoal-900 pt-1 font-sans">
                      {cli.name}
                    </h3>
                    <p className="text-warmgray-500 font-bold">RUC: {cli.ruc}</p>
                  </div>

                  <span className="px-3 py-1 bg-purple-600/10 text-purple-700 font-bold rounded-full text-[11px]">
                    Crédito {cli.creditDays} Días
                  </span>
                </div>

                <div className="space-y-1 text-warmgray-600">
                  <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-terracotta-600" /> {cli.location}</p>
                  <p>Contacto: <span className="font-bold text-charcoal-900">{cli.contactPerson}</span> ({cli.phone})</p>
                  <p>Impuestos: <span className="font-bold">{cli.isTaxExempt ? 'Exento de ITBMS (0%)' : 'Aplica ITBMS Panamá (7%)'}</span></p>
                </div>

                {/* Credit Limit Meter */}
                <div className="p-4 rounded-2xl bg-canvas border border-warmgray-200 space-y-2">
                  <div className="flex justify-between items-center text-charcoal-900 font-bold">
                    <span>Crédito Disponible:</span>
                    <span className="text-forest-700 text-sm">${availableCredit.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>

                  <div className="w-full bg-warmgray-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-forest-700 h-full transition-all"
                      style={{ width: `${Math.min(100, 100 - usedPercent)}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[10px] text-warmgray-500">
                    <span>Usado: ${cli.creditUsed.toFixed(2)} ({usedPercent}%)</span>
                    <span>Límite Aprobado: ${cli.creditLimit.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => onNavigateTab('presale')}
                  className="flex-1 py-3 bg-charcoal-900 hover:bg-terracotta-600 text-white rounded-2xl font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4 text-terracotta-500" />
                  <span>⚡ Crear Cotización</span>
                </button>

                <button
                  onClick={() => onNavigateTab('orders')}
                  className="px-4 py-3 bg-canvas hover:bg-warmgray-200 text-charcoal-900 border border-warmgray-200 rounded-2xl font-bold transition-colors"
                  title="Ver Pedidos del Cliente"
                >
                  <FileText className="w-4 h-4" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
