import React, { useState } from 'react';
import { Users, Building2, CreditCard, ShieldCheck, Edit3, Check, Percent, Briefcase, Plus, UserPlus, ToggleLeft, ToggleRight, DollarSign, X, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';
import { useInventoryStore } from '../../../store/useInventoryStore';
import { useCartStore } from '../../../store/useCartStore';
import { MOCK_USERS } from '../../../data/mockUsers';
import { UserProfile } from '../../../types/product';

export const AdminCustomersTab: React.FC = () => {
  const { updateCreditLimit } = useAuthStore();
  const { orders } = useInventoryStore();
  const { showNotification } = useCartStore();

  const [activeSubTab, setActiveSubTab] = useState<'customers' | 'sales_reps'>('customers');
  
  // User list state
  const [userList, setUserList] = useState<UserProfile[]>(Object.values(MOCK_USERS));
  
  // Edit states
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [newLimitInput, setNewLimitInput] = useState<number>(15000);

  // Sales rep edit state
  const [editingRepId, setEditingRepId] = useState<string | null>(null);
  const [repCommissionInput, setRepCommissionInput] = useState<number>(4.5);
  const [repMaxDiscountInput, setRepMaxDiscountInput] = useState<number>(15);

  // Create Sales Rep form state
  const [isCreatingRep, setIsCreatingRep] = useState(false);
  const [newRepForm, setNewRepForm] = useState({
    fullName: '',
    email: '',
    assignedTerritory: 'Panamá Centro & Provincias',
    commissionRate: 5.0,
    maxDiscountAuthorized: 15
  });

  const customersOnly = userList.filter((u) => u.role === 'cliente_b2b' || u.role === 'cliente_b2c');
  const salesRepsOnly = userList.filter((u) => u.role === 'vendedor_b2b');

  const handleSaveLimit = (userId: string) => {
    updateCreditLimit(userId, newLimitInput);
    setUserList((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, creditLimit: newLimitInput } : u))
    );
    setEditingUserId(null);
    showNotification('Límite de crédito actualizado.');
  };

  const handleSaveRepPermissions = (repId: string) => {
    setUserList((prev) =>
      prev.map((u) =>
        u.id === repId
          ? {
              ...u,
              commissionRate: repCommissionInput,
              maxDiscountAuthorized: repMaxDiscountInput
            }
          : u
      )
    );
    setEditingRepId(null);
    showNotification('Comisiones y límites de descuento del vendedor actualizados.');
  };

  const handleToggleRepActive = (repId: string) => {
    setUserList((prev) =>
      prev.map((u) => {
        if (u.id === repId) {
          const nextState = !Boolean(u.isActiveAccount ?? true);
          showNotification(`Cuenta de vendedor ${u.fullName} ${nextState ? 'Activada' : 'Inactivada'}.`);
          return { ...u, isActiveAccount: nextState };
        }
        return u;
      })
    );
  };

  const handleCreateRepSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRepForm.fullName.trim() || !newRepForm.email.trim()) {
      alert('Ingresa el Nombre Completo y Correo Electrónico del vendedor.');
      return;
    }

    const createdRep: UserProfile = {
      id: `u-vendedor-${Date.now()}`,
      email: newRepForm.email.trim(),
      fullName: newRepForm.fullName.trim(),
      role: 'vendedor_b2b',
      creditLimit: 0,
      creditDays: 30,
      creditUsed: 0,
      isTaxExempt: false,
      commissionRate: Number(newRepForm.commissionRate || 5.0),
      maxDiscountAuthorized: Number(newRepForm.maxDiscountAuthorized || 15),
      assignedTerritory: newRepForm.assignedTerritory,
      isActiveAccount: true
    };

    setUserList([createdRep, ...userList]);
    showNotification(`Nueva cuenta de vendedor "${createdRep.fullName}" creada con éxito.`);
    setIsCreatingRep(false);
    setNewRepForm({
      fullName: '',
      email: '',
      assignedTerritory: 'Panamá Centro & Provincias',
      commissionRate: 5.0,
      maxDiscountAuthorized: 15
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn font-mono text-xs">
      
      {/* Header & Sub-Tab Switcher */}
      <div className="p-6 rounded-3xl bg-surface border border-warmgray-200 shadow-soft flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-charcoal-900 font-sans">
            Control de Clientes & Cuentas de Vendedores Comercial
          </h2>
          <p className="text-xs text-warmgray-500">
            Administración centralizada de límites de crédito B2B, comisiones y permisos de vendedores.
          </p>
        </div>

        {/* Sub-tab pills */}
        <div className="flex items-center gap-2 font-bold">
          <button
            onClick={() => setActiveSubTab('customers')}
            className={`px-4 py-2 rounded-full transition-all ${
              activeSubTab === 'customers'
                ? 'bg-charcoal-900 text-white shadow-soft'
                : 'bg-canvas hover:bg-warmgray-200 text-charcoal-900 border border-warmgray-200'
            }`}
          >
            Clientes B2B & Retail ({customersOnly.length})
          </button>

          <button
            onClick={() => setActiveSubTab('sales_reps')}
            className={`px-4 py-2 rounded-full transition-all flex items-center gap-1.5 ${
              activeSubTab === 'sales_reps'
                ? 'bg-amber-600 text-white shadow-soft'
                : 'bg-canvas hover:bg-warmgray-200 text-charcoal-900 border border-warmgray-200'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Cuentas de Vendedores ({salesRepsOnly.length})</span>
          </button>
        </div>
      </div>

      {/* Sub-Tab 1: Customers */}
      {activeSubTab === 'customers' ? (
        <div className="p-6 rounded-3xl bg-surface border border-warmgray-200 shadow-soft overflow-x-auto space-y-4">
          <h3 className="font-serif text-lg font-bold text-charcoal-900 font-sans">Directorio de Clientes B2B & Retail</h3>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-warmgray-200 text-warmgray-500">
                <th className="py-3 px-4">Cliente / Empresa</th>
                <th className="py-3 px-4">Correo Electrónico</th>
                <th className="py-3 px-4">Tipo de Perfil</th>
                <th className="py-3 px-4">Línea de Crédito</th>
                <th className="py-3 px-4">Plazo de Pago</th>
                <th className="py-3 px-4">Exonerado ITBMS</th>
                <th className="py-3 px-4">Vendedor Asignado</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warmgray-100">
              {customersOnly.map((user) => (
                <tr key={user.id} className="hover:bg-canvas transition-colors">
                  <td className="py-4 px-4 font-bold text-charcoal-900 font-sans">
                    {user.companyName || user.fullName}
                    {user.rucDv && <p className="text-[10px] text-warmgray-500 font-mono">{user.rucDv}</p>}
                  </td>
                  <td className="py-4 px-4 text-warmgray-700">{user.email}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                      user.role === 'cliente_b2b'
                        ? 'bg-forest-700/10 text-forest-700'
                        : 'bg-warmgray-200 text-charcoal-900'
                    }`}>
                      {user.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-bold">
                    {editingUserId === user.id ? (
                      <div className="flex items-center gap-1">
                        <span className="text-warmgray-500">$</span>
                        <input
                          type="number"
                          value={newLimitInput}
                          onChange={(e) => setNewLimitInput(parseFloat(e.target.value) || 0)}
                          className="w-24 px-2 py-1 bg-canvas border border-warmgray-200 rounded font-bold text-charcoal-900"
                        />
                        <button
                          onClick={() => handleSaveLimit(user.id)}
                          className="p-1.5 bg-forest-700 text-white rounded hover:bg-forest-800"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <span>${user.creditLimit.toFixed(2)}</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-warmgray-700">
                    {user.creditLimit > 0 ? `${user.creditDays} Días` : 'N/A (Contado)'}
                  </td>
                  <td className="py-4 px-4">
                    {user.isTaxExempt ? (
                      <span className="px-2 py-0.5 rounded bg-forest-700/10 text-forest-700 font-bold">SÍ Exonerado</span>
                    ) : (
                      <span className="text-warmgray-400">7% ITBMS Regular</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-warmgray-700">{user.salesRepName || 'N/A'}</td>
                  <td className="py-4 px-4 text-right">
                    {user.role === 'cliente_b2b' && (
                      <button
                        onClick={() => {
                          setEditingUserId(user.id);
                          setNewLimitInput(user.creditLimit);
                        }}
                        className="px-3 py-1.5 bg-canvas hover:bg-warmgray-200 text-charcoal-900 border border-warmgray-200 rounded-lg text-xs font-medium transition-colors inline-flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Editar Crédito</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Sub-Tab 2: Sales Rep Accounts Control */
        <div className="space-y-6 animate-fadeIn">
          
          {/* Header Action Bar */}
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-xl font-bold text-charcoal-900 font-sans">
              Control de Vendedores Comercial B2B & Comisiones
            </h3>

            <button
              onClick={() => setIsCreatingRep(!isCreatingRep)}
              className="px-5 py-2.5 bg-charcoal-900 hover:bg-terracotta-600 text-white rounded-full font-bold transition-all shadow-xs flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4 text-terracotta-500" />
              <span>+ Crear Nueva Cuenta de Vendedor</span>
            </button>
          </div>

          {/* New Sales Rep Modal Form */}
          {isCreatingRep && (
            <form onSubmit={handleCreateRepSubmit} className="p-8 rounded-3xl bg-surface border-2 border-amber-500 shadow-lifted space-y-6 animate-slideDown">
              <div className="flex justify-between items-center border-b border-warmgray-200 pb-3">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-amber-600" />
                  <h3 className="font-serif text-xl font-bold text-charcoal-900 font-sans">
                    Alta de Nueva Cuenta de Vendedor Comercial
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCreatingRep(false)}
                  className="p-1.5 hover:bg-warmgray-200 rounded-full text-warmgray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-charcoal-900 mb-1">Nombre Completo del Vendedor *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Ana María Rodríguez"
                    value={newRepForm.fullName}
                    onChange={(e) => setNewRepForm(prev => ({ ...prev, fullName: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-canvas border border-warmgray-200 rounded-xl text-charcoal-900 focus:outline-none focus:border-amber-600 font-sans"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal-900 mb-1">Correo Electrónico de Acceso *</label>
                  <input
                    type="email"
                    required
                    placeholder="Ej. vendedor2@shopahora.com"
                    value={newRepForm.email}
                    onChange={(e) => setNewRepForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-canvas border border-warmgray-200 rounded-xl text-charcoal-900 focus:outline-none focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal-900 mb-1">Territorio / Provincias Asignadas</label>
                  <input
                    type="text"
                    placeholder="Ej. Panamá Centro, Chiriquí & Provincias Centrales"
                    value={newRepForm.assignedTerritory}
                    onChange={(e) => setNewRepForm(prev => ({ ...prev, assignedTerritory: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-canvas border border-warmgray-200 rounded-xl text-charcoal-900 focus:outline-none focus:border-amber-600 font-sans"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal-900 mb-1">Porcentaje de Comisión sobre Ventas (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="20"
                    value={newRepForm.commissionRate}
                    onChange={(e) => setNewRepForm(prev => ({ ...prev, commissionRate: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-4 py-2.5 bg-canvas border border-warmgray-200 rounded-xl font-bold text-purple-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal-900 mb-1">Descuento Máximo Autónomo Aprobado (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={newRepForm.maxDiscountAuthorized}
                    onChange={(e) => setNewRepForm(prev => ({ ...prev, maxDiscountAuthorized: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-2.5 bg-canvas border border-warmgray-200 rounded-xl font-bold text-forest-700 focus:outline-none"
                  />
                  <p className="text-[10px] text-warmgray-500 mt-1 font-sans">
                    Si el vendedor ofrece un descuento mayor a este %, requerirá tu aprobación gerencial.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-warmgray-200">
                <button
                  type="button"
                  onClick={() => setIsCreatingRep(false)}
                  className="px-5 py-2.5 bg-canvas hover:bg-warmgray-200 text-charcoal-900 border border-warmgray-200 rounded-full font-bold"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-7 py-2.5 bg-charcoal-900 hover:bg-amber-600 text-white rounded-full font-bold shadow-lifted flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>Crear Cuenta de Vendedor</span>
                </button>
              </div>
            </form>
          )}

          {/* Sales Reps Table */}
          <div className="p-6 rounded-3xl bg-surface border border-warmgray-200 shadow-soft overflow-x-auto space-y-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-warmgray-200 text-warmgray-500">
                  <th className="py-3 px-4">Vendedor / Email</th>
                  <th className="py-3 px-4">Territorio Asignado</th>
                  <th className="py-3 px-4">Comisión (%)</th>
                  <th className="py-3 px-4">Límite Descuento Autónomo</th>
                  <th className="py-3 px-4">Estado Cuenta</th>
                  <th className="py-3 px-4 text-right">Acción Gerencial</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warmgray-100">
                {salesRepsOnly.map((rep) => {
                  const isActive = Boolean(rep.isActiveAccount ?? true);
                  const isEditing = editingRepId === rep.id;

                  return (
                    <tr key={rep.id} className="hover:bg-canvas transition-colors">
                      <td className="py-4 px-4 font-bold text-charcoal-900 font-sans">
                        {rep.fullName}
                        <p className="text-[10px] font-mono text-warmgray-500">{rep.email}</p>
                      </td>

                      <td className="py-4 px-4 font-sans text-warmgray-700">
                        {rep.assignedTerritory || 'Panamá Centro'}
                      </td>

                      <td className="py-4 px-4 font-bold text-purple-700">
                        {isEditing ? (
                          <input
                            type="number"
                            step="0.5"
                            value={repCommissionInput}
                            onChange={(e) => setRepCommissionInput(parseFloat(e.target.value) || 0)}
                            className="w-16 px-2 py-1 bg-canvas border border-warmgray-200 rounded font-bold text-purple-700"
                          />
                        ) : (
                          <span>{rep.commissionRate || 4.5}%</span>
                        )}
                      </td>

                      <td className="py-4 px-4 font-bold text-forest-700">
                        {isEditing ? (
                          <input
                            type="number"
                            value={repMaxDiscountInput}
                            onChange={(e) => setRepMaxDiscountInput(parseInt(e.target.value) || 0)}
                            className="w-16 px-2 py-1 bg-canvas border border-warmgray-200 rounded font-bold text-forest-700"
                          />
                        ) : (
                          <span>Máx. {rep.maxDiscountAuthorized || 15}% OFF</span>
                        )}
                      </td>

                      <td className="py-4 px-4">
                        {isActive ? (
                          <span className="px-2.5 py-1 rounded-full bg-forest-700/10 text-forest-700 font-bold">
                            ✓ Activo
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-red-600/10 text-red-600 font-bold">
                            Inactivo
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-right space-x-2">
                        {isEditing ? (
                          <button
                            onClick={() => handleSaveRepPermissions(rep.id)}
                            className="px-3 py-1.5 bg-forest-700 hover:bg-forest-800 text-white rounded-lg font-bold text-[11px]"
                          >
                            Guardar
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingRepId(rep.id);
                              setRepCommissionInput(rep.commissionRate || 4.5);
                              setRepMaxDiscountInput(rep.maxDiscountAuthorized || 15);
                            }}
                            className="px-3 py-1.5 bg-canvas hover:bg-warmgray-200 text-charcoal-900 border border-warmgray-200 rounded-lg font-bold text-[11px] inline-flex items-center gap-1"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Editar Permisos</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleToggleRepActive(rep.id)}
                          className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition-colors ${
                            isActive
                              ? 'bg-red-600/10 text-red-600 hover:bg-red-600 hover:text-white'
                              : 'bg-forest-700 text-white hover:bg-forest-800'
                          }`}
                        >
                          {isActive ? 'Inactivar' : 'Activar'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      )}

    </div>
  );
};
