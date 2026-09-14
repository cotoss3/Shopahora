import React from 'react';
import { CreditCard, AlertTriangle, CheckCircle2, Clock, Download, FileSpreadsheet, DollarSign } from 'lucide-react';
import { useFinanceStore } from '../../../store/useFinanceStore';

export const SalesFinanceTab: React.FC = () => {
  const { creditAccounts, postdatedChecks, applyEarlyDiscount, markInvoicePaid, exportStatementToCSV } = useFinanceStore();

  const totalPortfolioCredit = creditAccounts.reduce((sum, item) => sum + item.amount, 0);
  const overdueInvoices = creditAccounts.filter(item => item.status === 'vencida');

  return (
    <div className="space-y-6 font-mono text-xs animate-fadeIn">
      
      {/* Header */}
      <div className="p-6 rounded-3xl bg-surface border border-warmgray-200 shadow-soft flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-charcoal-900 font-sans">
            Gestión de Crédito, Facturación & Cobranzas
          </h1>
          <p className="text-warmgray-500 text-xs">
            Control de cuentas por cobrar, descuentos por pronto pago y custodia de cheques posfechados.
          </p>
        </div>

        <button
          onClick={() => exportStatementToCSV()}
          className="px-4 py-2.5 bg-canvas hover:bg-warmgray-200 text-charcoal-900 border border-warmgray-200 rounded-full font-bold transition-colors flex items-center gap-2"
        >
          <Download className="w-4 h-4 text-warmgray-500" />
          <span>Exportar Estado de Cuenta (CSV)</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-surface border border-warmgray-200 space-y-2">
          <span className="uppercase text-warmgray-500 text-[10px]">Cartera Total a Crédito</span>
          <p className="text-2xl font-bold text-charcoal-900">${totalPortfolioCredit.toFixed(2)}</p>
          <p className="text-warmgray-500 text-[11px]">2 Facturas comerciales activas</p>
        </div>

        <div className="p-6 rounded-2xl bg-surface border border-warmgray-200 space-y-2">
          <span className="uppercase text-warmgray-500 text-[10px]">Facturas Vencidas</span>
          <p className="text-2xl font-bold text-red-600">${overdueInvoices.reduce((a, b) => a + b.amount, 0).toFixed(2)}</p>
          <p className="text-red-500 font-bold text-[11px]">{overdueInvoices.length} Alerta(s) de Mora</p>
        </div>

        <div className="p-6 rounded-2xl bg-surface border border-warmgray-200 space-y-2">
          <span className="uppercase text-warmgray-500 text-[10px]">Cheques Posfechados en Custodia</span>
          <p className="text-2xl font-bold text-forest-700">
            ${postdatedChecks.reduce((a, b) => a + b.amount, 0).toFixed(2)}
          </p>
          <p className="text-forest-700 text-[11px]">{postdatedChecks.length} Cheque(s) Registrados</p>
        </div>
      </div>

      {/* Accounts Table */}
      <div className="p-6 rounded-3xl bg-surface border border-warmgray-200 shadow-soft space-y-4">
        <h2 className="font-serif text-lg font-bold text-charcoal-900 font-sans">Facturas Pendientes por Cobrar</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-warmgray-200 text-warmgray-500">
                <th className="py-3 px-4">N° Factura</th>
                <th className="py-3 px-4">Cliente Comprador</th>
                <th className="py-3 px-4">Monto ($)</th>
                <th className="py-3 px-4">Vencimiento</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4">Pronto Pago</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warmgray-100">
              {creditAccounts.map((acc) => (
                <tr key={acc.id} className="hover:bg-canvas transition-colors">
                  <td className="py-4 px-4 font-bold text-charcoal-900">{acc.invoiceNumber}</td>
                  <td className="py-4 px-4 font-sans font-bold text-charcoal-900">{acc.companyName}</td>
                  <td className="py-4 px-4 font-bold">${acc.amount.toFixed(2)}</td>
                  <td className="py-4 px-4 text-warmgray-700">{acc.dueDate}</td>
                  <td className="py-4 px-4">
                    {acc.status === 'vencida' ? (
                      <span className="px-2.5 py-1 rounded-full bg-red-600/10 text-red-600 font-bold flex items-center gap-1 w-max">
                        <AlertTriangle className="w-3 h-3" /> Vencida
                      </span>
                    ) : acc.status === 'pagada' ? (
                      <span className="px-2.5 py-1 rounded-full bg-forest-700/10 text-forest-700 font-bold flex items-center gap-1 w-max">
                        <CheckCircle2 className="w-3 h-3" /> Pagada
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-700 font-bold flex items-center gap-1 w-max">
                        <Clock className="w-3 h-3" /> Vigente
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    {acc.earlyDiscountPercent > 0 ? (
                      <button
                        onClick={() => applyEarlyDiscount(acc.id)}
                        className="px-2.5 py-1 rounded-full bg-forest-700 text-white font-bold hover:bg-forest-800 transition-colors"
                      >
                        Aplicar {acc.earlyDiscountPercent}% OFF
                      </button>
                    ) : (
                      <span className="text-warmgray-400">N/A</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-right">
                    {acc.status !== 'pagada' && (
                      <button
                        onClick={() => markInvoicePaid(acc.id)}
                        className="px-3 py-1.5 bg-charcoal-900 hover:bg-terracotta-600 text-white rounded-lg font-bold transition-colors text-[11px]"
                      >
                        Registrar Pago
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Postdated Checks Section */}
      <div className="p-6 rounded-3xl bg-surface border border-warmgray-200 shadow-soft space-y-4">
        <h2 className="font-serif text-lg font-bold text-charcoal-900 font-sans">Cheques Posfechados en Custodia</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {postdatedChecks.map((check) => (
            <div key={check.id} className="p-4 rounded-2xl bg-canvas border border-warmgray-200 flex justify-between items-center text-xs font-mono">
              <div className="space-y-1">
                <p className="font-bold text-charcoal-900">{check.bankName} - #{check.checkNumber}</p>
                <p className="text-warmgray-500">Emisor: {check.companyName}</p>
                <p className="text-warmgray-700">Fecha de Cobro: {check.checkDate}</p>
              </div>
              <div className="text-right space-y-1">
                <span className="font-bold text-base text-forest-700">${check.amount.toFixed(2)}</span>
                <span className="block px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-700 text-[10px] font-bold">
                  {check.status.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
