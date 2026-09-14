import React from 'react';
import { ArrowLeft, ShieldCheck, Lock, Eye, CheckCircle2, FileText, UserCheck } from 'lucide-react';
import { useNavigationStore } from '../../store/useNavigationStore';

export const PrivacyPage: React.FC = () => {
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
          <span className="text-charcoal-900 font-bold">Política de Privacidad y Protección de Datos</span>
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
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-700/10 text-forest-700 font-mono text-xs font-bold">
            <Lock className="w-4 h-4" />
            <span>Protección & Seguridad de Datos Personales</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900">
            Política de Privacidad & Tratamiento de Datos
          </h1>
          <p className="text-xs text-warmgray-500 font-mono">
            Conforme al Decreto Ejecutivo N° 285 de 2021 | ANTAIP República de Panamá
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-6 text-xs sm:text-sm text-warmgray-700 leading-relaxed font-sans">
          
          <div className="space-y-2">
            <h3 className="font-serif text-lg font-bold text-charcoal-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-forest-700 text-white font-mono text-xs flex items-center justify-center font-bold">1</span>
              Compromiso de Confidencialidad y Principios Legales
            </h3>
            <p>
              En <strong>ShopAhora</strong> garantizamos la protección, confidencialidad e integridad de los datos personales de nuestros clientes de conformidad estricta con la <strong>Ley N° 81 de 26 de marzo de 2019</strong> de la República de Panamá. El tratamiento de sus datos se rige por los principios de lealtad, finalidad, proporcionalidad, veracidad, transparencia y seguridad.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-serif text-lg font-bold text-charcoal-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-forest-700 text-white font-mono text-xs flex items-center justify-center font-bold">2</span>
              Datos Recabados y Finalidad del Tratamiento
            </h3>
            <p>
              ShopAhora recopila únicamente la información necesaria para el procesamiento de compras e integración logística:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Datos Personales y de Contacto:</strong> Nombre, teléfono, correo electrónico y dirección exacta en Panamá.</li>
              <li><strong>Datos Fiscales y Comerciales (B2B):</strong> RUC, DV, Razón Social, referencias comerciales y límites de crédito aprobados.</li>
              <li><strong>Datos de Entrega:</strong> Provincia, corregimiento y especificaciones de despacho para la flota vehicular o courier nacional.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-serif text-lg font-bold text-charcoal-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-forest-700 text-white font-mono text-xs flex items-center justify-center font-bold">3</span>
              Ejercicio de Derechos ARCO (Panamá)
            </h3>
            <p>
              El titular de los datos personales tiene derecho a ejercer en cualquier momento sus derechos <strong>ARCO</strong>:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 font-mono text-xs">
              <div className="p-3 rounded-xl bg-canvas border border-warmgray-200">
                <strong className="text-charcoal-900 block">Acceso:</strong> Consultar qué datos personales suyos están almacenados en nuestras bases de datos.
              </div>
              <div className="p-3 rounded-xl bg-canvas border border-warmgray-200">
                <strong className="text-charcoal-900 block">Rectificación:</strong> Solicitar la corrección de datos inexactos o desactualizados.
              </div>
              <div className="p-3 rounded-xl bg-canvas border border-warmgray-200">
                <strong className="text-charcoal-900 block">Cancelación:</strong> Solicitar la eliminación de sus datos cuando hayan dejado de ser necesarios.
              </div>
              <div className="p-3 rounded-xl bg-canvas border border-warmgray-200">
                <strong className="text-charcoal-900 block">Oposición:</strong> Oponerse al tratamiento de sus datos para fines mercadotécnicos o boletines.
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-serif text-lg font-bold text-charcoal-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-forest-700 text-white font-mono text-xs flex items-center justify-center font-bold">4</span>
              Seguridad y Encriptación de Datos
            </h3>
            <p>
              Nuestra base de datos utiliza encriptación de grado bancario (AES-256 / SSL/TLS) integrada con la infraestructura de Supabase PostgreSQL y pasarelas transaccionales certificadas PCI-DSS en Panamá. No comercializamos ni vendemos datos personales a terceros bajo ninguna circunstancia.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-serif text-lg font-bold text-charcoal-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-forest-700 text-white font-mono text-xs flex items-center justify-center font-bold">5</span>
              Oficial de Protección de Datos
            </h3>
            <p>
              Para ejercer sus derechos ARCO o consultar aspectos de privacidad, puede comunicarse directamente con nuestro Oficial de Protección de Datos a través del correo: <span className="font-mono font-bold text-forest-700">privacidad@shopahora.com.pa</span>.
            </p>
          </div>

        </div>

        {/* Footer Contact Stamp */}
        <div className="p-6 rounded-2xl bg-canvas border border-warmgray-200 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center gap-3">
            <UserCheck className="w-6 h-6 text-forest-700 flex-shrink-0" />
            <div>
              <p className="font-bold text-charcoal-900">Registrado ante ANTAIP Panamá</p>
              <p className="text-warmgray-500">Oficial de Protección de Datos | Certificación Ley 81 de 2019</p>
            </div>
          </div>

          <button
            onClick={() => navigateTo('home')}
            className="px-5 py-2.5 bg-charcoal-900 text-white rounded-full font-medium hover:bg-terracotta-600 transition-colors"
          >
            Entendido
          </button>
        </div>

      </div>

    </section>
  );
};
