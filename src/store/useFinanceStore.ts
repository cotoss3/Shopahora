import { create } from 'zustand';
import { B2BCreditAccount, PostdatedCheck } from '../types/product';

interface FinanceState {
  creditAccounts: B2BCreditAccount[];
  postdatedChecks: PostdatedCheck[];
  
  // Actions
  applyEarlyDiscount: (invoiceId: string) => void;
  markInvoicePaid: (invoiceId: string) => void;
  addPostdatedCheck: (check: Omit<PostdatedCheck, 'id'>) => void;
  exportStatementToCSV: (userId?: string) => void;
}

const INITIAL_CREDIT_ACCOUNTS: B2BCreditAccount[] = [
  {
    id: 'inv-101',
    userId: 'u-b2b-1',
    userEmail: 'cliente.b2b@shopahora.com',
    companyName: 'Distribuidora Istmo S.A.',
    salesRepName: 'Carlos Mendoza',
    invoiceNumber: 'FACT-2026-0891',
    amount: 2450.00,
    dueDate: '2026-09-30',
    status: 'vigente',
    earlyDiscountPercent: 5.0,
    earlyDiscountExpiry: '2026-09-20'
  },
  {
    id: 'inv-102',
    userId: 'u-b2b-1',
    userEmail: 'cliente.b2b@shopahora.com',
    companyName: 'Distribuidora Istmo S.A.',
    salesRepName: 'Carlos Mendoza',
    invoiceNumber: 'FACT-2026-0740',
    amount: 1800.00,
    dueDate: '2026-09-05',
    status: 'vencida',
    earlyDiscountPercent: 0,
    earlyDiscountExpiry: '2026-08-25'
  }
];

const INITIAL_POSTDATED_CHECKS: PostdatedCheck[] = [
  {
    id: 'chk-501',
    userId: 'u-b2b-1',
    companyName: 'Distribuidora Istmo S.A.',
    bankName: 'Banco General Panamá',
    checkNumber: '0049281',
    amount: 1800.00,
    checkDate: '2026-09-25',
    status: 'pendiente'
  }
];

export const useFinanceStore = create<FinanceState>((set, get) => ({
  creditAccounts: INITIAL_CREDIT_ACCOUNTS,
  postdatedChecks: INITIAL_POSTDATED_CHECKS,

  applyEarlyDiscount: (invoiceId) => {
    set(state => ({
      creditAccounts: state.creditAccounts.map(inv => {
        if (inv.id === invoiceId) {
          const discountVal = inv.amount * (inv.earlyDiscountPercent / 100);
          return {
            ...inv,
            amount: inv.amount - discountVal,
            earlyDiscountPercent: 0 // Discount consumed
          };
        }
        return inv;
      })
    }));
  },

  markInvoicePaid: (invoiceId) => {
    set(state => ({
      creditAccounts: state.creditAccounts.map(inv =>
        inv.id === invoiceId ? { ...inv, status: 'pagada' } : inv
      )
    }));
  },

  addPostdatedCheck: (check) => {
    const newCheck: PostdatedCheck = {
      ...check,
      id: `chk-${Date.now()}`
    };
    set(state => ({
      postdatedChecks: [newCheck, ...state.postdatedChecks]
    }));
  },

  exportStatementToCSV: (userId) => {
    const accounts = get().creditAccounts.filter(a => !userId || a.userId === userId);
    
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Factura,Cliente,Vendedor,Monto,Vencimiento,Estado,Descuento Pronto Pago (%)\n';

    accounts.forEach(acc => {
      csvContent += `${acc.invoiceNumber},"${acc.companyName}","${acc.salesRepName}",${acc.amount},${acc.dueDate},${acc.status},${acc.earlyDiscountPercent}%\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Estado_de_Cuenta_ShopAhora_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}));
