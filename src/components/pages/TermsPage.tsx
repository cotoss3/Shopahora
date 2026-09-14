import React from 'react';
import { ArrowLeft, ShieldCheck, Scale, FileText, Building2, CheckCircle2 } from 'lucide-react';
import { useNavigationStore } from '../../store/useNavigationStore';

export const TermsPage: React.FC = () => {
  const { navigateTo } = useNavigationStore();

  return (
    <section className="pt-28 pb-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
      
      {/* Header & Back Button */}
      <div className="flex items-center justify-between border-b border-warmgray-200/80 pb-4 font-mono text-xs text-warmgray-500">
        <div className="flex items-center gap-2">
          <button onClick={() => navigateTo('home')} className="hover:text-terracotta-600 transition-colors">
            Inicio
          </button>
          <span>/</span>
          <span className="text-charcoal-900 font-bold">Términos y Condiciones de Uso y Venta</span>
        </div>

        <button
          onClick={() => navigateTo('home')}
          className="px-4 py-2 bg-surface border border-warmgray-200 rounded-full text-xs font-mono font-medium text-charcoal-900 hover:bg-warmgray-100 transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4 text-terracotta-600" />
          <span>Volver al Catálogo</span>
        </button>
      </div>

      {/* Main Document Card */}
      <div className="p-8 sm:p-12 rounded-3xl bg-surface border border-warmgray-200 shadow-soft space-y-8">
        
        {/* Title Banner */}
        <div className="space-y-3 border-b border-warmgray-200 pb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-600/10 text-purple-700 font-mono text-xs font-bold">
            <Scale className="w-4 h-4" />
            <span>Términos Comerciales & Garantías de Compra</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900">
            Términos y Condiciones de Comercio Electrónico
          </h1>
          <p className="text-xs text-warmgray-500 font-mono">
            Última actualización: Septiembre 2026 | República de Panamá
          </p>
        </div>

        {/* Legal Sections */}
        <div className="space-y-6 text-xs sm:text-sm text-warmgray-700 leading-relaxed font-sans">
          
          <div className="space-y-2">
            <h3 className="font-serif text-lg font-bold text-charcoal-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-charcoal-900 text-white font-mono text-xs flex items-center justify-center font-bold">1</span>
              Marco Regulatorio e Identificación de la Empresa
            </h3>
            <p>
              El presente contrato regula los términos y condiciones de compraventa y prestación de servicios aplicables a través de la plataforma e-commerce <strong>ShopAhora</strong> en la República de Panamá, operada de conformidad con la <strong>Ley N° 51 de 22 de julio de 2008</strong> sobre Comercio Electrónico y Firma Digital, modificada por la Ley N° 82 de 2012, y la <strong>Ley N° 45 de 31 de octubre de 2007</strong> sobre Protección al Consumidor y Defensa de la Competencia (ACODECO).
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-serif text-lg font-bold text-charcoal-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-charcoal-900 text-white font-mono text-xs flex items-center justify-center font-bold">2</span>
              Canales de Venta: Retail (B2C) y Comercial Mayorista (B2B)
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Canal Retail (B2C):</strong> Dirigido a consumidores finales con pagos con tarjeta de crédito/débito en línea, Yappy o efectivo contra entrega. El inventario se visualiza por disponibilidad sin mostrar stock físico en bodega.
              </li>
              <li>
                <strong>Canal Comercial Mayorista (B2B):</strong> Dirigido a clientes comerciales con RUC y DV registrado en Panamá. Maneja precios con descuentos por volumen, existencias físicas exactas en bodega, crédito comercial de 15, 30 y 45 días, aceptación de cheques posfechados y modalidad de dropshipping habilitada.
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-serif text-lg font-bold text-charcoal-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-charcoal-900 text-white font-mono text-xs flex items-center justify-center font-bold">3</span>
              Facturación Fiscal Panamá & ITBMS (7%)
            </h3>
            <p>
              Todos los precios listados incluyen o desglosan el Impuesto al Transferencia de Bienes Corporales Muebles y la Prestación de Servicios (<strong>ITBMS del 7%</strong>) según exige la Dirección General de Ingresos (DGI) de Panamá, salvo aquellos productos clasificados legalmente como exonerados. Las facturas comerciales o facturas electrónicas oficiales serán emitidas conforme al Sistema de Facturación Electrónica de Panamá (SFEP).
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-serif text-lg font-bold text-charcoal-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-charcoal-900 text-white font-mono text-xs flex items-center justify-center font-bold">4</span>
              Derecho de Retracto, Devoluciones y Garantías (ACODECO)
            </h3>
            <p>
              De acuerdo con la legislación panameña de protección al consumidor, los compradores cuentan con el derecho legal de revocación o retracto de <strong>3 días hábiles</strong> posteriores a la recepción del producto en ventas a distancia, siempre que el bien se conserve sin uso y en su empaque original. Todos los productos cuentan con garantía legal por defectos de fábrica gestionada a través de nuestro módulo supervisor de bodega.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-serif text-lg font-bold text-charcoal-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-charcoal-900 text-white font-mono text-xs flex items-center justify-center font-bold">5</span>
              Jurisdicción y Ley Aplicable
            </h3>
            <p>
              Cualquier controversia derivada de la interpretación o ejecución del presente contrato será sometida a las leyes de la República de Panamá y a la jurisdicción de los tribunales competentes de la Ciudad de Panamá.
            </p>
          </div>

        </div>

        {/* Footer Contact Stamp */}
        <div className="p-6 rounded-2xl bg-canvas border border-warmgray-200 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-forest-700 flex-shrink-0" />
            <div>
              <p className="font-bold text-charcoal-900">Cumplimiento Normativo Garantizado</p>
              <p className="text-warmgray-500">ShopAhora S.A. | RUC 155789234-2-2026 DV 45 | Ciudad de Panamá</p>
            </div>
          </div>

          <button
            onClick={() => navigateTo('home')}
            className="px-5 py-2.5 bg-charcoal-900 text-white rounded-full font-medium hover:bg-terracotta-600 transition-colors"
          >
            Aceptar y Continuar
          </button>
        </div>

      </div>

    </section>
  );
};
